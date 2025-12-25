import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authApi from "../services/auth.service";
import type {
  LoginCredentials,
  ApiError,
  AuthState,
} from "../types/user.types";
import type { AxiosError } from "axios";

// Query Keys for caching
export const AUTH_KEYS = {
  currentUser: ["currentUser"] as const,
};

/**
 * ====================================
 * AUTH HOOKS - TanStack Query Only
 * ====================================
 *
 * This file contains all authentication related hooks.
 * It uses TanStack Query for state management, replacing Redux.
 *
 * Hooks:
 * - useUser: Access current user data (cached by React Query)
 * - useRegister: Register new user
 * - useLogin: User login
 * - useLogout: User logout
 * - useAuthCheck: Verifies auth on app load (alias for useUser)
 */

/**
 * useUser Hook
 *
 * Replaces Redux selector.
 * Fetches and caches user data using TanStack Query.
 *
 * @returns { user, isAuthenticated, isCheckingAuth }
 */
export const useUser = (): AuthState => {
  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: async () => {
      try {
        const response = await authApi.getCurrentUser();
        return response.data;
      } catch (error) {
        // 401/403 means not logged in
        console.log("Auth error:", error);
        return null;
      }
    },
    retry: false,
    staleTime: Infinity, // User data rarely changes automatically
    gcTime: Infinity, // Keep in cache as long as possible
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    user: user || null,
    isAuthenticated: !!user,
    isCheckingAuth: isLoading,
  };
};

/**
 * useRegister Hook
 *
 * Handles user registration.
 * Updates query cache on success.
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Step 1: Register API call
      const registerResponse = await authApi.register(formData);

      // Step 2: Fetch fresh user data
      const userResponse = await authApi.getCurrentUser();

      return {
        registerData: registerResponse.data,
        userData: userResponse.data,
      };
    },
    onSuccess: (response) => {
      // ✅ Update Cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.userData);

      // Welcome message
      toast.success("Account created successfully! Welcome to SocialHub!");

      // Redirect
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Registration error:", error.response?.data?.message);
    },
  });
};

/**
 * useLogin Hook
 *
 * Handles user login.
 * Updates query cache on success.
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Step 1: Login API call
      const loginResponse = await authApi.login(credentials);

      // Step 2: Fetch fresh user data
      const userResponse = await authApi.getCurrentUser();

      return {
        loginData: loginResponse.data,
        userData: userResponse.data,
      };
    },
    onSuccess: (response) => {
      // ✅ Update Cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.userData);

      // Welcome message
      toast.success(`Welcome back, ${response.userData.fullName}!`);

      // Redirect
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Login error:", error.response?.data?.message);
    },
  });
};

/**
 * useLogout Hook
 *
 * Handles user logout.
 * Clears query cache on success.
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // ✅ Clear Cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
      queryClient.removeQueries({ queryKey: AUTH_KEYS.currentUser });

      toast.success("Logged out successfully. See you soon!");
      navigate("/login");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Logout error:", error.response?.data?.message);
      // Force logout locally even if server fails
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
      toast.error("Logout failed, but you've been signed out locally.");
      navigate("/login");
    },
  });
};
