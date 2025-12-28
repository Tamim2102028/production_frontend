import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { groupService } from "../services/group.service";
import { postService } from "../services/post.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { ApiError, FeedResponse, CreatePostRequest } from "../types";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: FormData) => groupService.createGroup(data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      queryClient.invalidateQueries({ queryKey: ["groupDetails"] });

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
    queryFn: ({ pageParam = 1 }) => groupService.getMyGroups(pageParam),
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
    queryFn: ({ pageParam = 1 }) => groupService.getUniversityGroups(pageParam),
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
    queryFn: ({ pageParam = 1 }) => groupService.getCareerGroups(pageParam),
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
    queryFn: ({ pageParam = 1 }) => groupService.getSuggestedGroups(pageParam),
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
    queryFn: ({ pageParam = 1 }) => groupService.getSentRequests(pageParam),
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
    queryFn: ({ pageParam = 1 }) => groupService.getInvitedGroups(pageParam),
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
    queryFn: async () => {
      const result = await groupService.getGroupDetails(slug);
      return result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!slug,
    retry: 1,
  });
};

export const useGroupMembers = (groupId: string) => {
  return useInfiniteQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: ({ pageParam = 1 }) =>
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

export const useGroupFeed = (groupId: string) => {
  return useInfiniteQuery({
    queryKey: ["groupFeed", groupId],
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam || 1);
      return groupService.getGroupFeed(groupId, page);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!groupId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

export const useGroupPinnedPosts = (groupId: string) => {
  return useQuery({
    queryKey: ["groupPinnedPosts", groupId],
    queryFn: () => groupService.getGroupPinnedPosts(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateGroupPost = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) =>
      groupService.createGroupPost(groupId, data),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupFeed", groupId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useToggleLikeGroupPost = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      targetModel,
    }: {
      postId: string;
      targetModel?: string;
    }) => postService.togglePostLike(postId, targetModel),

    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["groupFeed", groupId] });

      const previousGroupFeed = queryClient.getQueriesData({
        queryKey: ["groupFeed", groupId],
      });

      queryClient.setQueriesData(
        { queryKey: ["groupFeed", groupId] },
        (oldData: InfiniteData<FeedResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((item) => {
                  if (item.post._id === postId) {
                    const isLiked = item.meta.isLiked;
                    return {
                      ...item,
                      meta: {
                        ...item.meta,
                        isLiked: !isLiked,
                      },
                      post: {
                        ...item.post,
                        likesCount:
                          (isLiked ? -1 : 1) + (item.post.likesCount || 0),
                      },
                    };
                  }
                  return item;
                }),
              },
            })),
          };
        }
      );

      return { previousGroupFeed };
    },

    onError: (error: AxiosError<ApiError>, _variables, context) => {
      if (context?.previousGroupFeed) {
        context.previousGroupFeed.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useDeleteGroupPost = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      targetModel,
    }: {
      postId: string;
      targetModel?: string;
    }) => postService.deletePost(postId, targetModel),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupFeed", groupId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useUpdateGroupPost = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data,
      targetModel,
    }: {
      postId: string;
      data: { content: string; tags?: string[]; visibility?: string };
      targetModel?: string;
    }) => postService.updatePost(postId, data, targetModel),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["groupFeed", groupId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useToggleReadStatusGroupPost = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      targetModel,
    }: {
      postId: string;
      targetModel?: string;
    }) => postService.toggleReadStatus(postId, targetModel),

    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["groupFeed", groupId] });

      const previousGroupFeed = queryClient.getQueriesData({
        queryKey: ["groupFeed", groupId],
      });

      queryClient.setQueriesData(
        { queryKey: ["groupFeed", groupId] },
        (oldData: InfiniteData<FeedResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((item) => {
                  if (item.post._id === postId) {
                    return {
                      ...item,
                      meta: {
                        ...item.meta,
                        isRead: !item.meta.isRead,
                      },
                    };
                  }
                  return item;
                }),
              },
            })),
          };
        }
      );

      return { previousGroupFeed };
    },

    onError: (error: AxiosError<ApiError>, _variables, context) => {
      if (context?.previousGroupFeed) {
        context.previousGroupFeed.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useToggleBookmarkGroupPost = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["groupFeed", groupId] });

      const previousGroupFeed = queryClient.getQueriesData({
        queryKey: ["groupFeed", groupId],
      });

      queryClient.setQueriesData(
        { queryKey: ["groupFeed", groupId] },
        (oldData: InfiniteData<FeedResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((item) => {
                  if (item.post._id === postId) {
                    return {
                      ...item,
                      meta: {
                        ...item.meta,
                        isSaved: !item.meta.isSaved,
                      },
                    };
                  }
                  return item;
                }),
              },
            })),
          };
        }
      );

      return { previousGroupFeed };
    },

    onError: (error: AxiosError<ApiError>, _variables, context) => {
      if (context?.previousGroupFeed) {
        context.previousGroupFeed.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
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
