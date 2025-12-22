import { Company, Recruitment, RecruitmentDetail } from '../types';

// const API_BASE_URL = 'http://172.25.242.21:8008';
const API_BASE_URL = `http://${window.location.hostname}:8008`;



const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiService {
  private companiesCache: CacheEntry<Company[]> | null = null;
  private recruitmentsCache: CacheEntry<Recruitment[]> | null = null;

  /**
   * Helper to handle response errors with detailed messages
   */
  private async handleResponse(response: Response, context: string) {
    if (!response.ok) {
      let errorMessage = `${context} (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } catch (e) {
        const text = await response.text();
        if (text) errorMessage = `${context}: ${text}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  /**
   * Helper to check if cache is valid
   */
  private isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
    if (!cache) return false;
    return (Date.now() - cache.timestamp) < CACHE_DURATION;
  }

  /**
   * Fetches the list of all companies with Caching.
   */
  async getCompanies(forceRefresh = false): Promise<Company[]> {
    if (!forceRefresh && this.isCacheValid(this.companiesCache)) {
      return this.companiesCache!.data;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/?limit=1000`);
      const data = await this.handleResponse(response, "Failed to fetch companies");
      
      this.companiesCache = {
        data,
        timestamp: Date.now()
      };
      return data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }


  async getCompany(corporateNumber: string): Promise<Company> {
    if (!corporateNumber) throw new Error("Corporate number is required");
    const safeId = encodeURIComponent(corporateNumber.trim());
    const response = await fetch(`${API_BASE_URL}/company/${safeId}`);
    return this.handleResponse(response, "Company not found");
  }

  /**
   * Fetches a single recruitment detail.
   */
  async getRecruitment(mediaInternalId: string): Promise<RecruitmentDetail> {
    if (!mediaInternalId) throw new Error("Recruitment ID is required");
    const safeId = encodeURIComponent(mediaInternalId.trim());
    const response = await fetch(`${API_BASE_URL}/recruitment/${safeId}`);
    return this.handleResponse(response, "Recruitment not found");
  }

  /**
   * Fetches all recruitments with Caching.
   */
  async getAllRecruitments(forceRefresh = false): Promise<Recruitment[]> {
    if (!forceRefresh && this.isCacheValid(this.recruitmentsCache)) {
      return this.recruitmentsCache!.data;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recruitment?limit=1000`);
      
      // Handle missing endpoint gracefully
      if (response.status === 404 || response.status === 405) {
        console.warn("Backend missing /recruitment list endpoint. Returning empty list.");
        return [];
      }

      const data = await this.handleResponse(response, "Failed to fetch recruitments");
      
      this.recruitmentsCache = {
        data,
        timestamp: Date.now()
      };
      return data;
    } catch (error) {
      console.error("Error fetching all recruitments:", error);
      // Return empty array on error to allow UI to render partially
      return []; 
    }
  }
}

export const api = new ApiService();