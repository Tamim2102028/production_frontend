import type { AcademicInfo } from "./user.types";

// ====================================
// ACTION RESPONSE DATA TYPES
// ====================================

export interface SendFriendRequestData {
  status: string;
  recipientId: string;
  friendshipId: string;
}

export interface AcceptFriendRequestData {
  status: string;
  requesterId: string;
  friendshipId: string;
}

export interface RejectFriendRequestData {
  requesterId: string;
}

export interface CancelFriendRequestData {
  recipientId: string;
}

export interface UnfriendData {
  userId: string;
}

// ====================================
// LIST RESPONSE DATA TYPES
// ====================================

export interface Friend {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
  academicInfo?: AcademicInfo;
  friendshipId: string;
}

export interface FriendsListResponseData {
  friends: Friend[];
}

export interface FriendRequest {
  requestId: string;
  requester: {
    _id: string;
    fullName: string;
    userName: string;
    avatar: string;
  };
  createdAt: string;
}

export interface ReceivedRequestsResponseData {
  requests: FriendRequest[];
}
