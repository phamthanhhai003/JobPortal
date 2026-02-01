import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import create_engine, pool
import math

# ✅ CORS
from fastapi.middleware.cors import CORSMiddleware


DB_CONFIG = {
    "host": "172.25.242.21",
    "port": 5432,
    "database": "datn",
    "user": "postgres",
    "password": "newpassword"
}

DATABASE_URL = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"

# Connection pooling để tái sử dụng kết nối
engine = create_engine(
    DATABASE_URL,
    poolclass=pool.QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True
)

# =====================
# IN-MEMORY CACHE
# =====================
company_cache = {}  # {corporate_number: company_data}
recruit_cache = {}  # {media_internal_id: recruit_data}
all_companies = []  # List toàn bộ companies
all_recruits = []   # List toàn bộ recruits

# =====================
# HÀM XỬ LÝ NaN/Inf
# =====================
def clean_dataframe(df):
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.where(pd.notna(df), None)
    return df

def sanitize_value(val):
    if val is pd.NA:
        return None
    if isinstance(val, np.generic):
        val = val.item()
    if isinstance(val, float):
        if math.isnan(val) or math.isinf(val):
            return None
    return val

def sanitize_dict(data):
    if isinstance(data, dict):
        return {k: sanitize_dict(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_dict(item) for item in data]
    else:
        return sanitize_value(data)

# =====================
# LOAD DATA VÀO CACHE
# =====================
def load_cache():
    global company_cache, recruit_cache, all_companies, all_recruits
    
    print("📥 Loading company data...")
    company_df = pd.read_sql("SELECT * FROM company", engine)
    company_df_filtered = company_df.loc[:, ~company_df.columns.str.contains('quality')]
    company_df_filtered = company_df.loc[:, ~company_df.columns.str.contains('updated_at')]
    company_df_clean = clean_dataframe(company_df_filtered)
    
    # Build cache
    all_companies = []
    for _, row in company_df_clean.iterrows():
        company_dict = sanitize_dict(row.to_dict())
        all_companies.append(company_dict)
        
        corp_num = str(row.get('corporate_number'))
        if corp_num and corp_num != 'None':
            company_cache[corp_num] = company_dict
    
    print(f"✅ Cached {len(company_cache)} companies")
    
    print("📥 Loading recruitment data...")
    recruit_df = pd.read_sql("SELECT * FROM recruit WHERE media_internal_id IS NOT NULL", engine)
    recruit_df_clean = clean_dataframe(recruit_df)
    
    all_recruits = []
    for _, row in recruit_df_clean.iterrows():
        recruit_dict = sanitize_dict(row.to_dict())
        all_recruits.append(recruit_dict)
        
        media_id = str(row.get('media_internal_id'))
        if media_id and media_id != 'None':
            recruit_cache[media_id] = recruit_dict
    
    print(f"✅ Cached {len(recruit_cache)} recruitments")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Company(BaseModel):
    corporate_number: str
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_description: Optional[str] = None
    company_industry: Optional[str] = None
    company_domain: Optional[str] = None

class Recruitment(BaseModel):
    media_internal_id: str
    corporate_number: Optional[str] = None
    job_category: Optional[str] = None
    requirements: Optional[str] = None
    address: Optional[str] = None


@app.get("/company/{corporate_number}")
async def get_company(corporate_number: str):
    """Lấy thông tin công ty từ cache - SIÊU NHANH"""
    company = company_cache.get(corporate_number)
    if company is None:
        raise HTTPException(status_code=404, detail="Công ty không tồn tại")
    return company

@app.get("/recruitment/{media_internal_id}")
async def get_recruitment(media_internal_id: str):
    """Lấy thông tin tuyển dụng từ cache - SIÊU NHANH"""
    recruitment = recruit_cache.get(media_internal_id)
    if recruitment is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin tuyển dụng")
    
    corp = recruitment.get("corporate_number")
    comp = company_cache.get(str(corp)) if corp else None
    
    return {
        "recruitment": recruitment,
        "company": comp
    }

@app.get("/recruitment")
async def get_all_recruitments():
    """Lấy tất cả tuyển dụng từ cache - SIÊU NHANH"""
    return all_recruits

@app.get("/")
async def root():
    """Lấy tất cả công ty từ cache - SIÊU NHANH"""
    return all_companies

@app.get("/debug/check-data")
async def check_data():
    """Kiểm tra số lượng dữ liệu trong cache"""
    return {
        "company_count": len(company_cache),
        "recruit_count": len(recruit_cache),
        "status": "ok",
        "cache_enabled": True
    }

@app.get("/health")
async def health_check():
    """Kiểm tra kết nối database và cache"""
    try:
        test = pd.read_sql("SELECT 1 as test", engine)
        return {
            "status": "healthy",
            "database": "connected",
            "companies": len(company_cache),
            "recruitments": len(recruit_cache),
            "cache_status": "active"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/admin/reload-cache")
async def reload_cache():
    """Reload cache (dùng khi có dữ liệu mới trong DB)"""
    try:
        load_cache()
        return {
            "status": "success",
            "companies_loaded": len(company_cache),
            "recruitments_loaded": len(recruit_cache)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reload error: {str(e)}")

# =====================
# STARTUP EVENT
# =====================
@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("🚀 FastAPI Server Starting...")
    print(f"🔗 Database: {DB_CONFIG['database']}")
    print("📥 Loading data into memory cache...")
    
    load_cache()
    
    print("📡 Ready to serve requests")
    print("⚡ All endpoints now using in-memory cache!")
    print("=" * 50)

@app.on_event("shutdown")
async def shutdown_event():
    engine.dispose()
    print("🛑 Server shutdown")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)