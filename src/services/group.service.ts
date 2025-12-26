import api from "../lib/axios";
import type { MyGroupsResponse } from "../types/group.types";

export const groupService = {
  // Create Group
  createGroup: async (data: FormData) => {
    const response = await api.post("/groups", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get Group Details
  getGroupDetails: async (slug: string) => {
    const response = await api.get(`/groups/${slug}`);
    return response.data;
  },

  // Get My Groups
  getMyGroups: async (page = 1, limit = 10): Promise<MyGroupsResponse> => {
    const response = await api.get<MyGroupsResponse>(`/groups/myGroups`, {
      params: { page, limit },
    });
    return response.data;
  },
};
