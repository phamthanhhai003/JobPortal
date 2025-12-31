
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Company, Recruitment } from '../types';
import { JobCard } from '../components/JobCard';
import { QuickViewDrawer } from '../components/QuickViewDrawer';
import { DetailPageSkeleton } from '../components/Skeletons';
import { Globe, MapPin, Building, ArrowLeft, Map, Sparkles, Link2 } from 'lucide-react';

export const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [allCompanies, allJobs] = await Promise.all([
            api.getCompanies(),
            api.getAllRecruitments()
        ]);
        const found = allCompanies.find(c => c.corporate_number === id);
        if (!found) {
            setError('Không tìm thấy doanh nghiệp này.');
            return;
        }
        setCompany(found);
        setJobs(allJobs.filter(job => job.corporate_number === id));
      } catch (err) {
        setError('Lỗi khi tải dữ liệu đối tác.');
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto"><DetailPageSkeleton /></div>;

  if (error || !company) {
    return (
      <div className="text-center py-32 bg-white rounded-3xl border border-red-50 shadow-sm mt-4">
        <h2 className="text-2xl font-bold text-red-600 mb-6">{error || 'Công ty không tồn tại'}</h2>
        <Link to="/companies" className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-colors">
            Trở về danh sách đối tác
        </Link>
      </div>
    );
  }

  const logoSrc = company.company_logo || (company.company_domain ? `https://logo.clearbit.com/${company.company_domain.replace(/^https?:\/\//, '').split('/')[0]}` : null);

  return (
    <div className="space-y-12 animate-slide-up">
      <QuickViewDrawer jobId={quickViewId} onClose={() => setQuickViewId(null)} />
      
      <Link to="/companies" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
      </Link>

      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="orange-gradient h-48 w-full relative">
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <Building className="w-64 h-64 text-white" />
            </div>
            <div className="absolute -bottom-16 left-12">
                <div className="h-32 w-32 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center p-5 border-4 border-white overflow-hidden">
                    {logoSrc && !imgError ? (
                      <img src={logoSrc} alt={company.company_name} className="w-full h-full object-contain" onError={() => setImgError(true)} />
                    ) : (
                      <Building className="w-16 h-16 text-orange-600" />
                    )}
                </div>
            </div>
        </div>
        
        <div className="pt-24 px-12 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{company.company_name}</h1>
                    <div className="flex flex-wrap gap-4 items-center">
                        <span className="flex items-center text-orange-700 font-extrabold bg-orange-50 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest">
                            <Map className="w-3.5 h-3.5 mr-2" />
                            {company.province || 'Toàn quốc'}
                        </span>
                        <span className="bg-orange-50/50 px-4 py-1.5 rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest border border-orange-100">
                            {company.company_industry || 'Doanh nghiệp'}
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    {company.company_domain && (
                        <a href={company.company_domain.startsWith('http') ? company.company_domain : `https://${company.company_domain}`} target="_blank" rel="noreferrer" className="inline-flex items-center px-8 py-4 orange-gradient text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-200 transition-all shadow-md active:scale-95">
                            <Globe className="w-4 h-4 mr-2" />
                            Truy cập website
                        </a>
                    )}
                    {company.source_company_url && (
                        <a href={company.source_company_url} target="_blank" rel="noreferrer" className="inline-flex items-center px-8 py-4 border-2 border-orange-600 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all active:scale-95">
                            <Link2 className="w-4 h-4 mr-2" />
                            Nguồn dữ liệu
                        </a>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 border-t border-gray-50 pt-12">
                <div>
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                        <Sparkles className="w-5 h-5 mr-3 text-orange-600" />
                        Giới thiệu chung
                    </h3>
                    <p className="text-gray-500 leading-loose whitespace-pre-line text-sm">{company.company_description || "Thông tin giới thiệu về doanh nghiệp đang được cập nhật."}</p>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                        <div className="w-5 h-5 rounded-full border-2 border-orange-600 mr-3"></div>
                        Thông tin liên hệ
                    </h3>
                    <div className="bg-orange-50/30 rounded-3xl p-8 border border-orange-100/50 space-y-6">
                        {(company.address || company.company_address) && (
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 mr-4 text-orange-600 shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-1">Trụ sở chính</p>
                                    <p className="text-gray-700 text-sm font-medium">{company.address || company.company_address}</p>
                                </div>
                            </div>
                        )}
                        {company.category && (
                            <div className="flex items-start">
                                <div className="w-5 h-5 rounded-lg border-2 border-orange-600 mr-4 shrink-0 mt-1"></div>
                                <div>
                                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-1">Lĩnh vực hoạt động</p>
                                    <p className="text-gray-700 text-sm font-medium">{company.category}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            Vị trí đang tuyển dụng
            <span className="ml-3 text-orange-600 text-5xl font-black">{jobs.length}</span>
        </h2>
        
        {jobs.length === 0 ? (
            <div className="bg-orange-50/20 rounded-[2.5rem] py-20 text-center text-orange-200 border-2 border-dashed border-orange-100">
                Doanh nghiệp hiện chưa có tin tuyển dụng mới.
            </div>
        ) : (
            <div className="grid gap-6">
                {jobs.map(job => (
                    <JobCard 
                        key={job.media_internal_id} 
                        job={job} 
                        companyName={company.company_name} 
                        onQuickView={(id) => setQuickViewId(id)}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
