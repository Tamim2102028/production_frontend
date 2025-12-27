import type { ApiResponse, Pagination } from "./common.types";
import type {
  GROUP_JOIN_METHOD,
  GROUP_MEMBERSHIP_STATUS,
  GROUP_ROLES,
} from "../constants";

// Group Card Type
export type GroupCardProps = {
  group: GroupCard;
  status: string;
};
export type GroupCard = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  type: string;
  privacy?: string;
  membersCount?: number;
  postsCount?: number;
};

export type GroupCardResponse = {
  group: GroupCard;
  meta: GroupMeta;
};

export type MyGroupsResponse = ApiResponse<{
  groups: GroupCardResponse[];
  pagination: Pagination;
}>;

// Group Type
export type Group = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  avatar?: string;
  institution?: string;
  type: string;
  privacy?: string;
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

export type GroupMeta = {
  status: string;
  isMember: boolean;
  isAdmin: boolean;
  isOwner: boolean;
};

export type GroupDetailsResponse = ApiResponse<{
  group: Group;
  meta: GroupMeta;
}>;

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

export type GroupMemberMeta = {
  isFriend: boolean;
  hasPendingRequest: boolean;
  isSentRequest: boolean;
};

export type GroupMemberItem = {
  member: GroupMember;
  meta: GroupMemberMeta;
};

export type GroupMembersResponse = ApiResponse<{
  members: GroupMemberItem[];
  pagination: Pagination;
}>;
