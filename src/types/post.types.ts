import {
  POST_TYPES,
  POST_TARGET_MODELS,
  POST_VISIBILITY,
} from "../constants/post";

export interface Attachment {
  type: "IMAGE" | "VIDEO" | "PDF" | "DOC" | "LINK";
  url: string;
  name?: string;
}

export interface Post {
  _id: string;
  content: string;
  attachments: Attachment[];

  type: (typeof POST_TYPES)[keyof typeof POST_TYPES];
  postOnModel: (typeof POST_TARGET_MODELS)[keyof typeof POST_TARGET_MODELS];
  postOnId: string;
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];

  author: {
    _id: string;
    fullName: string;
    avatar?: string;
    userName: string;
  };

  stats: {
    likes: number;
    comments: number;
    shares: number;
  };

  context: {
    isLiked: boolean;
    isSaved: boolean;
    isMine: boolean;
    isRead: boolean;
  };

  createdAt: string;
  updatedAt: string;

  // Flags
  isArchived?: boolean;
  isPinned?: boolean;
  isDeleted?: boolean;

  // Optional fields
  tags?: string[];
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

export interface ProfilePostsProps {
  username: string;
  isOwnProfile: boolean;
}

export interface CreateProfilePostProps {
  currentUserId: string;
}

export interface CreatePostRequest {
  content: string;
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
  postOnId: string;
  postOnModel: (typeof POST_TARGET_MODELS)[keyof typeof POST_TARGET_MODELS];
  type: (typeof POST_TYPES)[keyof typeof POST_TYPES];
  attachments: Attachment[];
  pollOptions: string[];
  tags: string[];
}

export interface PostContentProps {
  content: string;
  tags?: string[];
  visibility: (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY];
  isEditing: boolean;
  isUpdating: boolean;
  onUpdate: (data: {
    content: string;
    tags: string[];
    visibility: string;
  }) => void;
  onCancel: () => void;
}
