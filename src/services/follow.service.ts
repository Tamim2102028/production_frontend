import api from "../lib/axios";
import type { ApiResponse } from "../types/user.types";

export const followApi = {
  followUser: async (
    userId: string
  ): Promise<ApiResponse<{ isFollowing: boolean }>> => {
    const response = await api.post(`/follows/${userId}`);
    return response.data;
  },

  unfollowUser: async (
    userId: string
  ): Promise<ApiResponse<{ isFollowing: boolean }>> => {
    const response = await api.delete(`/follows/${userId}`);
    return response.data;
  },
};
