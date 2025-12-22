import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Tag, Map } from 'lucide-react';
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
      className="block group h-full"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full transition-all duration-200 hover:shadow-md hover:border-blue-300">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-blue-200 transition-colors">
            {logoSrc && !imgError ? (
              <img 
                src={logoSrc} 
                alt={company.company_name} 
                className="w-full h-full object-contain p-2"
                onError={() => setImgError(true)}
              />
            ) : (
              <Building2 className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <div className="flex flex-col items-end gap-2 ml-2">
            {company.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 text-right">
                 <Tag className="w-3 h-3 mr-1" />
                 {company.category}
              </span>
            )}
            {company.province && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 text-right border border-blue-100">
                <Map className="w-3 h-3 mr-1" />
                {company.province}
              </span>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 line-clamp-1">
          {company.company_name || 'Unknown Company'}
        </h3>
        
        {(company.address || company.company_address) && (
          <div className="flex items-start text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{company.address || company.company_address}</span>
          </div>
        )}
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {company.company_description || 'No description available.'}
        </p>
      </div>
    </Link>
  );
};