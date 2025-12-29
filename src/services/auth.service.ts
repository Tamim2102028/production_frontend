import api from "../lib/axios";
import type { LoginCredentials, User, ApiResponse } from "../types";

export const authService = {
  // Register new user
  register: async (
    formData: FormData
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/users/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Login user
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User }>> => {
    const payload = credentials.email?.includes("@")
      ? { email: credentials.email, password: credentials.password }
      : { userName: credentials.email, password: credentials.password };

    const response = await api.post<ApiResponse<{ user: User }>>(
      "/users/login",
      payload
    );
    return response.data;
  },

  // Logout user
  logout: async (): Promise<ApiResponse<object>> => {
    const response = await api.post<ApiResponse<object>>("/users/logout");
    return response.data;
  },

  // Get Current Logged-in User
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get<ApiResponse<{ user: User }>>(
      "/users/current-user"
    );
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/users/refresh-token"
    );
    return response.data;
  },
};

export default authService;
