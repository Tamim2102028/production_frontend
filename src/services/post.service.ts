import api from "../lib/axios";
import type {
  CreatePostRequest,
  FeedResponse,
  ProfilePostsResponse,
} from "../types/post.types";

export const postService = {
  // Get News Feed
  getNewsFeed: async (params: {
    page: number;
    limit: number;
    type?: string;
  }) => {
    const response = await api.get<FeedResponse>("/posts/feed", { params });
    return response.data;
  },

  // Create Post
  createPost: async (reqData: CreatePostRequest) => {
    const response = await api.post("/posts", reqData);
    return response.data;
  },

  // Like Post
  togglePostLike: async (postId: string) => {
    // সার্ভারে রিকোয়েস্ট (POST বা PUT)
    const { data } = await api.post(`/posts/${postId}/toggle-like`);
    return data;
  },

  // Get Profile Posts
  getProfilePosts: async (username: string) => {
    const response = await api.get<ProfilePostsResponse>(
      `/posts/profile/${username}`
    );
    return response.data;
  },

  // Delete Post
  deletePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Toggle Read Status
  toggleReadStatus: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/toggle-read`);
    return response.data;
  },

  // Toggle Bookmark (Save Post)
  toggleBookmark: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/toggle-bookmark`);
    return response.data;
  },
};
