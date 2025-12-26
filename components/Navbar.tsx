
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Building, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'text-orange-600 bg-orange-50 font-bold' 
      : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50/50';
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 orange-gradient rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                 <LayoutGrid className="h-6 w-6 text-white" />
              </div>
              <span className="text-gray-900 font-extrabold text-2xl tracking-tight">Job<span className="text-orange-600">Portal</span></span>
            </Link>
          </div>
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-5 py-2.5 rounded-2xl text-sm transition-all duration-200 flex items-center space-x-2 ${isActive('/')}`}
            >
              <Search className="w-4 h-4" />
              <span>Việc làm</span>
            </Link>
            <Link
              to="/companies"
              className={`px-5 py-2.5 rounded-2xl text-sm transition-all duration-200 flex items-center space-x-2 ${isActive('/companies')}`}
            >
              <Building className="w-4 h-4" />
              <span>Đối tác</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
