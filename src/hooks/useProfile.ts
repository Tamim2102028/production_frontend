import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  useTogglePin,
} from "./common/usePost";

import {
  useAddComment,
  useDeleteComment,
} from "./common/useComment";
import { useToggleFollow } from "./common/useFollow";
import { useParams } from "react-router-dom";
import { AUTH_KEYS } from "./useAuth";

// Import Generic Utils

const FIVE_MIN = 1000 * 60 * 5;

const defaultProfileQueryOptions = {
  staleTime: FIVE_MIN,
  retry: 1,
};

export const useProfileHeader = (username?: string) =>
  useQuery({
    queryKey: ["profileHeader", username],
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
    queryKey: ["profileDetails", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await profileService.getProfileDetails(username);
      return response.data;
    },
    enabled: Boolean(username),
    ...defaultProfileQueryOptions,
  });

// Update hooks
export const useUpdateGeneral = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateGeneralData) => profileService.updateGeneral(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update General failed");
    },
  });
};

export const useUpdateAcademic = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateAcademicData) =>
      profileService.updateAcademic(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update Academic failed");
    },
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) => profileService.updateAvatar(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message ?? "Update Avatar failed");
    },
  });
};

export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) =>
      profileService.updateCoverImage(formData),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, response.data.user);
      queryClient.invalidateQueries({ queryKey: ["profileHeader"] });
      toast.success(response.message);
      navigate(`/profile/${response.data.user.userName}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message ?? "Update Cover Image failed"
      );
    },
  });
};

// Post hooks
export const useProfilePosts = (username?: string) =>
  useInfiniteQuery<ProfilePostsResponse>({
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
  });

export const useCreateProfilePost = () => {
  const { username } = useParams();
  return useCreatePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

export const useToggleLikeProfilePost = () => {
  const { username } = useParams();
  return useToggleLikePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

export const useDeleteProfilePost = () => {
  const { username } = useParams();
  return useDeletePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

export const useUpdateProfilePost = () => {
  const { username } = useParams();
  return useUpdatePost({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

export const useToggleReadStatusProfilePost = () => {
  const { username } = useParams();
  return useToggleReadStatus({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

export const useToggleBookmarkProfilePost = () => {
  const { username } = useParams();
  return useToggleBookmark({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

export const useTogglePinProfilePost = () => {
  const { username } = useParams();
  return useTogglePin({
    queryKey: ["profilePosts", username],
    invalidateKey: ["profileHeader", username],
  });
};

// Comment hooks
export const useAddProfileComment = ({ postId }: { postId: string }) => {
  return useAddComment({
    postId,
    invalidateKey: ["profilePosts"],
  });
};

export const useDeleteProfileComment = ({ postId }: { postId: string }) => {
  return useDeleteComment({
    postId,
    invalidateKey: ["profilePosts"],
  });
};

// Follow hooks
export const useToggleFollowProfile = () => {
  const { username } = useParams();
  return useToggleFollow({
    invalidateKey: ["profileHeader", username],
  });
};
