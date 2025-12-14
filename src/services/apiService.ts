import { apiClient } from "./api";

// Types for common API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<
      ApiResponse<{ user: User; token: string }>
    >("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post<
      ApiResponse<{ user: User; token: string }>
    >("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/logout");
    localStorage.removeItem("authToken");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },
};

// User Services
export const userService = {
  getProfile: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userData: Partial<User>) => {
    const response = await apiClient.put<ApiResponse<User>>(
      "/users/profile",
      userData
    );
    return response.data;
  },

  followUser: async (userId: string) => {
    const response = await apiClient.post<ApiResponse<null>>(
      `/users/${userId}/follow`
    );
    return response.data;
  },

  unfollowUser: async (userId: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/users/${userId}/follow`
    );
    return response.data;
  },
};

// Post Services
export const postService = {
  getPosts: async (page = 1, limit = 10) => {
    const response = await apiClient.get<
      ApiResponse<{ posts: Post[]; total: number; page: number }>
    >(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  getPost: async (postId: string) => {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (content: string, images?: File[]) => {
    const formData = new FormData();
    formData.append("content", content);

    if (images) {
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    const response = await apiClient.post<ApiResponse<Post>>(
      "/posts",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updatePost: async (postId: string, content: string) => {
    const response = await apiClient.put<ApiResponse<Post>>(
      `/posts/${postId}`,
      { content }
    );
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/posts/${postId}`
    );
    return response.data;
  },

  likePost: async (postId: string) => {
    const response = await apiClient.post<ApiResponse<null>>(
      `/posts/${postId}/like`
    );
    return response.data;
  },

  unlikePost: async (postId: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/posts/${postId}/like`
    );
    return response.data;
  },
};

// Comment Services
export const commentService = {
  getComments: async (postId: string) => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/posts/${postId}/comments`
    );
    return response.data;
  },

  createComment: async (postId: string, content: string) => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      `/posts/${postId}/comments`,
      { content }
    );
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/comments/${commentId}`
    );
    return response.data;
  },
};

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  createdAt: string;
}
