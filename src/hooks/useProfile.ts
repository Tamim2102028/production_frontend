import { useQuery, useMutation, useQueryClient, useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import { AUTH_KEYS } from "./useAuth";
import profileApi from "../services/profile.service";
import type { UpdateGeneralData, UpdateAcademicData, ApiError, ProfilePostsResponse, CreatePostRequest } from "../types";
import type { AxiosError } from "axios";
import { postService } from "../services/utils/post.service";

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
    queryKey: ["profile_header", username],
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
 * useProfileDetails Hook
 *
 * Fetches user profile details data.
 * Uses a separate query key "profile_details" to differentiate from header data.
 *
 * @param username - User's unique username
 * @returns { data, isLoading, error, refetch }
 */
export const useProfileDetails = (username: string | undefined) => {
  return useQuery({
    queryKey: ["profile_details", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await profileApi.getProfileDetails(username);
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
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });

      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
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

      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
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

      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
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

      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
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
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useProfilePosts = (username: string | undefined) => {
  return useInfiniteQuery<ProfilePostsResponse>({
    queryKey: ["profilePosts", username],
    queryFn: async ({ pageParam }) => {
      if (!username) throw new Error("Username is required");
      const page = Number(pageParam || 1);
      const response = await postService.getProfilePosts(username, page);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!username, // Only fetch when username exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateProfilePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePostRequest) => {
      return postService.createPost(payload);
    },
    onSuccess: (response) => {
      // Optimistic update: নতুন পোস্ট লিস্টের শুরুতে যোগ করা
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
          if (!oldData || oldData.pages.length === 0) return oldData;

          const newItem = response.data; // { post, meta }

          // Add to the first page
          const firstPage = oldData.pages[0];
          const updatedFirstPage = {
            ...firstPage,
            data: {
              ...firstPage.data,
              posts: [newItem, ...firstPage.data.posts],
            },
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );
      toast.success(response.message);

      // Profile Header Invalidate করা (যাতে Post Count বাড়ে)
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Create post error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};
