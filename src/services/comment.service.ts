import api from "../lib/axios";

export interface CommentAuthor {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
}

export interface CommentStats {
  likes: number;
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: CommentAuthor;
  createdAt: string;
  stats: CommentStats;
  isMine: boolean;
  isLiked: boolean;
  isEdited?: boolean;
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      totalComments: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
  message: string;
}

export interface AddCommentResponse {
  success: boolean;
  data: {
    comment: Comment;
  };
  message: string;
}

export const commentService = {
  // Get comments for a post
  getPostComments: async (postId: string, page = 1, limit = 10) => {
    const response = await api.get<CommentsResponse>(
      `/comments/post/${postId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId: string, content: string) => {
    const response = await api.post<AddCommentResponse>(
      `/comments/post/${postId}`,
      {
        content,
      }
    );
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId: string, content: string) => {
    const response = await api.patch(`/comments/${commentId}`, { content });
    return response.data;
  },
};
