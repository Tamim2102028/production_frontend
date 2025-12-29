import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { postService } from "../../services/utils/post.service";
import type {
  ApiError,
  CreatePostRequest,
  ProfilePostsResponse,
} from "../../types";
import { toast } from "sonner";
import { AxiosError } from "axios";

// ইন্টারফেস ডিফাইন করা হলো
interface UsePostMutationProps {
  queryKey?: (string | undefined)[]; // যে লিস্ট আপডেট হবে (e.g. ["groupPosts", groupId])
  invalidateKey?: (string | undefined)[] | (string | undefined)[][]; // Single key or Array of keys
}

export const useCreatePost = ({
  queryKey,
  invalidateKey,
}: UsePostMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postService.createPost(data),
    onSuccess: (response) => {
      // 1. যদি কোনো লিস্ট থাকে, সেখানে ম্যানুয়ালি শুরুতে নতুন পোস্ট অ্যাড করা (Optional)
      if (queryKey) {
        queryClient.setQueriesData(
          { queryKey: queryKey },
          (oldData: InfiniteData<ProfilePostsResponse> | undefined) => {
            if (!oldData || oldData.pages.length === 0) return oldData;

            const newItem = response.data; // { post, meta }
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
      }

      // 2. অন্যান্য রিলেটেড ডেটা সিঙ্ক করা
      if (invalidateKey) {
        // invalidateKey যদি অ্যারে অফ অ্যারে হয় (multiple keys)
        if (Array.isArray(invalidateKey[0])) {
          (invalidateKey as (string | undefined)[][]).forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({ queryKey: invalidateKey });
        }
      }

      toast.success(response.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error?.response?.data?.message;
      toast.error(message || "Create post failed");
    },
  });
};

export const useToggleLikePost = ({ queryKey }: UsePostMutationProps) => {
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
      await queryClient.cancelQueries({ queryKey: queryKey }); // Dynamic Key

      // আগের ডেটার স্ন্যাপশট নেওয়া (Rollback এর জন্য)
      const previousPosts = queryClient.getQueriesData({
        queryKey: queryKey, // Dynamic Key
      });

      // মেমোরিতে ডেটা ম্যানুয়ালি আপডেট করা
      queryClient.setQueriesData(
        { queryKey: queryKey }, // Dynamic Key
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
      return { previousPosts };
    },
    onError: (error: AxiosError<ApiError>, _variables, context) => {
      // আগের অবস্থায় ফিরিয়ে নেওয়া (Rollback)
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useToggleLikePost");
    },
    onSettled: () => {
      // ডেটা সিঙ্ক ঠিক রাখার জন্য একবার রিফ্রেশ করা (Optional if needed)
      // queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useToggleReadStatus = ({ queryKey }: UsePostMutationProps) => {
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
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousPosts = queryClient.getQueriesData({
        queryKey: queryKey,
      });

      queryClient.setQueriesData(
        { queryKey: queryKey },
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

      return { previousPosts };
    },

    onError: (error: AxiosError<ApiError>, _variables, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useToggleReadStatus");
    },
  });
};

export const useToggleBookmark = ({ queryKey }: UsePostMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.toggleBookmark(postId),

    // Optimistic Update
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousPosts = queryClient.getQueriesData({
        queryKey: queryKey,
      });

      queryClient.setQueriesData(
        { queryKey: queryKey },
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

      return { previousPosts };
    },

    onError: (error: AxiosError<ApiError>, _postId, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useToggleBookmark");
    },
  });
};

export const useUpdatePost = ({ queryKey }: UsePostMutationProps) => {
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
        { queryKey: queryKey },
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
      toast.error(message || "Error from useUpdatePost");
    },
  });
};

export const useDeletePost = ({
  queryKey,
  invalidateKey,
}: UsePostMutationProps) => {
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
      // 1. Dynamic Posts List থেকে পোস্টটি রিমুভ করা
      queryClient.setQueriesData(
        { queryKey: queryKey },
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

      // 2. Dynamic Header Invalidate করা (যদি Key থাকে)
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }

      toast.success(_data?.message || "Post deleted successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Delete post error:", error);
      const message = error?.response?.data?.message;
      toast.error(message || "Error from useDeletePost");
    },
  });
};
