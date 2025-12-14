import api from "../lib/axios";

export interface Post {
  _id: string;
  content: string;
  images: string[];
  author: {
    _id: string;
    fullName: string;
    avatar: string;
    username: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

interface FeedResponse {
  statusCode: number;
  data: {
    posts: Post[];
    hasNextPage: boolean;
    nextPage: number | null;
    totalDocs: number;
  };
  message: string;
  success: boolean;
}

export const postService = {
  // Get News Feed
  getNewsFeed: async (params: {
    page: number;
    limit: number;
    type?: string;
  }) => {
    const response = await api.get<FeedResponse>("/posts", { params });
    return response.data;
  },

  // Create Post
  createPost: async (data: FormData) => {
    const response = await api.post("/posts", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Like Post
  toggleLike: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },
};
