import {
  GROUP_LIMIT,
  GROUP_MEMBERS_LIMIT,
  GROUP_POSTS_LIMIT,
} from "../constants";
import api from "../lib/axios";
import type {
  MyGroupsResponse,
  GroupMembersResponse,
  FeedResponse,
  GroupDetailsResponse,
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

  // Get Group Feed
  getGroupFeed: async (groupId: string, page = 1): Promise<FeedResponse> => {
    const limit = GROUP_POSTS_LIMIT;
    const response = await api.get<FeedResponse>(`/groups/${groupId}/feed`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Group Pinned Posts
  getGroupPinnedPosts: async (groupId: string): Promise<FeedResponse> => {
    const response = await api.get<FeedResponse>(`/groups/${groupId}/pinned`);
    return response.data;
  },

  // Get My Groups
  getMyGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(`/groups/myGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get University Groups
  getUniversityGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(
      `/groups/universityGroups`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Career Groups
  getCareerGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(`/groups/careerGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Suggested Groups
  getSuggestedGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(
      `/groups/suggestedGroups`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get Sent Requests
  getSentRequests: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(`/groups/sentRequests`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Invited Groups
  getInvitedGroups: async (page = 1): Promise<MyGroupsResponse> => {
    const limit = GROUP_LIMIT;
    const response = await api.get<MyGroupsResponse>(`/groups/invitedGroups`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Leave Group / Reject Invite
  leaveGroup: async (groupId: string) => {
    const response = await api.delete(`/groups/${groupId}/leave`);
    return response.data;
  },

  // Join Group / Accept Invite
  joinGroup: async (groupId: string) => {
    const response = await api.post(`/groups/${groupId}/join`);
    return response.data;
  },

  // Cancel Join Request
  cancelJoinRequest: async (groupId: string) => {
    const response = await api.post(`/groups/${groupId}/cancel`);
    return response.data;
  },

  // Delete Group
  deleteGroup: async (groupId: string) => {
    const response = await api.delete(`/groups/${groupId}`);
    return response.data;
  },

  // Invite Members
  inviteMembers: async (groupId: string, targetUserIds: string | string[]) => {
    // Backend expects an array, so we ensure it's always an array
    const ids = Array.isArray(targetUserIds) ? targetUserIds : [targetUserIds];
    const response = await api.post(`/groups/${groupId}/invite`, {
      targetUserIds: ids,
    });
    return response.data;
  },

  // Remove Member (Kick)
  removeMember: async (groupId: string, userId: string) => {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },

  // Assign Admin
  assignAdmin: async (groupId: string, userId: string) => {
    const response = await api.patch(
      `/groups/${groupId}/members/${userId}/assign-admin`
    );
    return response.data;
  },

  // Revoke Admin
  revokeAdmin: async (groupId: string, userId: string) => {
    const response = await api.patch(
      `/groups/${groupId}/members/${userId}/revoke-admin`
    );
    return response.data;
  },

  // Get Group Members
  getGroupMembers: async (
    groupId: string,
    page = 1
  ): Promise<GroupMembersResponse> => {
    const limit = GROUP_MEMBERS_LIMIT;
    const response = await api.get<GroupMembersResponse>(
      `/groups/${groupId}/members`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};
