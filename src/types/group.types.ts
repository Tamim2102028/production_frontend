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
  memberCount?: number;
};

// Group Type
export type Group = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  institution?: string;
  type: string;
  privacy?: string;
  settings?: {
    allowComments?: boolean;
    allowPosts?: boolean;
  };
  memberCount?: number;
  postsCount?: number;
  creator?: string;
  owner?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
