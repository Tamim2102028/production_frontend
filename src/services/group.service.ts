import api from "../lib/axios";

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
};
