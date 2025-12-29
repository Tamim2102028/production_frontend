import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { commentService } from "../../services/utils/comment.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError, CommentsResponse } from "../../types";

// Types for Dynamic Keys
interface CommentHookProps {
  postListKey?: (string | undefined)[]; // যেই পোস্ট লিস্টের কাউন্ট আপডেট করতে হবে (e.g., ["groupPosts", groupId])
}

export const usePostComments = ({
  postId,
  targetModel,
  enabled = true,
}: {
  postId: string;
  targetModel: string;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ["comments", postId, targetModel],
    queryFn: ({ pageParam = 1 }) =>
      commentService.getPostComments(postId, targetModel, Number(pageParam)),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasNextPage) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!postId && !!targetModel && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAddComment = ({
  postId,
  targetModel,
  onSuccess,
  postListKey, // New Prop: Dynamic Key
}: {
  postId: string;
  targetModel: string;
  onSuccess?: () => void;
} & CommentHookProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }: { content: string }) =>
      commentService.addComment(postId, content, targetModel),
    onSuccess: (response) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      // Also invalidate posts list to update comment count (Dynamic)
      if (postListKey) {
        queryClient.invalidateQueries({ queryKey: postListKey });
      } else {
        // Fallback for safety or legacy support
        queryClient.invalidateQueries({ queryKey: ["profilePosts"] });
      }

      // Invalidate group/dept/institution posts if needed
      if (onSuccess) {
        onSuccess();
      }
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useDeleteComment = ({
  postId,
  targetModel,
  onSuccess,
  postListKey, // New Prop: Dynamic Key
}: {
  postId: string;
  targetModel: string;
  onSuccess?: () => void;
} & CommentHookProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.deleteComment(commentId, targetModel),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      // Dynamic Invalidation
      if (postListKey) {
        queryClient.invalidateQueries({ queryKey: postListKey });
      } else {
        queryClient.invalidateQueries({ queryKey: ["profilePosts"] });
      }

      if (onSuccess) {
        onSuccess();
      }
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useUpdateComment = ({
  postId,
  targetModel,
}: {
  postId: string;
  targetModel: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentService.updateComment(commentId, content, targetModel),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useToggleLikeComment = ({
  postId,
  targetModel,
}: {
  postId: string;
  targetModel: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.toggleLikeComment(commentId, targetModel),

    onMutate: async (commentId) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      // Snapshot previous data
      const previousComments = queryClient.getQueriesData({
        queryKey: ["comments", postId],
      });

      // Optimistic Update
      queryClient.setQueriesData(
        { queryKey: ["comments", postId] },
        (oldData: InfiniteData<CommentsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                comments: page.data.comments.map((item) => {
                  if (item.comment._id === commentId) {
                    const isLiked = item.meta.isLiked;
                    return {
                      ...item,
                      meta: {
                        ...item.meta,
                        isLiked: !isLiked,
                      },
                      comment: {
                        ...item.comment,
                        likesCount:
                          (isLiked ? -1 : 1) + (item.comment.likesCount || 0),
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

      return { previousComments };
    },

    onError: (error: AxiosError<ApiError>, _commentId, context) => {
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};
