
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Company } from '../types';
import { CompanyCard } from '../components/CompanyCard';
import { Pagination } from '../components/Pagination';
import { CompanyCardSkeleton } from '../components/Skeletons';
import { Search, Building2, Shuffle } from 'lucide-react';

export const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await api.getCompanies();
        const randomizedData = shuffleArray(data);
        setCompanies(randomizedData);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company_industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const currentCompanies = filteredCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  return (
    <div className="space-y-16 animate-slide-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mạng lưới đối tác</h1>
             <div className="bg-orange-50 p-2 rounded-xl" title="Danh sách hiển thị ngẫu nhiên">
                <Shuffle className="w-5 h-5 text-orange-600" />
             </div>
          </div>
          <p className="text-gray-400 text-lg font-medium">Khám phá các doanh nghiệp được hiển thị ngẫu nhiên</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-300 group-focus-within:text-orange-600 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-5 py-4 border border-gray-100 rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-200 transition-all text-lg shadow-sm"
            placeholder="Tìm theo tên hoặc ngành..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => <CompanyCardSkeleton key={i} />)}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-orange-200" />
          <p className="text-xl font-bold text-gray-900">Không tìm thấy doanh nghiệp nào.</p>
          <button onClick={() => setSearchTerm('')} className="mt-4 text-orange-600 font-bold hover:underline">Xóa bộ lọc</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentCompanies.map((company) => (
            <CompanyCard key={company.corporate_number} company={company} />
          ))}
        </div>
      )}

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
