import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { groupService } from "../services/group.service";
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
  useTogglePin,
} from "./common/usePost";

import { useAddComment, useDeleteComment } from "./common/useComment";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      groupService.createGroup(formData),
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

export const useGroupDetails = () => {
  const { slug } = useParams();
  return useQuery({
    queryKey: ["groupDetails", slug],
    queryFn: async () => await groupService.getGroupDetails(slug as string),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!slug,
    retry: 1,
  });
};

// Lightweight hook for navbar unread counts
export const useGroupUnreadCounts = () => {
  const { slug } = useParams();
  return useQuery({
    queryKey: ["groupUnreadCounts", slug],
    queryFn: async () =>
      await groupService.getGroupUnreadCounts(slug as string),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!slug,
  });
};

export const useGroupMembers = () => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupMembers", slug],
    queryFn: ({ pageParam }) =>
      groupService.getGroupMembers(slug as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: Infinity,
  });
};

// ====================================
// Group Feed & Posts
// ====================================

export const useGroupPosts = () => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupPosts", slug],
    queryFn: ({ pageParam }) =>
      groupService.getGroupPosts(slug as string, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useGroupPinnedPosts = () => {
  const { slug } = useParams();
  return useQuery({
    queryKey: ["groupPinnedPosts", slug],
    queryFn: () => groupService.getGroupPinnedPosts(slug as string),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGroupMarketplacePosts = () => {
  const { slug } = useParams();
  return useInfiniteQuery({
    queryKey: ["groupMarketplacePosts", slug],
    queryFn: ({ pageParam }) =>
      groupService.getGroupMarketplacePosts(
        slug as string,
        pageParam as number
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 1, // 1 minute
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

export const useCreateMarketplacePost = () => {
  const { slug } = useParams();
  return useCreatePost({
    invalidateKey: [
      ["groupMarketplacePosts", slug],
      ["groupDetails", slug],
    ],
  });
};

// Group Post Like Toggle - Using Common Hook with multiple invalidateKeys
export const useToggleLikeGroupPost = () => {
  const { slug } = useParams();
  return useToggleLikePost({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

// Group Post Delete - Using Common Hook with multiple invalidateKeys
export const useDeleteGroupPost = () => {
  const { slug } = useParams();
  return useDeletePost({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
      ["groupDetails", slug],
    ],
  });
};

// Group Post Update - Using Common Hook with multiple invalidateKeys
export const useUpdateGroupPost = () => {
  const { slug } = useParams();
  return useUpdatePost({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

// Group Post Read Status Toggle - Using Common Hook with multiple invalidateKeys
export const useToggleReadStatusGroupPost = () => {
  const { slug } = useParams();
  return useToggleReadStatus({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupUnreadCounts", slug], // Only invalidate unread counts
    ],
  });
};

// Group Post Bookmark Toggle - Using Common Hook with multiple invalidateKeys
export const useToggleBookmarkGroupPost = () => {
  const { slug } = useParams();
  return useToggleBookmark({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

// Group Post Pin Toggle - Using Common Hook with multiple invalidateKeys
export const useTogglePinGroupPost = () => {
  const { slug } = useParams();
  return useTogglePin({
    queryKey: ["groupPosts", slug],
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
      ["groupUnreadCounts", slug], // Invalidate unread counts on pin/unpin
    ],
  });
};

// ====================================
// Action Button Hooks
// ====================================

export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => groupService.joinGroup(slug),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      const { slug } = variables;
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
      queryClient.invalidateQueries({ queryKey: ["groupMembers", slug] });
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
    mutationFn: ({ slug }: { slug: string }) => groupService.leaveGroup(slug),

    onSuccess: (response, variables) => {
      toast.success(response.message);
      const { slug } = variables;
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
      queryClient.invalidateQueries({ queryKey: ["groupMembers", slug] });
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
    mutationFn: ({ slug }: { slug: string }) =>
      groupService.cancelJoinRequest(slug),

    onSuccess: (response, variables) => {
      toast.success(response.message);
      const { slug } = variables;
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
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
    mutationFn: ({ slug }: { slug: string }) => groupService.deleteGroup(slug),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      const { slug } = variables;
      queryClient.invalidateQueries({ queryKey: ["groupDetails", slug] });
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
      slug,
      targetUserIds,
    }: {
      slug: string;
      targetUserIds: string[];
    }) => groupService.inviteMembers(slug, targetUserIds),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", variables.slug],
      });
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
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.removeMember(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
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
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.assignAdmin(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
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
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.revokeAdmin(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const usePromoteToModerator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.promoteToModerator(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const usePromoteToAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.promoteToAdmin(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useDemoteToModerator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.demoteToModerator(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useDemoteToMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.demoteToMember(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useTransferOwnership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.transferOwnership(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", variables.slug],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useBanMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      groupService.banMember(slug, userId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["groupMembers", variables.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["groupDetails", variables.slug],
      });
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

export const useAddGroupComment = ({ postId }: { postId: string }) => {
  const { slug } = useParams();
  return useAddComment({
    postId,
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};

export const useDeleteGroupComment = ({ postId }: { postId: string }) => {
  const { slug } = useParams();
  return useDeleteComment({
    postId,
    invalidateKey: [
      ["groupPosts", slug],
      ["groupPinnedPosts", slug],
      ["groupMarketplacePosts", slug],
    ],
  });
};
