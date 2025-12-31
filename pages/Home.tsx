
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Recruitment } from '../types';
import { JobCard } from '../components/JobCard';
import { Pagination } from '../components/Pagination';
import { QuickViewDrawer } from '../components/QuickViewDrawer';
import { JobCardSkeleton } from '../components/Skeletons';
import { Search, Filter, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [companiesData, recruitmentsData] = await Promise.all([
          api.getCompanies(),
          api.getAllRecruitments()
        ]);
        const compMap: Record<string, string> = {};
        companiesData.forEach(c => compMap[c.corporate_number] = c.company_name || 'Unknown');
        setCompanies(compMap);
        setRecruitments(recruitmentsData);
      } catch (err) {
        console.error(err);
      } finally {
        // Add a small delay for smoother transition if API is too fast
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  const filteredJobs = recruitments.filter(job => {
    const companyName = job.corporate_number ? companies[job.corporate_number] || '' : '';
    const searchString = `${job.title} ${job.job_category} ${companyName} ${job.expertise} ${job.industries} ${job.category} ${job.province}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-12 animate-slide-up">
      <QuickViewDrawer jobId={quickViewId} onClose={() => setQuickViewId(null)} />

      <section className="relative py-16 px-8 rounded-[3rem] orange-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trang web tổng hợp tin tuyển dụng</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                Dự án cá nhân <br/> của <span className="underline decoration-white/40 underline-offset-8">Phạm Thanh Hải</span>
            </h1>
            
            <div className="relative max-w-2xl mx-auto group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-14 pr-6 py-6 border-none rounded-3xl bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-orange-200 transition-all text-xl shadow-2xl"
                    placeholder="Vị trí, công ty, ngành nghề, địa điểm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </section>

      <div className="grid gap-8">
        <div className="flex items-center justify-between mb-4 px-2">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Việc làm mới nhất</h2>
                <p className="text-gray-400 mt-1">Khám phá <span className="text-orange-600 font-bold">{loading ? '...' : filteredJobs.length}</span> cơ hội tiềm năng</p>
            </div>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-orange-600 font-bold px-4 py-2 border border-gray-100 rounded-xl transition-all">
                <Filter className="w-4 h-4" />
                <span>Lọc</span>
            </button>
        </div>

        {loading ? (
          <div className="grid gap-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : currentJobs.length > 0 ? (
          <div className="grid gap-6">
            {currentJobs.map((job) => (
              <JobCard 
                key={job.media_internal_id} 
                job={job} 
                companyName={job.corporate_number ? companies[job.corporate_number] : undefined}
                onQuickView={(id) => setQuickViewId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
             <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="w-10 h-10 text-orange-200" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
             <p className="text-gray-400">Thử thay đổi từ khóa tìm kiếm của bạn.</p>
          </div>
        )}
      </div>

      {!loading && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
};
