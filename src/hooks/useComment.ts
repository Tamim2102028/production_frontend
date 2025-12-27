import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { commentService } from "../services/comment.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError, CommentsResponse } from "../types";

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
}: {
  postId: string;
  targetModel: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }: { content: string }) =>
      commentService.addComment(postId, content, targetModel),
    onSuccess: () => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      // Also invalidate profile posts to update comment count
      queryClient.invalidateQueries({ queryKey: ["profilePosts"] });
      // Invalidate group/dept/institution posts if needed
      // For now, simpler invalidation
      toast.success("Comment added!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to add comment");
    },
  });
};

export const useDeleteComment = ({
  postId,
  targetModel,
}: {
  postId: string;
  targetModel: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.deleteComment(commentId, targetModel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["profilePosts"] });
      toast.success("Comment deleted");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to delete comment");
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment updated");
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update comment";
      if (errorMessage.includes("maximum allowed length")) {
        toast.error("Comment cannot exceed 1000 characters");
      } else {
        toast.error(errorMessage);
      }
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
      toast.error(
        error.response?.data?.message || "Failed to like/unlike comment"
      );
    },
  });
};
