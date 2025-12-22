import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Recruitment } from '../types';
import { JobCard } from '../components/JobCard';
import { Pagination } from '../components/Pagination';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export const Home: React.FC = () => {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // OPTIMIZATION: Fetch both resources in parallel using Promise.all
      // This reduces wait time significantly compared to awaiting them one by one.
      const [companiesData, recruitmentsData] = await Promise.all([
        api.getCompanies(),
        api.getAllRecruitments()
      ]);

      // Process companies map
      const compMap: Record<string, string> = {};
      companiesData.forEach(c => {
        compMap[c.corporate_number] = c.company_name || 'Unknown';
      });
      setCompanies(compMap);

      // Set recruitments
      setRecruitments(recruitmentsData);
      
    } catch (err: any) {
      console.error("Error fetching data:", err);
      if (err.message?.includes('Failed to fetch')) {
        setError('Connection Failed. Please check if your Backend is running on port 8008 and CORS is enabled.');
      } else {
        setError(err.message || "Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(recruitments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = recruitments.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Could Not Connect to API</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
                onClick={fetchData}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 flex justify-between items-center shadow-sm rounded-r-lg">
        <div>
            <h2 className="text-blue-800 font-bold text-lg">Latest Job Openings</h2>
            <p className="text-sm text-blue-600">
            Showing <strong>{recruitments.length}</strong> opportunities.
            </p>
        </div>
      </div>

      <div className="grid gap-6">
        {currentJobs.map((job) => (
          <JobCard 
            key={job.media_internal_id} 
            job={job} 
            companyName={job.corporate_number ? companies[job.corporate_number] : undefined}
          />
        ))}
      </div>

      {recruitments.length === 0 && (
         <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed p-8 shadow-sm">
             <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Found</h3>
             <p className="max-w-md mx-auto mb-4">
                 The job list is empty. 
             </p>
             <div className="bg-gray-100 p-4 rounded text-left text-sm font-mono text-gray-700 inline-block overflow-x-auto max-w-full">
                <strong>Backend Requirement:</strong><br/>
                Please ensure you have implemented the list endpoint:<br/>
                <code className="block mt-2 text-blue-600">
                @app.get("/recruitment")<br/>
                async def get_all_recruitments():<br/>
                &nbsp;&nbsp;return sanitize_dict(filtered_recruits.to_dict(orient="records"))
                </code>
             </div>
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