import api from "../lib/axios";
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  User,
} from "../types/user.types";

/**
 * ====================================
 * AUTH API SERVICE
 * ====================================
 *
 * সব Authentication related API calls এখানে।
 * Axios instance use করে যেটা withCredentials: true set করা।
 *
 * APIs:
 * - register: POST /users/register (multipart/form-data)
 * - login: POST /users/login (JSON)
 * - logout: POST /users/logout
 * - getCurrentUser: GET /users/current-user
 * - refreshToken: POST /users/refresh-token
 *
 * ⚠️ সব response এই format এ আসে:
 * {
 *   statusCode: 200,
 *   data: { ... },
 *   message: "...",
 *   success: true
 * }
 */

export const authApi = {
  /**
   * Register new user
   *
   * @param formData - FormData with: fullName, email, userName, password, userType, avatar?
   * @returns User object + tokens
   *
   * ⚠️ multipart/form-data কারণ avatar file upload আছে
   */
  register: async (formData: FormData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
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

  /**
   * Login user
   *
   * @param credentials - { email OR userName, password }
   * @returns User object + tokens (tokens cookie তে set হয়)
   *
   * ⚠️ Smart detection: @ থাকলে email, না থাকলে userName
   */
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    // Determine if it's email or username based on @ symbol
    const payload = credentials.email?.includes("@")
      ? { email: credentials.email, password: credentials.password }
      : { userName: credentials.email, password: credentials.password };

    const response = await api.post<ApiResponse<AuthResponse>>(
      "/users/login",
      payload
    );
    return response.data;
  },

  /**
   * Logout user
   *
   * Backend cookie clear করে দেয়।
   * Frontend এ Redux clear করতে হয়।
   */
  logout: async (): Promise<ApiResponse<object>> => {
    const response = await api.post<ApiResponse<object>>("/users/logout");
    return response.data;
  },

  /**
   * Get current logged in user
   *
   * ⚠️ IMPORTANT: এটা app load এ call হয় (useAuthCheck hook)
   *
   * Cookie তে valid token থাকলে user data পাবে।
   * Token invalid/expired হলে 401 পাবে।
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/users/current-user");
    return response.data;
  },

  /**
   * Refresh access token
   *
   * ⚠️ এটা axios interceptor থেকে automatically call হয়
   * 401 error পেলে এই API call করে নতুন token নেয়
   *
   * Backend refresh token cookie থেকে পড়ে,
   * নতুন access token cookie তে set করে দেয়।
   */
  refreshToken: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/users/refresh-token"
    );
    return response.data;
  },
};

export default authApi;
