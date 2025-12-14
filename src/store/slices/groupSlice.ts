import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Group } from "../../data/group-data/preGroupData";
import { groups } from "../../data/group-data/groupsData";
import {
  groupPostsData,
  type GroupPost,
} from "../../data/group-data/groupPostsData";
import {
  getCurrentUserId,
  getUserById,
  updateUserById,
} from "../../services/userService";
import { reloadProfile } from "./profileSlice";
import {
  removeMemberFromGroup,
  updateMemberRole,
  isAdmin,
} from "../../data/group-data/groupMembers";

interface GroupState {
  // list of groups (seeded from in-repo data)
  groups: Group[];
  // seeded posts for groups
  posts: GroupPost[];
  // optional currently selected group id (UI can use this)
  currentGroupId?: string;
  status: "idle" | "loading" | "failed";
}

const initialState: GroupState = {
  groups: groups,
  posts: groupPostsData,
  currentGroupId: undefined,
  status: "idle",
};

/**
 * requestJoinGroup thunk
 * - Responsibility: perform the side-effect of marking the current user as having sent
 *   a join request to a group. We operate on the in-repo in-memory user fixture using
 *   updateUserById so the entire app preview state stays consistent.
 * - Why a thunk: updating user/group membership is a side-effect (mutates the in-memory
 *   fixtures) and we want to dispatch additional actions (e.g., reloadProfile) after
 *   the mutation. Using createAsyncThunk keeps side-effects out of reducers.
 */
export const requestJoinGroup = createAsyncThunk(
  "groups/requestJoinGroup",
  async (groupId: string, { dispatch }) => {
    const currentUserId = getCurrentUserId();
    const current = getUserById(currentUserId);
    if (!current) return { success: false };

    const alreadyRequested = (current.sentRequestGroup || []).includes(groupId);
    const alreadyMember = (current.joinedGroup || []).includes(groupId);
    if (alreadyRequested || alreadyMember) {
      return { success: false };
    }

    const updated = [...(current.sentRequestGroup || []), groupId];
    // Mutate the in-memory fixture — this is intentional for the preview app.
    updateUserById(currentUserId, { sentRequestGroup: updated });

    // Reload profile slice so UI that reads profile data updates consistently.
    dispatch(reloadProfile());

    return { success: true, groupId, userId: currentUserId };
  }
);

/**
 * cancelJoinRequest thunk
 * - Responsibility: remove a previously sent join request for the current user.
 * - Why a thunk: same reasoning — it mutates the in-memory fixtures and should trigger
 *   a profile reload so other UI can observe the change.
 */
export const cancelJoinRequest = createAsyncThunk(
  "groups/cancelJoinRequest",
  async (groupId: string, { dispatch }) => {
    const currentUserId = getCurrentUserId();
    const current = getUserById(currentUserId);
    if (!current) return { success: false };

    const updated = (current.sentRequestGroup || []).filter(
      (g: string) => g !== groupId
    );
    updateUserById(currentUserId, { sentRequestGroup: updated });
    dispatch(reloadProfile());

    return { success: true, groupId, userId: currentUserId };
  }
);

/**
 * leaveGroup thunk
 * - Responsibility: remove a group from the current user's joinedGroup list.
 * - Mutates the in-memory fixture (preview app) and reloads profile state.
 */
export const leaveGroup = createAsyncThunk(
  "groups/leaveGroup",
  async (groupId: string, { dispatch }) => {
    const currentUserId = getCurrentUserId();
    const current = getUserById(currentUserId);
    if (!current) return { success: false };

    const updated = (current.joinedGroup || []).filter(
      (g: string) => g !== groupId
    );
    updateUserById(currentUserId, { joinedGroup: updated });
    dispatch(reloadProfile());

    return { success: true, groupId, userId: currentUserId };
  }
);

/**
 * makeAdmin thunk
 * - Responsibility: Add a member to the admins list of a group
 * - Only the owner can make someone admin
 */
export const makeAdmin = createAsyncThunk(
  "groups/makeAdmin",
  async ({ groupId, userId }: { groupId: string; userId: string }) => {
    return { success: true, groupId, userId };
  }
);

