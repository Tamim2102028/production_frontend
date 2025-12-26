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
  institution?: string;
  type: string;
  privacy?: string;
  membersCount?: number;
  status?: string; // Status of the current user in this group
};

export type MyGroupsResponse = ApiResponse<{
  groups: GroupCard[];
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
};

export type GroupDetailsResponse = ApiResponse<{
  group: Group;
  meta: GroupMeta;
}>;
