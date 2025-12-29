import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "../services/auth.service";
import type { LoginCredentials, AuthState, ApiError } from "../types";
import type { AxiosError } from "axios";

// Query Keys
export const AUTH_KEYS = {
  currentUser: ["currentUser"] as const,
};

// Default query options for current user
const currentUserQueryOptions = {
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

export const useUser = (): AuthState => {
  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: async () => {
      try {
        const res = await authService.getCurrentUser();
        return res.data.user ?? null;
      } catch {
        return null;
      }
    },
    ...currentUserQueryOptions,
  });

  return {
    user: user ?? null,
    isAuthenticated: Boolean(user),
    isCheckingAuth: isLoading,
  };
};

// Register
export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => authService.register(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      toast.success(response.message);
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Registration failed");
    },
  });
};

// Login
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      toast.success(response.message);
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Login failed");
    },
  });
};

// Logout
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
      queryClient.removeQueries({ queryKey: AUTH_KEYS.currentUser });
      toast.success(response?.message);
      navigate("/login");
    },
    onError: (error: AxiosError<ApiError>) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
      toast.error(
        error?.response?.data?.message ?? "Logout failed, signed out locally."
      );
      navigate("/login");
    },
  });
};

// Change Password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(data),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Change password failed");
    },
  });
};
