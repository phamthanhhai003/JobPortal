
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Company } from '../types';
import { CompanyCard } from '../components/CompanyCard';
import { Pagination } from '../components/Pagination';
import { Loader2, Search, Building2 } from 'lucide-react';

export const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await api.getCompanies();
        setCompanies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-slide-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-2 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mạng lưới đối tác</h1>
          <p className="text-gray-400 text-lg mt-1 font-medium">Khám phá các doanh nghiệp hàng đầu trong hệ thống</p>
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

      {filteredCompanies.length === 0 ? (
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

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
};
