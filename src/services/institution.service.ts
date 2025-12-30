import api from "../lib/axios";
import type { Institution, Department, ApiResponse } from "../types";

export const institutionService = {
  // Search Institutions
  searchInstitutions: async (
    query: string
  ): Promise<ApiResponse<{ institutions: Institution[] }>> => {
    const response = await api.get<
      ApiResponse<{ institutions: Institution[] }>
    >("/institutions/search", {
      params: { q: query },
    });
    return response.data;
  },

  // Search Departments within an institution
  searchDepartments: async (
    instId: string,
    query: string
  ): Promise<ApiResponse<{ departments: Department[] }>> => {
    const response = await api.get<ApiResponse<{ departments: Department[] }>>(
      "/depts/search",
      {
        params: { instId, q: query },
      }
    );
    return response.data;
  },
};

export default institutionService;
