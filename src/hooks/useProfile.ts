import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppDispatch } from "../store/store.hooks";
import { setUser } from "../store/slices/authSlice";
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
 * Profile related সব hooks এখানে।
 *
 * Hooks:
 * - useProfileHeader: Username দিয়ে profile header data fetch
 * - useUpdateGeneral: General info update (name, bio, etc.)
 * - useUpdateAcademic: Academic info update
 * - useUpdateAvatar: Avatar image update
 * - useUpdateCoverImage: Cover image update
 * - useChangePassword: Password change
 */

/**
 * useProfileHeader Hook
 *
 * User এর profile header data fetch করে (bio, stats, friendship status)।
 * Posts/files এর data এতে নেই - আলাদা hooks আছে।
 *
 * @param username - User's unique username
 * @returns { data, isLoading, error, refetch }
 *
 * @example
 * const { data: headerData, isLoading } = useProfileHeader("tamim2102028");
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
 * General profile info update করে।
 * Success হলে profile cache এবং currentUser cache invalidate করে।
 *
 * @returns { mutate, isPending, isError, error }
 *
 * @example
 * const { mutate: updateProfile, isPending } = useUpdateGeneral();
 * updateProfile({ fullName: "New Name", bio: "New bio" });
 */
export const useUpdateGeneral = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateGeneralData) => profileApi.updateGeneral(data),
    onSuccess: (response) => {
      // ✅ Update Redux state (response.data is the user directly)
      dispatch(setUser(response.data));
      // ✅ Invalidate caches
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // ✅ Show toast
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
 * Academic info update করে (session, section, rank, etc.)
 *
 * @returns { mutate, isPending, isError, error }
 */
export const useUpdateAcademic = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateAcademicData) => profileApi.updateAcademic(data),
    onSuccess: (response) => {
      dispatch(setUser(response.data));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
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
 * Avatar image upload করে।
 * FormData নেয় 'avatar' field এ file সহ।
 *
 * @returns { mutate, isPending, isError, error }
 *
 * @example
 * const { mutate: updateAvatar } = useUpdateAvatar();
 * const formData = new FormData();
 * formData.append("avatar", file);
 * updateAvatar(formData);
 */
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updateAvatar(formData),
    onSuccess: (response) => {
      dispatch(setUser(response.data));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
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
 * Cover image upload করে।
 * FormData নেয় 'coverImage' field এ file সহ।
 *
 * @returns { mutate, isPending, isError, error }
 */
export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updateCoverImage(formData),
    onSuccess: (response) => {
      dispatch(setUser(response.data));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
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
 * Password change করে।
 *
 * @returns { mutate, isPending, isError, error }
 *
 * @example
 * const { mutate: changePassword } = useChangePassword();
 * changePassword({ oldPassword: "old123", newPassword: "new456" });
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
