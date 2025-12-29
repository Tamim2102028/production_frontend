import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { groupService } from "../services/group.service";
import { postService } from "../services/utils/post.service";
import { POST_TARGET_MODELS } from "../constants";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import type { AxiosError } from "axios";
import type { ApiError } from "../types";
import {
  useCreatePost,
  useDeletePost,
  useToggleBookmark,
  useToggleLikePost,
  useToggleReadStatus,
  useUpdatePost,
} from "./utils/usePost";
import {
  usePostComments,
  useAddComment,
  useDeleteComment,
  useUpdateComment,
  useToggleLikeComment,
} from "./utils/useComment";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: FormData) => groupService.createGroup(data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });

      const groupSlug = data.data.group?.slug;
      navigate(`/groups/${groupSlug}`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useMyGroups = () => {
  return useInfiniteQuery({
    queryKey: ["myGroups", "infinite"],
    queryFn: ({ pageParam }) => groupService.getMyGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUniversityGroups = () => {
  return useInfiniteQuery({
    queryKey: ["universityGroups", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getUniversityGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCareerGroups = () => {
  return useInfiniteQuery({
    queryKey: ["careerGroups", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getCareerGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSuggestedGroups = () => {
  return useInfiniteQuery({
    queryKey: ["suggestedGroups", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getSuggestedGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSentGroupRequests = () => {
  return useInfiniteQuery({
    queryKey: ["sentGroupRequests", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getSentRequests(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvitedGroups = () => {
  return useInfiniteQuery({
    queryKey: ["invitedGroups", "infinite"],
    queryFn: ({ pageParam }) =>
      groupService.getInvitedGroups(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGroupDetails = (slug: string) => {
  return useQuery({
    queryKey: ["groupDetails", slug],
    queryFn: async () => await groupService.getGroupDetails(slug),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!slug,
    retry: 1,
  });
};

export const useGroupMembers = (groupId: string) => {
  return useInfiniteQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: ({ pageParam }) =>
      groupService.getGroupMembers(groupId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });
};

// ====================================
// Group Feed & Posts
// ====================================

export const useGroupPosts = (groupId: string) => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupPosts", slug],
    queryFn: ({ pageParam }) =>
      groupService.getGroupPosts(groupId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!groupId && !!slug,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useGroupPinnedPosts = (groupId: string) => {
  const { slug } = useParams();
  return useQuery({
    queryKey: ["groupPinnedPosts", slug],
    queryFn: () => groupService.getGroupPinnedPosts(groupId),
    enabled: !!groupId && !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateGroupPost = () => {
  const { slug } = useParams();
  return useCreatePost({
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupDetails", slug],
    ],
  });
};

// [REFACTORED] Using Generic Hook
export const useToggleLikeGroupPost = () => {
  const { slug } = useParams();
  return useToggleLikePost({
    queryKey: ["groupPosts", slug],
    invalidateKey: ["groupPinnedPosts", slug], // Pinned post sync করার জন্য
  });
};

// [REFACTORED] Using Generic Hook
export const useDeleteGroupPost = () => {
  const { slug } = useParams();
  return useDeletePost({
    queryKey: ["groupPosts", slug],
    invalidateKey: ["groupDetails", slug], // Post count sync করার জন্য
  });
};

// [REFACTORED] Using Generic Hook
export const useUpdateGroupPost = () => {
  const { slug } = useParams();
  return useUpdatePost({
    queryKey: ["groupPosts", slug],
  });
};

// [REFACTORED] Using Generic Hook
export const useToggleReadStatusGroupPost = () => {
  const { slug } = useParams();
  return useToggleReadStatus({
    queryKey: ["groupPosts", slug],
  });
};

// [REFACTORED] Using Generic Hook
export const useToggleBookmarkGroupPost = () => {
  const { slug } = useParams();
  return useToggleBookmark({
    queryKey: ["groupPosts", slug],
  });
};

// [KEPT ORIGINAL] Generic hook does not have pin functionality yet
export const useTogglePinGroupPost = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      postService.togglePin(postId, POST_TARGET_MODELS.GROUP),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupPosts", slug] });
      queryClient.invalidateQueries({
        queryKey: ["groupPinnedPosts", slug],
      });

      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// ====================================
// Action Button Hooks
// ====================================

export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupService.joinGroup(groupId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupDetails"] });
      queryClient.invalidateQueries({ queryKey: ["sentGroupRequests"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });
      queryClient.invalidateQueries({ queryKey: ["invitedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupService.leaveGroup(groupId),
    onSuccess: (response) => {
      toast.success(response.message);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["groupDetails"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useCancelJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupService.cancelJoinRequest(groupId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupDetails"] });
      queryClient.invalidateQueries({ queryKey: ["sentGroupRequests"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });
      queryClient.invalidateQueries({ queryKey: ["invitedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (groupId: string) => groupService.deleteGroup(groupId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupDetails"] });
      queryClient.invalidateQueries({ queryKey: ["sentGroupRequests"] });
      queryClient.invalidateQueries({ queryKey: ["universityGroups"] });
      queryClient.invalidateQueries({ queryKey: ["careerGroups"] });
      queryClient.invalidateQueries({ queryKey: ["invitedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedGroups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      navigate("/groups");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useInviteMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      targetUserIds,
    }: {
      groupId: string;
      targetUserIds: string | string[];
    }) => groupService.inviteMembers(groupId, targetUserIds),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupDetails"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupService.removeMember(groupId, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useAssignGroupAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupService.assignAdmin(groupId, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useRevokeGroupAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupService.revokeAdmin(groupId, userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupMembers"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

// ====================================
// Group Comment Hooks
// ====================================

export const useGroupPostComments = ({
  postId,
  enabled,
}: {
  postId: string;
  enabled?: boolean;
}) => {
  return usePostComments({
    postId,
    targetModel: POST_TARGET_MODELS.GROUP,
    enabled,
  });
};

export const useAddGroupComment = ({ postId }: { postId: string }) => {
  const { slug } = useParams();
  return useAddComment({
    postId,
    targetModel: POST_TARGET_MODELS.GROUP,
    invalidateKey: ["groupPosts", slug],
  });
};

export const useDeleteGroupComment = ({ postId }: { postId: string }) => {
  const { slug } = useParams();
  return useDeleteComment({
    postId,
    targetModel: POST_TARGET_MODELS.GROUP,
    invalidateKey: ["groupPosts", slug],
  });
};

export const useUpdateGroupComment = ({ postId }: { postId: string }) => {
  return useUpdateComment({
    postId,
    targetModel: POST_TARGET_MODELS.GROUP,
  });
};

export const useToggleLikeGroupComment = ({ postId }: { postId: string }) => {
  return useToggleLikeComment({
    postId,
    targetModel: POST_TARGET_MODELS.GROUP,
  });
};
