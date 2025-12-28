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
  status: (typeof GROUP_MEMBERSHIP_STATUS)[keyof typeof GROUP_MEMBERSHIP_STATUS];
  isAdmin: boolean;
  isOwner: boolean;
  isModerator: boolean;
  isMember: boolean;
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

export type GroupMembersResponse = ApiResponse<{
  members: {
    member: GroupMember;
    meta: {
      isFriend: boolean;
      hasPendingRequest: boolean;
      isSentRequest: boolean;
    };
  }[];
  pagination: Pagination;
}>;
