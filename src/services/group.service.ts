import api from "../lib/axios";
import type {
  MyGroupsResponse,
  GroupDetailsResponse,
  GroupMembersResponse,
} from "../types";

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
  getGroupDetails: async (slug: string): Promise<GroupDetailsResponse> => {
    const response = await api.get<GroupDetailsResponse>(`/groups/${slug}`);
    return response.data;
  },

  // Get My Groups
  getMyGroups: async (page = 1, limit = 10): Promise<MyGroupsResponse> => {
    const response = await api.get<MyGroupsResponse>(`/groups/myGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get University Groups
  getUniversityGroups: async (
    page = 1,
    limit = 10
  ): Promise<MyGroupsResponse> => {
    const response = await api.get<MyGroupsResponse>(
      `/groups/universityGroups`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Career Groups
  getCareerGroups: async (page = 1, limit = 10): Promise<MyGroupsResponse> => {
    const response = await api.get<MyGroupsResponse>(`/groups/careerGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Suggested Groups
  getSuggestedGroups: async (
    page = 1,
    limit = 10
  ): Promise<MyGroupsResponse> => {
    const response = await api.get<MyGroupsResponse>(
      `/groups/suggestedGroups`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Sent Requests
  getSentRequests: async (page = 1, limit = 10): Promise<MyGroupsResponse> => {
    const response = await api.get<MyGroupsResponse>(`/groups/sentRequests`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Invited Groups
  getInvitedGroups: async (page = 1, limit = 10): Promise<MyGroupsResponse> => {
    const response = await api.get<MyGroupsResponse>(`/groups/invitedGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Leave Group
  leaveGroup: async (groupId: string) => {
    const response = await api.delete(`/groups/${groupId}/leave`);
    return response.data;
  },

  // Join Group
  joinGroup: async (groupId: string) => {
    const response = await api.post(`/groups/${groupId}/join`);
    return response.data;
  },

  // Cancel Join Request
  cancelJoinRequest: async (groupId: string) => {
    const response = await api.post(`/groups/${groupId}/cancel-request`);
    return response.data;
  },

  // Accept Invite
  acceptInvite: async (groupId: string) => {
    const response = await api.post(`/groups/${groupId}/accept-invite`);
    return response.data;
  },

  // Reject Invite
  rejectInvite: async (groupId: string) => {
    const response = await api.post(`/groups/${groupId}/reject-invite`);
    return response.data;
  },

  // Remove Member (Kick)
  removeMember: async (groupId: string, userId: string) => {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },

  // Assign Admin
  assignAdmin: async (groupId: string, userId: string) => {
    const response = await api.patch(`/groups/${groupId}/admins/${userId}`);
    return response.data;
  },

  // Revoke Admin
  revokeAdmin: async (groupId: string, userId: string) => {
    const response = await api.delete(`/groups/${groupId}/admins/${userId}`);
    return response.data;
  },

  // Get Group Members
  getGroupMembers: async (
    groupId: string,
    page = 1,
    limit = 10
  ): Promise<GroupMembersResponse> => {
    const response = await api.get<GroupMembersResponse>(
      `/groups/${groupId}/members`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};
