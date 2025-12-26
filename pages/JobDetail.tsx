
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RecruitmentDetail } from '../types';
import { 
  Loader2, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Briefcase, 
  ExternalLink,
  DollarSign,
  ShieldCheck,
  Share2,
  Layers
} from 'lucide-react';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RecruitmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const detail = await api.getRecruitment(id);
        setData(detail);
      } catch (err: any) {
        setError(err.message || "Không tìm thấy thông tin công việc.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
     return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{error || "Công việc không tồn tại"}</h2>
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-100">
            <ArrowLeft className="w-4 h-4 mr-2" /> Trở về danh sách
        </Link>
      </div>
    );
  }

  const { recruitment, company } = data;
  const logoSrc = company?.company_logo || (company?.company_domain ? `https://logo.clearbit.com/${company.company_domain.replace(/^https?:\/\//, '').split('/')[0]}` : null);

  return (
    <div className="animate-slide-up space-y-8">
       <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại tìm kiếm
            </Link>
            <button className="p-2.5 rounded-2xl border border-gray-100 text-gray-400 hover:text-orange-600 transition-colors">
                <Share2 className="w-5 h-5" />
            </button>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-bl-full -z-10 opacity-50"></div>
                
                <header className="mb-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-orange-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                            Hot Job
                        </span>
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                            {recruitment.category || 'Recruitment'}
                        </span>
                        {recruitment.industries && (
                          <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-orange-100">
                             {recruitment.industries}
                          </span>
                        )}
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                        {recruitment.title || recruitment.job_category || "Cơ hội việc làm"}
                    </h1>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
                                <DollarSign className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mức lương</p>
                                <p className="text-gray-900 font-extrabold">{recruitment.salary_range || recruitment.salary || 'Thỏa thuận'}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
                                <Layers className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ngành nghề</p>
                                <p className="text-gray-900 font-extrabold truncate max-w-[150px]">{recruitment.industries || recruitment.job_category || 'Đa ngành'}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
                                <ShieldCheck className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kinh nghiệm</p>
                                <p className="text-gray-900 font-extrabold">{recruitment.expertise || 'Không yêu cầu'}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
                                <MapPin className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Địa điểm</p>
                                <p className="text-gray-900 font-extrabold">{recruitment.address || 'Toàn quốc'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="prose prose-orange max-w-none">
                    {recruitment.description && (
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-1.5 h-8 bg-orange-600 rounded-full mr-4"></div>
                                Mô tả công việc
                            </h3>
                            <div className="text-gray-600 leading-loose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: recruitment.description }} />
                        </div>
                    )}

                    {recruitment.requirements && (
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-1.5 h-8 bg-orange-600 rounded-full mr-4"></div>
                                Yêu cầu ứng viên
                            </h3>
                            <div className="text-gray-600 leading-loose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: recruitment.requirements }} />
                        </div>
                    )}

                    {recruitment.benefits && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <div className="w-1.5 h-8 bg-orange-600 rounded-full mr-4"></div>
                                Quyền lợi được hưởng
                            </h3>
                            <div className="text-gray-600 leading-loose whitespace-pre-line" dangerouslySetInnerHTML={{ __html: recruitment.benefits }} />
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm sticky top-28">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center">Doanh nghiệp tuyển dụng</h3>
                
                {company ? (
                   <div className="space-y-8">
                      <div className="flex flex-col items-center text-center">
                         <div className="w-24 h-24 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center p-4 overflow-hidden mb-6 shadow-sm group-hover:border-orange-100 transition-colors">
                            {logoSrc && !imgError ? (
                                <img src={logoSrc} alt={company.company_name} className="w-full h-full object-contain" onError={() => setImgError(true)} />
                            ) : (
                                <Building2 className="w-12 h-12 text-orange-600" />
                            )}
                         </div>
                         <h4 className="text-2xl font-black text-gray-900 leading-tight mb-2">{company.company_name}</h4>
                         <span className="inline-flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                            {company.province || 'Toàn quốc'}
                         </span>
                      </div>

                      <div className="space-y-4">
                        <Link 
                            to={`/company/${company.corporate_number}`}
                            className="flex items-center justify-center w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 active:scale-95"
                        >
                            Xem hồ sơ công ty
                        </Link>
                        {recruitment.url && (
                            <a 
                                href={recruitment.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center justify-center w-full py-4 border-2 border-orange-600 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all active:scale-95"
                            >
                                Tin gốc tuyển dụng
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        )}
                      </div>

                      <p className="text-sm text-gray-400 text-center italic leading-relaxed">
                        {company.company_description ? company.company_description.substring(0, 120) + '...' : 'Thông tin giới thiệu về doanh nghiệp đang được cập nhật.'}
                      </p>
                   </div>
                ) : (
                   <div className="text-center py-12 text-gray-400">
                      <Building2 className="w-16 h-16 mx-auto mb-4 opacity-10" />
                      <p className="font-medium">Thông tin công ty chưa sẵn sàng</p>
                   </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
