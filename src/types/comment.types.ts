import type { Pagination } from "./common.types";

export interface CommentAuthor {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: CommentAuthor;
  createdAt: string;
  stats: { likes: number };
  isMine: boolean;
  isLiked: boolean;
  updatedAt?: string;
  isEdited?: boolean;
  editedAt?: string;
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: Pagination;
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

export interface CommentItemProps {
  comment: Comment;
  postOwnerId?: string; // Optional now as we don't use it for delete logic anymore, but kept for compatibility or future use
  currentUserId?: string;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onUpdateComment?: (commentId: string, content: string) => void;
}
