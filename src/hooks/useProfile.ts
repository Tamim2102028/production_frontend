import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AUTH_KEYS } from "./useAuth";
import profileApi from "../services/profile.service";
import type {
  UpdateGeneralData,
  UpdateAcademicData,
} from "../types/profile.types";
import type { ApiError } from "../types/user.types";
import type { AxiosError } from "axios";

/**
 * ====================================
 * PROFILE HOOKS - TanStack Query
 * ====================================
 *
 * Profile related hooks.
 * Uses TanStack Query for state management (formerly Redux).
 *
 * Hooks:
 * - useProfileHeader: Fetch profile header data by username
 * - useUpdateGeneral: Update general info
 * - useUpdateAcademic: Update academic info
 * - useUpdateAvatar: Update avatar image
 * - useUpdateCoverImage: Update cover image
 * - useChangePassword: Change password
 */

/**
 * useProfileHeader Hook
 *
 * Fetches user profile header data (bio, stats, friendship status).
 *
 * @param username - User's unique username
 * @returns { data, isLoading, error, refetch }
 */
export const useProfileHeader = (username: string | undefined) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await profileApi.getProfile(username);
      return response.data;
    },
    enabled: !!username, // Only fetch if username exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1, // Retry once on failure
  });
};

/**
 * useUpdateGeneral Hook
 *
 * Updates general profile info.
 * Updates currentUser cache on success.
 */
export const useUpdateGeneral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGeneralData) => profileApi.updateGeneral(data),
    onSuccess: (response) => {
      // ✅ Update Current User Cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data);

      // ✅ Invalidate profile cache
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success("Profile updated successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

/**
 * useUpdateAcademic Hook
 *
 * Updates academic info (session, section, rank, etc.)
 */
export const useUpdateAcademic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAcademicData) => profileApi.updateAcademic(data),
    onSuccess: (response) => {
      // ✅ Update Current User Cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data);

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Academic info updated!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to update academic info"
      );
    },
  });
};

/**
 * useUpdateAvatar Hook
 *
 * Uploads avatar image.
 */
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updateAvatar(formData),
    onSuccess: (response) => {
      // ✅ Update Current User Cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data);

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Avatar updated!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to update avatar");
    },
  });
};

/**
 * useUpdateCoverImage Hook
 *
 * Uploads cover image.
 */
export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updateCoverImage(formData),
    onSuccess: (response) => {
      // ✅ Update Current User Cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data);

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Cover image updated!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to update cover image"
      );
    },
  });
};

/**
 * useChangePassword Hook
 *
 * Changes password.
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      profileApi.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });
};
