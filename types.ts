
export interface Company {
  corporate_number: string;
  company_name?: string;
  company_address?: string;
  address?: string; // Detailed address from API
  company_description?: string;
  company_industry?: string;
  category?: string;
  company_domain?: string;
  company_logo?: string;
  source_company_url?: string; // Original crawled link
  province?: string; // Location province/city
}

export interface Recruitment {
  media_internal_id: string;
  corporate_number?: string;
  job_category?: string;
  category?: string; // New: Specific category field from recruitment API
  requirements?: string;
  address?: string;
  title?: string;
  salary?: string;
  salary_range?: string; // New: Range-based salary info
  description?: string;
  edu?: string;
  expertise?: string; // New: Dedicated expertise field
  industries?: string;
  benefits?: string; // New: Job benefits/perks
  url?: string;      // New: Original recruitment post URL
}

export interface RecruitmentDetail {
  recruitment: Recruitment;
  company: Company | null;
}

export interface ApiError {
  detail: string;
}