
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ExternalLink, Globe } from 'lucide-react';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const [imgError, setImgError] = useState(false);
  const logoSrc = company.company_logo || (company.company_domain ? `https://logo.clearbit.com/${company.company_domain.replace(/^https?:\/\//, '').split('/')[0]}` : null);

  return (
    <Link 
      to={`/company/${company.corporate_number}`}
      className="group"
    >
      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 h-full transition-all duration-300 hover:border-orange-200 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        
        <div className="flex items-start justify-between mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center p-3 overflow-hidden group-hover:border-orange-100 transition-colors">
            {logoSrc && !imgError ? (
              <img src={logoSrc} alt={company.company_name} className="w-full h-full object-contain" onError={() => setImgError(true)} />
            ) : (
              <Building2 className="w-10 h-10 text-orange-600" />
            )}
          </div>
          {company.company_domain && (
            <div className="p-2 bg-gray-50 rounded-full group-hover:bg-orange-50 transition-colors">
                <Globe className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {company.company_name || 'Công ty đối tác'}
        </h3>
        
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <MapPin className="w-4 h-4 mr-1 text-orange-500" />
          <span className="truncate">{company.province || 'Toàn quốc'}</span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">
          {company.company_description || 'Giới thiệu về doanh nghiệp đang được cập nhật.'}
        </p>

        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
           <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">{company.category || 'Doanh nghiệp'}</span>
           <div className="w-8 h-8 rounded-full border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <ExternalLink className="w-4 h-4" />
           </div>
        </div>
      </div>
    </Link>
  );
};
