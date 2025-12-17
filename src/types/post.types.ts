export interface Post {
  _id: string;
  content: string;
  images?: string[];
  attachments?: string[];
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
    userName: string;
  };
  privacy?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  tags?: string[];
  isLiked?: boolean;
  isOwnPost?: boolean;
}

export interface FeedResponse {
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

export interface ProfilePostsResponse {
  statusCode: number;
  data: {
    posts: Post[];
    isOwnProfile: boolean;
  };
  message: string;
  success: boolean;
}
