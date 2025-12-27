import type { ApiResponse, Pagination } from "./common.types";

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
  user: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  role: "member" | "admin" | "owner";
  joinedAt: string;
};

export type GroupMembersResponse = ApiResponse<{
  members: GroupMember[];
  pagination: Pagination;
}>;
