
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-3 py-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-2xl border border-gray-100 bg-white text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 font-bold text-gray-900">
        <span className="text-orange-600 mr-1">{currentPage}</span>
        <span className="text-gray-300 mx-1">/</span>
        <span className="text-gray-400">{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 rounded-2xl border border-gray-100 bg-white text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
