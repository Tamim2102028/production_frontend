import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { commentService } from "../services/comment.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "../types";

export const usePostComments = (
  postId: string,
  targetModel: string,
  enabled = false,
  limit = 10
) => {
  return useInfiniteQuery({
    queryKey: ["comments", postId, targetModel, limit],
    queryFn: ({ pageParam = 1 }) =>
      commentService.getPostComments(postId, targetModel, pageParam, limit),
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

export const useAddComment = (postId: string, targetModel: string) => {
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

export const useDeleteComment = (postId: string, targetModel: string) => {
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

export const useUpdateComment = (postId: string, targetModel: string) => {
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

export const useToggleLikeComment = (postId: string, targetModel: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.toggleLikeComment(commentId, targetModel),
    onSuccess: () => {
      // Invalidate comments for this post to refresh like count and status
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to like comment");
    },
  });
};
