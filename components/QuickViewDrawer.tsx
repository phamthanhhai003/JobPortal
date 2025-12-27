
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { RecruitmentDetail } from '../types';
import { 
  X, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Building2, 
  ExternalLink, 
  Loader2,
  ArrowRight
} from 'lucide-react';

interface QuickViewDrawerProps {
  jobId: string | null;
  onClose: () => void;
}

export const QuickViewDrawer: React.FC<QuickViewDrawerProps> = ({ jobId, onClose }) => {
  const [data, setData] = useState<RecruitmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const animationTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (jobId) {
      // Khi có ID: Hiện Drawer và sau đó kích hoạt slide in
      setIsRendered(true);
      if (animationTimeout.current) window.clearTimeout(animationTimeout.current);
      animationTimeout.current = window.setTimeout(() => setIsAnimate(true), 10);

      const fetchDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const detail = await api.getRecruitment(jobId);
          setData(detail);
        } catch (err) {
          setError("Không thể tải thông tin công việc.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
      document.body.style.overflow = 'hidden';
    } else {
      // Khi ID null: Trượt ra trước, sau đó mới gỡ khỏi DOM
      setIsAnimate(false);
      if (animationTimeout.current) window.clearTimeout(animationTimeout.current);
      animationTimeout.current = window.setTimeout(() => {
        setIsRendered(false);
        setData(null); // Xóa dữ liệu sau khi đã khuất hẳn
      }, 500);
      document.body.style.overflow = 'auto';
    }

    return () => {
      if (animationTimeout.current) window.clearTimeout(animationTimeout.current);
    };
  }, [jobId]);

  if (!isRendered) return null;

  return (
    <div className={`fixed inset-0 z-[60] flex items-stretch`}>
      {/* Backdrop - Fade in/out */}
      <div 
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isAnimate ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer Content - Slide in/out từ trái */}
      <div 
        className={`relative w-full max-w-2xl bg-white shadow-2xl transition-transform duration-500 transform ease-[cubic-bezier(0.4,0,0.2,1)] ${isAnimate ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto flex flex-col`}
      >
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 p-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Xem nhanh vị trí</h2>
            <button 
                onClick={onClose}
                className="p-2.5 hover:bg-orange-50 rounded-2xl transition-all duration-300 text-gray-400 hover:text-orange-600 active:scale-90"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="p-8 flex-1">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                    <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Đang tải thông tin...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                    <p className="text-red-500 font-bold mb-4">{error}</p>
                    <button onClick={onClose} className="text-orange-600 font-black hover:underline">Đóng lại</button>
                </div>
            ) : data ? (
                <div className="space-y-10 animate-slide-up">
                    {/* Header */}
                    <header>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="bg-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-100">
                                {data.recruitment.category || 'Tuyển dụng'}
                            </span>
                            <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-orange-100">
                                {data.recruitment.province || 'Toàn quốc'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-8">
                            {data.recruitment.title}
                        </h1>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50/80 p-5 rounded-3xl border border-gray-100 hover:bg-white transition-colors duration-300">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Mức lương</p>
                                <div className="flex items-center text-orange-600 font-black text-xl">
                                    <DollarSign className="w-5 h-5 mr-1" />
                                    <span>{data.recruitment.salary_range || 'Thỏa thuận'}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50/80 p-5 rounded-3xl border border-gray-100 hover:bg-white transition-colors duration-300">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Kinh nghiệm</p>
                                <div className="flex items-center text-gray-700 font-bold">
                                    <ShieldCheck className="w-5 h-5 mr-2 text-orange-600" />
                                    <span>{data.recruitment.expertise || 'Không yêu cầu'}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Sections */}
                    <div className="space-y-10">
                        {data.recruitment.description && (
                            <div className="relative">
                                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center">
                                    <div className="w-1.5 h-6 orange-gradient rounded-full mr-3 shadow-sm"></div>
                                    Mô tả công việc
                                </h3>
                                <div className="text-gray-500 text-sm leading-relaxed prose prose-sm max-w-none prose-orange" dangerouslySetInnerHTML={{ __html: data.recruitment.description }} />
                            </div>
                        )}
                        
                        {data.recruitment.requirements && (
                            <div className="relative">
                                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center">
                                    <div className="w-1.5 h-6 orange-gradient rounded-full mr-3 shadow-sm"></div>
                                    Yêu cầu
                                </h3>
                                <div className="text-gray-500 text-sm leading-relaxed prose prose-sm max-w-none prose-orange" dangerouslySetInnerHTML={{ __html: data.recruitment.requirements }} />
                            </div>
                        )}
                    </div>

                    {/* Company Footer Info */}
                    <div className="bg-orange-50/50 rounded-[2rem] p-8 border border-orange-100 mt-12 mb-6 group transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-100">
                        <div className="flex items-center mb-8 pb-8 border-b border-orange-100/30">
                            <div className="w-16 h-16 bg-white rounded-2xl border border-orange-100 flex items-center justify-center p-3 shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-105">
                                {data.company?.company_logo ? (
                                    <img src={data.company.company_logo} alt={data.company.company_name} className="w-full h-full object-contain" />
                                ) : (
                                    <Building2 className="w-10 h-10 text-orange-600" />
                                )}
                            </div>
                            <div className="ml-5">
                                <h4 className="font-black text-gray-900 leading-tight mb-1 text-lg">{data.company?.company_name}</h4>
                                <div className="flex items-center text-xs text-orange-400 font-bold uppercase tracking-widest">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                    {data.company?.province || 'Toàn quốc'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link 
                                to={`/recruitment/${data.recruitment.media_internal_id}`}
                                className="flex items-center justify-center orange-gradient text-white font-black py-4 rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
                            >
                                <span>Xem chi tiết</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            {data.recruitment.url && (
                                <a 
                                    href={data.recruitment.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center justify-center p-4 border-2 border-orange-600 text-orange-600 rounded-2xl font-black hover:bg-white transition-all active:scale-95"
                                >
                                    Nguồn gốc
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
      </div>
    </div>
  );
};
