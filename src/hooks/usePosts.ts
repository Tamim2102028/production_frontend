import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postService } from "../services/post.service";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// Hook for fetching feed with infinite scroll
export const useNewsFeed = () => {
  // ১. Redux থেকে ফিল্টার স্টেট রিড করছি
  const { filterType } = useSelector((state: RootState) => state.feed);

  return useInfiniteQuery({
    // ২. queryKey-তে filterType পাস করছি।
    // ফলে যখনই ইউজার ফিল্টার চেঞ্জ করবে (Redux update হবে),
    // TanStack Query অটোমেটিক নতুন ডাটা ফেচ করবে।
    queryKey: ["posts", "feed", filterType],

    queryFn: async ({ pageParam = 1 }) => {
      const response = await postService.getNewsFeed({
        page: pageParam as number,
        limit: 10,
        type: filterType,
      });
      return response.data;
    },

    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },

    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // ৫ মিনিট ডাটা ফ্রেশ থাকবে
  });
};

// Hook for creating a new post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.createPost,
    onSuccess: () => {
      // ৩. পোস্ট ক্রিয়েট সফল হলে আমরা 'feed' কি-এর সব ডাটা ইনভ্যালিড করে দেব।
      // এতে করে অটোমেটিক রি-ফেচ হবে এবং নতুন পোস্ট ফিডে দেখা যাবে।
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
};

// Hook for toggling like
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.toggleLike,
    onSuccess: (_, postId) => {
      // Optimistic update বা Invalidate করা যেতে পারে
      // এখানে সিম্পল রাখার জন্য আমরা স্পেসিফিক পোস্ট বা ফিড রিফ্রেশ করতে পারি
      // তবে লাইকের ক্ষেত্রে Optimistic Update ভালো, যেটা UI তে ইনস্ট্যান্ট রেসপন্স দেয়
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
