import { useQuery } from "@tanstack/react-query";
import { postService } from "../services/post.service";

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
