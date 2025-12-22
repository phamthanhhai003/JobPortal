import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RecruitmentDetail } from '../types';
import { 
  Loader2, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Briefcase, 
  Globe, 
  GraduationCap, 
  FileText, 
  CheckCircle, 
  Factory, 
  Map,
  Gift,
  ExternalLink,
  DollarSign,
  Tag
} from 'lucide-react';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RecruitmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const detail = await api.getRecruitment(id);
        setData(detail);
      } catch (err: any) {
        setError(err.message || "Could not load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
     return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-red-100 mt-4 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || "Job not found"}</h2>
        <Link to="/" className="inline-flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Job List
        </Link>
      </div>
    );
  }

  const { recruitment, company } = data;

  const ensureHttp = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const logoSrc = company?.company_logo || (company?.company_domain ? `https://logo.clearbit.com/${company.company_domain.replace(/^https?:\/\//, '').split('/')[0]}` : null);

  const richTextClass = "prose max-w-none text-gray-700 leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-bold whitespace-pre-line";
  const displaySalary = recruitment.salary_range || recruitment.salary;
  const categoryText = recruitment.category || recruitment.job_category;

  return (
    <div className="animate-fade-in space-y-6">
       <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{recruitment.title || recruitment.job_category || "Job Opportunity"}</h1>
                        
                        {/* Highlights Section */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {displaySalary && (
                                <div className="flex items-center bg-green-50 text-green-700 px-4 py-1.5 rounded-full font-bold border border-green-200 shadow-sm text-sm">
                                    <DollarSign className="w-4 h-4 mr-1.5 text-green-600" />
                                    {displaySalary}
                                </div>
                            )}
                            {categoryText && (
                                <div className="flex items-center bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full font-bold border border-purple-200 shadow-sm text-sm">
                                    <Tag className="w-4 h-4 mr-1.5 text-purple-600" />
                                    {categoryText}
                                </div>
                            )}
                            {recruitment.industries && (
                                <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-bold border border-blue-200 shadow-sm text-sm">
                                    <Factory className="w-4 h-4 mr-1.5 text-blue-600" />
                                    {recruitment.industries}
                                </div>
                            )}
                        </div>

                        {/* General Metadata */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 text-sm">
                            {recruitment.address && (
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    {recruitment.address}
                                </div>
                            )}
                            <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                                Full Time
                            </div>
                        </div>
                    </div>
                    
                    {recruitment.url && (
                        <div className="shrink-0">
                            <a 
                                href={ensureHttp(recruitment.url)} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                            >
                                View Original Post
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </div>
                    )}
                </div>

                <hr className="border-gray-100 mb-8" />

                {recruitment.description && (
                  <div className="mb-10">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <FileText className="w-5 h-5 text-blue-700" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Job Description</h3>
                    </div>
                    <div className={richTextClass} dangerouslySetInnerHTML={{ __html: recruitment.description }} />
                  </div>
                )}

                {recruitment.benefits && (
                  <div className="mb-10 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3">
                            <Gift className="w-5 h-5 text-orange-700" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Benefits & Perks</h3>
                    </div>
                    <div className={richTextClass} dangerouslySetInnerHTML={{ __html: recruitment.benefits }} />
                  </div>
                )}

                {recruitment.requirements && (
                  <div className="mb-10">
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                            <CheckCircle className="w-5 h-5 text-green-700" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Requirements</h3>
                    </div>
                    <div className={richTextClass} dangerouslySetInnerHTML={{ __html: recruitment.requirements }} />
                  </div>
                )}

                {recruitment.edu && (
                  <div>
                    <div className="flex items-center mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <GraduationCap className="w-5 h-5 text-purple-700" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Education</h3>
                    </div>
                    <div className={richTextClass} dangerouslySetInnerHTML={{ __html: recruitment.edu }} />
                  </div>
                )}
            </div>
        </div>

        <div className="lg:col-span-1">
            {company ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Hiring Company</h3>
                    
                    <div className="flex items-start mb-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 mr-4">
                            {logoSrc && !imgError ? (
                              <img 
                                src={logoSrc} 
                                alt={company.company_name} 
                                className="w-full h-full object-contain p-1"
                                onError={() => setImgError(true)}
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-blue-600" />
                            )}
                        </div>
                        <div>
                             <h4 className="font-bold text-lg text-gray-900 leading-tight mb-1">{company.company_name}</h4>
                             <div className="flex items-center text-xs text-blue-600 font-semibold">
                                <Map className="w-3 h-3 mr-1" />
                                {company.province || "Various Locations"}
                             </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        {company.company_domain && (
                            <a 
                                href={ensureHttp(company.company_domain)} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                <Globe className="w-4 h-4 mr-2" />
                                Official Website
                            </a>
                        )}
                        {recruitment.url && (
                             <a 
                                href={ensureHttp(recruitment.url)} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 hover:underline transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Original Job Post
                            </a>
                        )}
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed italic">
                            {company.company_description || "Company description not available."}
                        </p>
                    </div>

                    <Link 
                        to={`/company/${encodeURIComponent(company.corporate_number)}`}
                        className="block w-full text-center py-2.5 px-4 border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                    >
                        View Full Company Profile
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                    <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Company information is not available.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};