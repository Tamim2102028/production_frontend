import type { ApiResponse, Pagination } from "./common.types";
import type {
  GROUP_JOIN_METHOD,
  GROUP_MEMBERSHIP_STATUS,
  GROUP_PRIVACY,
  GROUP_ROLES,
  GROUP_TYPES,
} from "../constants";

// Group Details Type
export type Group = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  avatar?: string;
  institution?: string;
  type: (typeof GROUP_TYPES)[keyof typeof GROUP_TYPES];
  privacy?: (typeof GROUP_PRIVACY)[keyof typeof GROUP_PRIVACY];
  settings?: {
    allowComments?: boolean;
    allowPosts?: boolean;
    allowMemberPosting?: boolean;
    requirePostApproval?: boolean;
  };
  membersCount?: number;
  postsCount?: number;
  creator?: string;
  owner?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

// Group Card Type
export type GroupCardProps = {
  group: GroupCard;
  status: (typeof GROUP_MEMBERSHIP_STATUS)[keyof typeof GROUP_MEMBERSHIP_STATUS];
};

export type GroupCard = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  type: (typeof GROUP_TYPES)[keyof typeof GROUP_TYPES];
  privacy?: (typeof GROUP_PRIVACY)[keyof typeof GROUP_PRIVACY];
  membersCount?: number;
  postsCount?: number;
};

export type MyGroupsResponse = ApiResponse<{
  groups: {
    group: GroupCard;
    meta: GroupMeta;
  }[];
  pagination: Pagination;
}>;

export type GroupMeta = {
  status:
    | (typeof GROUP_MEMBERSHIP_STATUS)[keyof typeof GROUP_MEMBERSHIP_STATUS]
    | null;
  isAdmin: boolean;
  isOwner: boolean;
  isModerator: boolean;
  isMember: boolean;
  isBanned: boolean;
  isRestricted: boolean;
};

export type GroupMember = {
  _id: string;
  group: string;
  user: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  role: (typeof GROUP_ROLES)[keyof typeof GROUP_ROLES];
  status: (typeof GROUP_MEMBERSHIP_STATUS)[keyof typeof GROUP_MEMBERSHIP_STATUS];
  joinedAt: Date;
  joinedMethod: (typeof GROUP_JOIN_METHOD)[keyof typeof GROUP_JOIN_METHOD];
};

export type GroupDetailsResponse = ApiResponse<{
  group: Group;
  meta: GroupMeta;
}>;

// Unread counts response type
export type GroupUnreadCountsMeta = {
  unreadPinnedCount: number;
  unreadMarketplaceCount: number;
};

export type GroupUnreadCountsResponse = ApiResponse<{
  group: { _id: string };
  meta: GroupUnreadCountsMeta;
}>;

// Member User Type (for member list)
export type MemberUser = {
  _id: string;
  userName: string;
  fullName: string;
  avatar: string;
  userType: string;
  institution: {
    _id: string;
    name: string;
  } | null;
  department: {
    _id: string;
    name: string;
  } | null;
};

// Member Meta Type (friendship + role info)
export type MemberMeta = {
  // Group role info
  role: (typeof GROUP_ROLES)[keyof typeof GROUP_ROLES];
  memberId: string;
  joinedAt: string;
  // Friendship info
  friendshipId: string | null;
  isFriend: boolean;
  isSentRequest: boolean;
  hasPendingRequest: boolean;
  isBlockedByMe: boolean;
  isBlockedByThem: boolean;
  isSelf: boolean;
};

// Single Member in list
export type GroupMemberItem = {
  user: MemberUser;
  meta: MemberMeta;
};

export type GroupMembersResponse = ApiResponse<{
  members: GroupMemberItem[];
  meta: {
    currentUserRole: (typeof GROUP_ROLES)[keyof typeof GROUP_ROLES] | null;
  };
  pagination: Pagination;
}>;

export type GroupCardResponse = {
  group: GroupCard;
  meta: {
    status:
      | (typeof GROUP_MEMBERSHIP_STATUS)[keyof typeof GROUP_MEMBERSHIP_STATUS]
      | null;
  };
};

export type CreateGroupData = {
  name: string;
  description?: string;
  type: (typeof GROUP_TYPES)[keyof typeof GROUP_TYPES];
  privacy: (typeof GROUP_PRIVACY)[keyof typeof GROUP_PRIVACY];
  settings: {
    allowMemberPosting: boolean;
    requirePostApproval: boolean;
  };
};
