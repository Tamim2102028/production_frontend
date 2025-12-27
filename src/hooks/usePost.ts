import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postService } from "../services/post.service";
import {
  type CreatePostRequest,
  type PostResponseItem,
} from "../types/post.types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { ApiError } from "../types/user.types";
import type { Pagination } from "../types/common.types";

export const useProfilePosts = (username: string | undefined) => {
  return useQuery({
    queryKey: ["profilePosts", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await postService.getProfilePosts(username);
      return response.data;
    },
    enabled: !!username, // Only fetch when username exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useToggleLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.togglePostLike(postId),

    // ১. ক্লিক করার সাথে সাথে রান হবে (Optimistic Update)
    onMutate: async (postId) => {
      // ব্যাকগ্রাউন্ড ফেচ আটকানো (Safety)
      await queryClient.cancelQueries({ queryKey: ["profilePosts"] });

      // আগের ডেটার স্ন্যাপশট নেওয়া (Rollback এর জন্য)
      const previousProfilePosts = queryClient.getQueriesData({
        queryKey: ["profilePosts"],
      });

      // মেমোরিতে ডেটা ম্যানুয়ালি আপডেট করা (Optimistic Update for all profile posts)
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (
          oldData:
            | {
                posts: PostResponseItem[];
                pagination: Pagination;
                isOwnProfile: boolean;
              }
            | undefined
        ) => {
          if (!oldData || !oldData.posts) return oldData;

          return {
            ...oldData,
            posts: oldData.posts.map((item) => {
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
          };
        }
      );

      // স্ন্যাপশট রিটার্ন করা
      return { previousProfilePosts };
    },

    // ২. যদি সার্ভারে এরর হয়
    onError: (_error, _postId, context) => {
      // আগের অবস্থায় ফিরিয়ে নেওয়া (Rollback)
      if (context?.previousProfilePosts) {
        context.previousProfilePosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to like post");
    },

    // ৩. সবকিছু শেষে (সফল বা ব্যর্থ)
    onSettled: () => {
      // ডেটা সিঙ্ক ঠিক রাখার জন্য একবার রিফ্রেশ
      // Mock Backend এ স্টেট সেভ হচ্ছে না, তাই রিফ্রেশ করলে লাইক চলে যাবে।
      // Real Backend এ এটা uncomment করতে হবে।
      // queryClient.invalidateQueries({ queryKey: ["profilePosts"] });
    },
  });
};

export const useToggleReadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.toggleReadStatus(postId),

    // Optimistic Update
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["profilePosts"] });

      const previousProfilePosts = queryClient.getQueriesData({
        queryKey: ["profilePosts"],
      });

      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (
          oldData:
            | { posts: PostResponseItem[]; isOwnProfile: boolean }
            | undefined
        ) => {
          if (!oldData || !oldData.posts) return oldData;

          return {
            ...oldData,
            posts: oldData.posts.map((item) => {
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
          };
        }
      );

      return { previousProfilePosts };
    },

    onError: (_error, _postId, context) => {
      if (context?.previousProfilePosts) {
        context.previousProfilePosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to update read status");
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),

    // Optimistic Update
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["profilePosts"] });

      const previousProfilePosts = queryClient.getQueriesData({
        queryKey: ["profilePosts"],
      });

      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (
          oldData:
            | { posts: PostResponseItem[]; isOwnProfile: boolean }
            | undefined
        ) => {
          if (!oldData || !oldData.posts) return oldData;

          return {
            ...oldData,
            posts: oldData.posts.map((item) => {
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
          };
        }
      );

      return { previousProfilePosts };
    },

    onError: (_error, _postId, context) => {
      if (context?.previousProfilePosts) {
        context.previousProfilePosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to bookmark post");
    },
  });
};

/**
 * useCreateProfilePost Hook
 *
 * Profile এ নতুন পোস্ট তৈরি করার জন্য।
 * এটি User মডেলের উপর পোস্ট তৈরি করে।
 */
export const useCreateProfilePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePostRequest) => {
      return postService.createPost(payload);
    },
    onSuccess: (data) => {
      // Optimistic update: নতুন পোস্ট লিস্টের শুরুতে যোগ করা
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (
          oldData:
            | { posts: PostResponseItem[]; isOwnProfile: boolean }
            | undefined
        ) => {
          if (!oldData || !oldData.posts) return oldData;
          const newItem = data.data; // { post, meta }
          return {
            ...oldData,
            posts: [newItem, ...oldData.posts],
          };
        }
      );
      toast.success("Post created successfully!");

      // Profile Header Invalidate করা (যাতে Post Count বাড়ে)
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Create post error:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    },
  });
};

/**
 * useUpdatePost Hook
 *
 * পোস্ট আপডেট করার জন্য।
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      data,
    }: {
      postId: string;
      data: { content: string; tags?: string[]; visibility?: string };
    }) => {
      return postService.updatePost(postId, data);
    },
    onSuccess: (data) => {
      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (
          oldData:
            | { posts: PostResponseItem[]; isOwnProfile: boolean }
            | undefined
        ) => {
          if (!oldData || !oldData.posts) return oldData;
          return {
            ...oldData,
            posts: oldData.posts.map((item) =>
              item.post._id === data.data.post._id ? data.data : item
            ),
          };
        }
      );
      toast.success("Post updated successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Update post error:", error);
      toast.error(error.response?.data?.message || "Failed to update post");
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: (_data, postId) => {
      // 1. Profile Posts থেকে পোস্টটি রিমুভ করা
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (
          oldData:
            | { posts: PostResponseItem[]; isOwnProfile: boolean }
            | undefined
        ) => {
          if (!oldData || !oldData.posts) return oldData;
          return {
            ...oldData,
            posts: oldData.posts.filter((item) => item.post._id !== postId),
          };
        }
      );

      // 2. Profile Header Invalidate করা (যাতে Post Count কমে)
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success("Post deleted successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Delete post error:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    },
  });
};
