import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postService } from "../services/post.service";
import { type Post } from "../types/post.types";
import { toast } from "sonner";
import type { POST_VISIBILITY } from "../constants";

/**
 * ====================================
 * POST HOOKS - TanStack Query
 * ====================================
 *
 * Post related সব hooks এখানে।
 */

/**
 * useProfilePosts Hook
 *
 * একটি user এর profile posts fetch করে।
 * Own profile হলে mixed privacy posts আসবে, অন্যের হলে শুধু public posts।
 *
 * @param username - User's unique username
 * @returns { data: { posts, isOwnProfile }, isLoading, error }
 *
 * @example
 * const { data, isLoading } = useProfilePosts("tamim2102028");
 * // data.posts → Post array
 * // data.isOwnProfile → boolean
 */
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
        (oldData: { posts: Post[]; isOwnProfile: boolean } | undefined) => {
          if (!oldData || !oldData.posts) return oldData;

          return {
            ...oldData,
            posts: oldData.posts.map((post: Post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  context: {
                    ...post.context,
                    isLiked: !post.context.isLiked,
                  },
                  stats: {
                    ...post.stats,
                    likes:
                      (post.context.isLiked ? -1 : 1) + (post.stats.likes || 0),
                  },
                };
              }
              return post;
            }),
          };
        }
      );

      // স্ন্যাপশট রিটার্ন করা
      return { previousProfilePosts };
    },

    // ২. যদি সার্ভারে এরর হয়
    onError: (_err, _postId, context) => {
      // আগের অবস্থায় ফিরিয়ে নেওয়া
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

/**
 * useCreateProfilePost Hook
 *
 * Profile এ নতুন পোস্ট তৈরি করার জন্য।
 * এটি User মডেলের উপর পোস্ট তৈরি করে।
 */
export const useCreateProfilePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      visibility,
      targetId,
    }: {
      content: string;
      visibility: keyof typeof POST_VISIBILITY;
      targetId: string;
    }) => {
      // JSON payload তৈরি
      const payload = {
        content,
        visibility,
        type: "TEXT",
        targetModel: "User",
        targetId: targetId,
        attachments: [], // আপাতত খালি
        pollOptions: [], // আপাতত খালি
        tags: [], // আপাতত খালি
      };

      return postService.createPost(payload);
    },
    onSuccess: (data) => {
      // Optimistic update: নতুন পোস্ট লিস্টের শুরুতে যোগ করা
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (oldData: { posts: Post[]; isOwnProfile: boolean } | undefined) => {
          if (!oldData) return oldData;
          const newPost = data.data.post;
          return {
            ...oldData,
            posts: [newPost, ...oldData.posts],
          };
        }
      );
      toast.success("Post created successfully!");
    },
    onError: (error: any) => {
      console.error("Create post error:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    },
  });
};