/**
 * removeAdmin thunk
 * - Responsibility: Remove a member from the admins list of a group
 * - Only the owner can remove admin
 */
export const removeAdmin = createAsyncThunk(
  "groups/removeAdmin",
  async ({ groupId, userId }: { groupId: string; userId: string }) => {
    return { success: true, groupId, userId };
  }
);

/**
 * removeMember thunk
 * - Responsibility: Remove a member from the group
 * - Owner can remove anyone, Admin can remove normal members only
 */
export const removeMember = createAsyncThunk(
  "groups/removeMember",
  async ({ groupId, userId }: { groupId: string; userId: string }) => {
    // Remove from user's joinedGroup list
    const user = getUserById(userId);
    if (user) {
      const updated = (user.joinedGroup || []).filter(
        (g: string) => g !== groupId
      );
      updateUserById(userId, { joinedGroup: updated });
    }

    return { success: true, groupId, userId };
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    // selectGroup sets the currentGroupId so UI can respond without needing props drilling
    selectGroup(state, action: { payload: string }) {
      state.currentGroupId = action.payload;
    },
    // loadGroups could be used to replace groups (not used currently but handy for tests)
    loadGroups(state, action: { payload: Group[] }) {
      state.groups = action.payload;
    },
    // loadPosts can replace posts for testing or future persistence
    loadPosts(state, action: { payload: GroupPost[] }) {
      state.posts = action.payload;
    },
    // createGroup adds a new group to the state
    createGroup(state, action: { payload: Group }) {
      state.groups.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestJoinGroup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestJoinGroup.fulfilled, (state) => {
        // After a successful request, we keep groups/posts unchanged here because
        // the authoritative membership lives in the profile/user fixture. Components
        // should read profile state (or call selectors) to determine membership.
        state.status = "idle";
      })
      .addCase(cancelJoinRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(cancelJoinRequest.fulfilled, (state) => {
        state.status = "idle";
      });

    builder
      .addCase(leaveGroup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(leaveGroup.fulfilled, (state) => {
        state.status = "idle";
      });

    builder
      .addCase(makeAdmin.fulfilled, (state, action) => {
        const { groupId, userId } = action.payload;
        const group = state.groups.find((g) => g.id === groupId);
        if (group && !isAdmin(userId, groupId)) {
          // Update role in groupMembers.ts
          updateMemberRole(userId, groupId, "admin");
        }
      })
      .addCase(removeAdmin.fulfilled, (state, action) => {
        const { groupId, userId } = action.payload;
        const group = state.groups.find((g) => g.id === groupId);
        if (group) {
          // Update role back to member in groupMembers.ts
          updateMemberRole(userId, groupId, "member");
        }
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        const { groupId, userId } = action.payload;
        const group = state.groups.find((g) => g.id === groupId);
        if (group) {
          // Remove member from groupMembers.ts
          removeMemberFromGroup(userId, groupId);
        }
      });
  },
});

export const { selectGroup, loadGroups, loadPosts, createGroup } =
  groupSlice.actions;
export default groupSlice.reducer;

/** Selectors
 * These small helper selectors provide a consistent API for components to read
 * group-related data from the Redux store. We intentionally avoid importing
 * RootState here to prevent circular imports; components should call them via
 * `useAppSelector((state) => selectGroupById(state, id))`.
 */
import type { RootState } from "../store";

export const selectGroupById = (
  state: RootState,
  id: string
): Group | undefined => state.groups?.groups?.find((g: Group) => g.id === id);

export const selectGroupPosts = (
  state: RootState,
  groupId: string
): GroupPost[] =>
  (state.groups?.posts || []).filter((p: GroupPost) => p.groupId === groupId);

// selectIsMember/selectHasRequested read membership info from the profile slice
// because membership is stored on the user/profile fixture for this preview app.
export const selectIsMember = (state: RootState, groupId: string): boolean => {
  const joined = state.profile?.joinedGroup || [];
  const preJoined = state.profile?.preJoinedGroup || [];
  return !![...joined, ...preJoined].includes(groupId);
};

export const selectHasRequested = (
  state: RootState,
  groupId: string
): boolean => !!(state.profile?.sentRequestGroup || []).includes(groupId);
