import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { AUTH_KEYS } from "./useAuth";
import { profileService } from "../services/profile.service";
import type {
  UpdateGeneralData,
  UpdateAcademicData,
  ApiError,
  ProfilePostsResponse,
} from "../types";
import type { AxiosError } from "axios";
import {
  useCreatePost,
  useDeletePost,
  useToggleBookmark,
  useToggleLikePost,
  useToggleReadStatus,
  useUpdatePost,
} from "./utils/usePost";
import { useToggleFollow } from "./utils/useFollow";

// Import Generic Utils

const FIVE_MIN = 1000 * 60 * 5;

const defaultProfileQueryOptions = {
  staleTime: FIVE_MIN,
  retry: 1,
};

export const useProfileHeader = (username?: string) =>
  useQuery({
    queryKey: ["profile_header", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await profileService.getProfileHeader(username);
      return response.data;
    },
    enabled: Boolean(username),
    ...defaultProfileQueryOptions,
  });

export const useProfileDetails = (username?: string) =>
  useQuery({
    queryKey: ["profile_details", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await profileService.getProfileDetails(username);
      return response.data;
    },
    enabled: Boolean(username),
    ...defaultProfileQueryOptions,
  });

export const useUpdateGeneral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGeneralData) => profileService.updateGeneral(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data);
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update General failed");
    },
  });
};

export const useUpdateAcademic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAcademicData) =>
      profileService.updateAcademic(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data);
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update Academic failed");
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => profileService.updateAvatar(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data);
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update Avatar failed");
    },
  });
};

export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      profileService.updateCoverImage(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data);
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message ?? "Update Cover Image failed"
      );
    },
  });
};

export const useProfilePosts = (username?: string) =>
  useInfiniteQuery<ProfilePostsResponse>(
    {
      queryKey: ["profilePosts", username],
      queryFn: async ({ pageParam }) => {
        if (!username) throw new Error("Username is required");
        const page = Number(pageParam ?? 1);
        const response = await profileService.getProfilePosts(username, page);
        return response;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.data.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
      enabled: Boolean(username),
      staleTime: FIVE_MIN,
    },
    undefined
  );

export const useCreateProfilePost = () => {
  return useCreatePost({
    queryKey: ["profilePosts"],       
    invalidateKey: ["profile_header"],
  });
};

export const useToggleLikeProfilePost = (username?: string) => {
  return useToggleLikePost({
    queryKey: ["profilePosts", username],

    
    invalidateKey: ["profile_header", username],
  });
};

export const useDeleteProfilePost = (username?: string) => {
  return useDeletePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profile_header", username],
  });
};

export const useUpdateProfilePost = (username?: string) => {
  return useUpdatePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profile_header", username],
  });
};

export const useToggleReadStatusProfilePost = (username?: string) => {
  return useToggleReadStatus({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profile_header", username],
  });
};

export const useToggleBookmarkProfilePost = (username?: string) => {
  return useToggleBookmark({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profile_header", username],
  });
};

export const useToggleFollowProfile = (username?: string) => {
  return useToggleFollow({
      invalidateKey: ["profile_header", username],
  });
};
