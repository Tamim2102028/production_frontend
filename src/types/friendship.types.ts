import { FRIENDSHIP_STATUS } from "../constants/friendship";

export interface Pagination {
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FriendUser {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
  institutionName: string;
}

export interface FriendshipItem {
  _id: string | null; // Friendship ID (null for suggestions)
  status: keyof typeof FRIENDSHIP_STATUS | "NONE";
  createdAt?: string;
  profile: FriendUser;
}

export interface PaginatedData<T> {
  docs: T[];
  pagination: Pagination;
}

export type FriendsListResponse = PaginatedData<FriendshipItem>;
export type IncomingRequestsResponse = PaginatedData<FriendshipItem>;
export type SentRequestsResponse = PaginatedData<FriendshipItem>;
export type SuggestionsResponse = PaginatedData<FriendshipItem>;

// Backend ApiResponse wrapper structure
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Friendship document structure from backend
interface FriendshipDocument {
  _id: string;
  requester: string;
  recipient: string;
  status: keyof typeof FRIENDSHIP_STATUS;
  createdAt: string;
  updatedAt: string;
}

// Response types wrapped in ApiResponse
export type SendRequestResponse = ApiResponse<FriendshipDocument>;
export type AcceptRequestResponse = ApiResponse<{ message: string }>;
export type RejectRequestResponse = ApiResponse<{ message: string }>;
export type UnfriendResponse = ApiResponse<{ message: string }>;
