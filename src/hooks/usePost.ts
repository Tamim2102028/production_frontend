import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postService } from "../services/post.service";
import type {
  CreatePostRequest,
  ApiError,
  ProfilePostsResponse,
} from "../types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useProfilePosts = (username: string | undefined) => {
  return useInfiniteQuery<ProfilePostsResponse>({
    queryKey: ["profilePosts", username],
    queryFn: async ({ pageParam }) => {
      if (!username) throw new Error("Username is required");
      const page = Number(pageParam || 1);
      const response = await postService.getProfilePosts(username, page);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!username, // Only fetch when username exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useToggleLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      targetModel,
    }: {
      postId: string;
      targetModel?: string;
    }) => postService.togglePostLike(postId, targetModel),

    // ১. ক্লিক করার সাথে সাথে রান হবে (Optimistic Update)
    onMutate: async ({ postId }) => {
      // ব্যাকগ্রাউন্ড ফেচ আটকানো (Safety)
      await queryClient.cancelQueries({ queryKey: ["profilePosts"] });

      // আগের ডেটার স্ন্যাপশট নেওয়া (Rollback এর জন্য)
      const previousProfilePosts = queryClient.getQueriesData({
        queryKey: ["profilePosts"],
      });

      // মেমোরিতে ডেটা ম্যানুয়ালি আপডেট করা (Optimistic Update for all profile posts)
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
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

      // স্ন্যাপশট রিটার্ন করা
      return { previousProfilePosts };
    },
    onError: (error: AxiosError<ApiError>, _variables, context) => {
      // আগের অবস্থায় ফিরিয়ে নেওয়া (Rollback)
      if (context?.previousProfilePosts) {
        context.previousProfilePosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message);
    },
    onSettled: () => {
      // ডেটা সিঙ্ক ঠিক রাখার জন্য একবার রিফ্রেশ
      // queryClient.invalidateQueries({ queryKey: ["profilePosts"] });
    },
  });
};

export const useToggleReadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      targetModel,
    }: {
      postId: string;
      targetModel?: string;
    }) => postService.toggleReadStatus(postId, targetModel),

    // Optimistic Update
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ["profilePosts"] });

      const previousProfilePosts = queryClient.getQueriesData({
        queryKey: ["profilePosts"],
      });

      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
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

      return { previousProfilePosts };
    },

    onError: (error: AxiosError<ApiError>, _variables, context) => {
      if (context?.previousProfilePosts) {
        context.previousProfilePosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message);
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
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
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

      return { previousProfilePosts };
    },

    onError: (error: AxiosError<ApiError>, _postId, context) => {
      if (context?.previousProfilePosts) {
        context.previousProfilePosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message);
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
    onSuccess: (response) => {
      // Optimistic update: নতুন পোস্ট লিস্টের শুরুতে যোগ করা
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
          if (!oldData || oldData.pages.length === 0) return oldData;

          const newItem = response.data; // { post, meta }

          // Add to the first page
          const firstPage = oldData.pages[0];
          const updatedFirstPage = {
            ...firstPage,
            data: {
              ...firstPage.data,
              posts: [newItem, ...firstPage.data.posts],
            },
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );
      toast.success(response.message);

      // Profile Header Invalidate করা (যাতে Post Count বাড়ে)
      queryClient.invalidateQueries({ queryKey: ["profile_header"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Create post error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
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
      targetModel,
    }: {
      postId: string;
      data: { content: string; tags?: string[]; visibility?: string };
      targetModel?: string;
    }) => {
      return postService.updatePost(postId, data, targetModel);
    },
    onSuccess: (data) => {
      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((item) =>
                  item.post._id === data.data.post._id ? data.data : item
                ),
              },
            })),
          };
        }
      );
      toast.success(data.message || data.data?.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Update post error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      targetModel,
    }: {
      postId: string;
      targetModel?: string;
    }) => postService.deletePost(postId, targetModel),
    onSuccess: (_data, { postId }) => {
      // 1. Profile Posts থেকে পোস্টটি রিমুভ করা
      queryClient.setQueriesData(
        { queryKey: ["profilePosts"] },
        (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.filter(
                  (item) => item.post._id !== postId
                ),
              },
            })),
          };
        }
      );

      // 2. Profile Header Invalidate করা (যাতে Post Count কমে)
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success(_data?.message || "Post deleted successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Delete post error:", error);
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
};
