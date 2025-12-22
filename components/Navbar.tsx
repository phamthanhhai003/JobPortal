import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Building2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white';
  };

  return (
    <nav className="bg-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-white rounded-lg">
                 <Briefcase className="h-6 w-6 text-blue-800" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">JobPortal</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/')}`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Jobs</span>
            </Link>
            <Link
              to="/companies"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${isActive('/companies')}`}
            >
              <Building2 className="w-4 h-4" />
              <span>Companies</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
