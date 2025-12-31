import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { commentService } from "../../services/common/comment.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError, CommentsResponse } from "../../types";

interface CommentHookProps {
  invalidateKey?: (string | undefined)[] | (string | undefined)[][];
}

export const usePostComments = ({
  postId,
  enabled = true,
}: {
  postId: string;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) =>
      commentService.getPostComments(postId, Number(pageParam)),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasNextPage) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!postId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAddComment = ({
  postId,
  onSuccess,
  invalidateKey,
}: {
  postId: string;
  onSuccess?: () => void;
} & CommentHookProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }: { content: string }) =>
      commentService.addComment(postId, content),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey as (string | undefined)[],
          });
        }
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
  onSuccess,
  invalidateKey,
}: {
  postId: string;
  onSuccess?: () => void;
} & CommentHookProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      // Dynamic Invalidation
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey as (string | undefined)[],
          });
        }
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
  invalidateKey,
}: {
  postId: string;
} & CommentHookProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentService.updateComment(commentId, content),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      // Dynamic Invalidation
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey,
          });
        }
      }
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
  invalidateKey,
}: {
  postId: string;
} & CommentHookProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.toggleLikeComment(commentId),

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
    onSuccess: () => {
      // Dynamic Invalidation
      if (invalidateKey) {
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: invalidateKey,
          });
        }
      }
    },
  });
};
