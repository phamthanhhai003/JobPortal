
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import { Recruitment } from '../types';

interface JobCardProps {
  job: Recruitment;
  companyName?: string; 
}

export const JobCard: React.FC<JobCardProps> = ({ job, companyName }) => {
  const stripHtml = (htmlContent?: any) => {
    if (!htmlContent) return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = String(htmlContent);
    return (tmp.textContent || tmp.innerText || "").trim().replace(/\s+/g, " ");
  };

  const eduText = stripHtml(job.edu);
  const expertiseText = stripHtml(job.expertise);
  const industryText = stripHtml(job.industries);
  const displaySalary = job.salary_range || job.salary;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 transition-all duration-300 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/40 group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {displaySalary && (
              <span className="bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {displaySalary}
              </span>
            )}
            {job.category && (
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                {job.category}
              </span>
            )}
            {industryText && (
              <span className="bg-orange-50 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-orange-100">
                {industryText}
              </span>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
            <Link to={`/recruitment/${job.media_internal_id}`}>
              {job.title || job.job_category || 'Cơ hội nghề nghiệp'}
            </Link>
          </h3>
          
          <Link 
            to={`/company/${job.corporate_number}`}
            className="text-gray-500 font-medium hover:text-orange-600 block mb-6 transition-colors"
          >
            {companyName || `Công ty đối tác`}
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2 text-orange-600" />
              <span className="truncate">{job.province || job.address || 'Toàn quốc'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Briefcase className="w-4 h-4 mr-2 text-orange-600" />
              <span>Toàn thời gian</span>
            </div>
            
            {expertiseText ? (
               <div className="flex items-center text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 mr-2 text-orange-600" />
                <span className="truncate font-bold">{expertiseText}</span>
              </div>
            ) : eduText ? (
              <div className="flex items-center text-sm text-gray-500">
                <GraduationCap className="w-4 h-4 mr-2 text-orange-600" />
                <span className="truncate">{eduText}</span>
              </div>
            ) : null}

            {industryText && (
              <div className="flex items-center text-sm text-gray-500">
                <Layers className="w-4 h-4 mr-2 text-orange-600" />
                <span className="truncate">{industryText}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-6 shrink-0">
          <Link 
            to={`/recruitment/${job.media_internal_id}`}
            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-orange-50 text-orange-700 font-bold px-8 py-4 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 active:scale-95"
          >
            <span>Ứng tuyển ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
