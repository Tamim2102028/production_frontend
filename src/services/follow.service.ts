import { FOLLOW_TARGET_MODELS } from "../constants";
import api from "../lib/axios";
import type { ApiResponse } from "../types/user.types";

export const followApi = {
  // Toggle follow status (handles both follow and unfollow)
  toggleFollow: async (
    targetId: string,
    targetModel: (typeof FOLLOW_TARGET_MODELS)[keyof typeof FOLLOW_TARGET_MODELS] = FOLLOW_TARGET_MODELS.USER
  ): Promise<ApiResponse<{ isFollowing: boolean }>> => {
    const response = await api.post(`/follows/${targetId}`, { targetModel });
    return response.data;
  },
};
