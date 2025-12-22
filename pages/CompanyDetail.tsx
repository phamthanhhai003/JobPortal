import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Company, Recruitment } from '../types';
import { JobCard } from '../components/JobCard';
import { Loader2, Globe, MapPin, Building, ArrowLeft, Tag, ExternalLink, Map } from 'lucide-react';

export const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        try {
            const companyData = await api.getCompany(id);
            setCompany(companyData);
        } catch (companyErr) {
            setError('Company not found');
            setLoading(false);
            return;
        }
        try {
            const allJobs = await api.getAllRecruitments();
            const companyJobs = allJobs.filter(job => job.corporate_number === id);
            setJobs(companyJobs);
        } catch (jobErr) {
            setJobs([]);
        }
      } catch (err) {
        setError('Failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-red-100 mt-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Company not found'}</h2>
        <Link to="/companies" className="text-blue-600 hover:underline">Return to Company List</Link>
      </div>
    );
  }

  const ensureHttp = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const logoSrc = company.company_logo || (company.company_domain ? `https://logo.clearbit.com/${company.company_domain.replace(/^https?:\/\//, '').split('/')[0]}` : null);

  return (
    <div className="space-y-8 animate-fade-in">
      <Link to="/companies" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Companies
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 h-32 w-full relative">
            <div className="absolute -bottom-10 left-8">
                <div className="h-24 w-24 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2 border-4 border-white overflow-hidden">
                    {logoSrc && !imgError ? (
                      <img 
                        src={logoSrc} 
                        alt={company.company_name} 
                        className="w-full h-full object-contain"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <Building className="w-12 h-12 text-blue-700" />
                    )}
                </div>
            </div>
        </div>
        
        <div className="pt-14 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.company_name || "Company Name Unavailable"}</h1>
                    <div className="flex flex-wrap gap-3 items-center text-sm text-gray-600">
                        {company.province && (
                            <span className="flex items-center text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                <Map className="w-3.5 h-3.5 mr-1" />
                                {company.province}
                            </span>
                        )}
                        {company.company_industry && (
                            <span className="bg-gray-100 px-3 py-0.5 rounded-full text-gray-800 font-medium border border-gray-200">
                                {company.company_industry}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {company.company_domain && (
                        <a 
                            href={ensureHttp(company.company_domain)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Globe className="w-4 h-4 mr-2" />
                            Official Website
                        </a>
                    )}
                    {company.source_company_url && (
                        <a 
                            href={ensureHttp(company.source_company_url)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Original Source
                        </a>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {(company.address || company.company_address) && (
                    <div className="flex items-start">
                        <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Company Address</span>
                            <span className="text-gray-700">{company.address || company.company_address}</span>
                        </div>
                    </div>
                )}
                {company.category && (
                    <div className="flex items-start">
                        <Tag className="w-5 h-5 mr-3 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Business Category</span>
                            <span className="text-gray-700">{company.category}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="prose prose-blue max-w-none text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-1">About the Organization</h3>
                <p className="whitespace-pre-line leading-relaxed">{company.company_description || "No description provided."}</p>
            </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BriefcaseIcon className="w-6 h-6 mr-2 text-blue-600" />
            Open Positions ({jobs.length})
        </h2>
        
        {jobs.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500 border border-gray-200">
                No current openings listed for this company.
            </div>
        ) : (
            <div className="grid gap-4">
                {jobs.map(job => (
                    <JobCard key={job.media_internal_id} job={job} companyName={company.company_name} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

function BriefcaseIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
}