import api from "../lib/axios";
import type { ApiResponse } from "../types/user.types";
import type {
  SendFriendRequestData,
  AcceptFriendRequestData,
  RejectFriendRequestData,
  CancelFriendRequestData,
  UnfriendData,
  BlockData,
  UnblockData,
  FriendsListResponseData,
  ReceivedRequestsResponseData,
} from "../types/friendship.types";

/**
 * ====================================
 * FRIENDSHIP API SERVICE
 * ====================================
 */

export const friendshipApi = {
  // Send Friend Request
  sendRequest: async (
    userId: string
  ): Promise<ApiResponse<SendFriendRequestData>> => {
    const response = await api.post(`/friendships/request/send/${userId}`);
    return response.data;
  },

  // Accept Friend Request
  acceptRequest: async (
    requesterId: string
  ): Promise<ApiResponse<AcceptFriendRequestData>> => {
    const response = await api.patch(
      `/friendships/request/accept/${requesterId}`
    );
    return response.data;
  },

  // Reject Friend Request
  rejectRequest: async (
    requesterId: string
  ): Promise<ApiResponse<RejectFriendRequestData>> => {
    const response = await api.delete(
      `/friendships/request/reject/${requesterId}`
    );
    return response.data;
  },

  // Cancel Sent Request
  cancelRequest: async (
    recipientId: string
  ): Promise<ApiResponse<CancelFriendRequestData>> => {
    const response = await api.delete(
      `/friendships/request/cancel/${recipientId}`
    );
    return response.data;
  },

  // Unfriend User
  unfriend: async (friendId: string): Promise<ApiResponse<UnfriendData>> => {
    const response = await api.delete(`/friendships/unfriend/${friendId}`);
    return response.data;
  },

  // Get Friends List
  getFriendsList: async (): Promise<ApiResponse<FriendsListResponseData>> => {
    const response = await api.get("/friendships/list");
    return response.data;
  },

  // Get Received Requests
  getReceivedRequests: async (): Promise<
    ApiResponse<ReceivedRequestsResponseData>
  > => {
    const response = await api.get("/friendships/requests/received");
    return response.data;
  },

  // Block User
  block: async (userId: string): Promise<ApiResponse<BlockData>> => {
    const response = await api.post(`/friendships/block/${userId}`);
    return response.data;
  },

  // Unblock User
  unblock: async (userId: string): Promise<ApiResponse<UnblockData>> => {
    const response = await api.delete(`/friendships/unblock/${userId}`);
    return response.data;
  },
};
