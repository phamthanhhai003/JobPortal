import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, DollarSign, ChevronRight, Tag, ShieldCheck } from 'lucide-react';
import { Recruitment } from '../types';

interface JobCardProps {
  job: Recruitment;
  companyName?: string; 
}

export const JobCard: React.FC<JobCardProps> = ({ job, companyName }) => {
  
  const stripHtml = (htmlContent?: any) => {
    if (htmlContent === null || htmlContent === undefined) return '';
    
    // Convert to string and trim basic whitespace
    let text = String(htmlContent).trim();
    
    // Handle literal string versions of empty/null values that sometimes come from APIs
    const lowerText = text.toLowerCase();
    if (
      lowerText === '' || 
      lowerText === 'none' || 
      lowerText === 'null' || 
      lowerText === 'undefined' ||
      lowerText === '""' || 
      lowerText === "''" || 
      lowerText === '[]' || 
      lowerText === '{}'
    ) {
      return '';
    }
    
    // Create a temporary element to strip actual HTML tags
    const tmp = document.createElement("DIV");
    tmp.innerHTML = text;
    let cleanText = (tmp.textContent || tmp.innerText || "").trim();

    // Replace non-breaking spaces (\u00a0) and other hidden characters
    cleanText = cleanText.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

    return cleanText;
  };

  const previewContent = stripHtml(job.description || job.requirements) || 'Click to see full requirements...';
  const eduText = stripHtml(job.edu);
  
  // Apply strict cleaning to expertise
  const expertiseText = stripHtml(job.expertise);
  
  const displaySalary = job.salary_range || job.salary;
  const categoryText = job.category || job.job_category;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-blue-200 group">
      <div className="flex flex-col gap-1">
        {/* Row 1: Title and Salary/Category Badges */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-900 flex-1 leading-tight group-hover:text-blue-800 transition-colors">
            <Link to={`/recruitment/${job.media_internal_id}`}>
              {job.title || job.job_category || 'Job Opportunity'}
            </Link>
          </h3>
          <div className="flex items-center flex-wrap gap-2 md:gap-3">
            {displaySalary && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 whitespace-nowrap">
                <DollarSign className="w-3.5 h-3.5 mr-1" />
                {displaySalary}
              </span>
            )}
            {categoryText && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                <Tag className="w-3.5 h-3.5 mr-1" />
                {categoryText}
              </span>
            )}
            <Link 
              to={`/recruitment/${job.media_internal_id}`}
              className="hidden md:inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-semibold rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Row 2: Company Name */}
        <div className="mb-2">
          <Link 
            to={`/company/${job.corporate_number}`}
            className="text-blue-600 font-semibold hover:underline decoration-2 underline-offset-4"
          >
            {companyName || `Company #${job.corporate_number}`}
          </Link>
        </div>

        {/* Row 3: Metadata row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>Full Time</span>
          </div>

          {eduText !== "" && (
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-1.5 text-gray-400" />
              <span className="line-clamp-1">{eduText}</span>
            </div>
          )}

          {/* Render ONLY if we have a non-empty string after strict cleaning */}
          {expertiseText && expertiseText !== "" && (
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-500/70" />
              <span className="font-medium text-gray-700 line-clamp-1">{expertiseText}</span>
            </div>
          )}

          {job.address && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
              <span className="line-clamp-1">{job.address}</span>
            </div>
          )}
        </div>

        {/* Row 4: Short Preview */}
        <div className="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4 line-clamp-2">
          {previewContent}
        </div>
        
        {/* Mobile View Details Button */}
        <div className="mt-4 md:hidden">
            <Link 
              to={`/recruitment/${job.media_internal_id}`}
              className="flex items-center justify-center w-full px-4 py-2 border border-blue-100 text-sm font-bold rounded-lg text-blue-700 bg-blue-50"
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
        </div>
      </div>
    </div>
  );
};