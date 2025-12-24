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
