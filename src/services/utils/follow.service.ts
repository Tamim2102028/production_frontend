import { FOLLOW_TARGET_MODELS } from "../../constants";
import api from "../../lib/axios";
import type { ApiResponse } from "../../types";

export const followService = {
  // Toggle follow status (handles both follow and unfollow)
  toggleFollow: async (
    targetId: string,
    targetModel: (typeof FOLLOW_TARGET_MODELS)[keyof typeof FOLLOW_TARGET_MODELS]
  ): Promise<ApiResponse<{ isFollowing: boolean }>> => {
    let url = "";

    switch (targetModel) {
      case FOLLOW_TARGET_MODELS.USER:
        url = `/profile/${targetId}/follow`;
        break;
      case FOLLOW_TARGET_MODELS.DEPARTMENT:
        url = `/depts/${targetId}/follow`;
        break;
      case FOLLOW_TARGET_MODELS.INSTITUTION:
        url = `/institutions/${targetId}/follow`;
        break;
      default:
        throw new Error("Invalid target model for follow");
    }

    const response = await api.post(url);
    return response.data;
  },
};
