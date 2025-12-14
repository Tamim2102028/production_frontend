import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Friendship } from "../../data/profile-data/friendships";
import { friendships as initialFriendships } from "../../data/profile-data/friendships";
import type { FriendRequest } from "../../data/profile-data/friendRequests";
import { friendRequests as initialFriendRequests } from "../../data/profile-data/friendRequests";

interface FriendsState {
  friendships: Friendship[];
  friendRequests: FriendRequest[];
}

const initialState: FriendsState = {
  friendships: [...initialFriendships],
  friendRequests: [...initialFriendRequests],
};

// ============================================
// SLICE
// ============================================

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    // ==================== FRIEND REQUESTS ====================

    /**
     * Send a friend request
     */
    sendFriendRequest: (
      state,
      action: PayloadAction<{ senderId: string; receiverId: string }>
    ) => {
      const { senderId, receiverId } = action.payload;

      // Check if request already exists
      const existing = state.friendRequests.find(
        (req) =>
          req.status === "pending" &&
          req.senderId === senderId &&
          req.receiverId === receiverId
      );

      if (!existing) {
        state.friendRequests.push({
          id: `req${Date.now()}`,
          senderId,
          receiverId,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }
    },

    /**
     * Cancel a sent friend request
     */
    cancelFriendRequest: (
      state,
      action: PayloadAction<{ senderId: string; receiverId: string }>
    ) => {
      const { senderId, receiverId } = action.payload;

      state.friendRequests = state.friendRequests.filter(
        (req) =>
          !(
            req.status === "pending" &&
            req.senderId === senderId &&
            req.receiverId === receiverId
          )
      );
    },

    /**
     * Accept a friend request (creates friendship, removes request)
     */
    acceptFriendRequest: (
      state,
      action: PayloadAction<{ senderId: string; receiverId: string }>
    ) => {
      const { senderId, receiverId } = action.payload;

      // Find the request
      const requestIndex = state.friendRequests.findIndex(
        (req) =>
          req.status === "pending" &&
          req.senderId === senderId &&
          req.receiverId === receiverId
      );

      if (requestIndex !== -1) {
        // Remove the request
        state.friendRequests.splice(requestIndex, 1);

        // Create friendship
        state.friendships.push({
          id: `f${Date.now()}`,
          user1Id: senderId,
          user2Id: receiverId,
          becameFriendsAt: new Date().toISOString(),
        });
      }
    },

    /**
     * Reject a friend request (removes it completely)
     */
    rejectFriendRequest: (
      state,
      action: PayloadAction<{ senderId: string; receiverId: string }>
    ) => {
      const { senderId, receiverId } = action.payload;

      // Remove the request completely (same as cancel)
      state.friendRequests = state.friendRequests.filter(
        (req) =>
          !(
            req.status === "pending" &&
            req.senderId === senderId &&
            req.receiverId === receiverId
          )
      );
    },

    // ==================== FRIENDSHIPS ====================

    /**
     * Remove a friendship (unfriend)
     */
    removeFriendship: (
      state,
      action: PayloadAction<{ user1Id: string; user2Id: string }>
    ) => {
      const { user1Id, user2Id } = action.payload;

      state.friendships = state.friendships.filter(
        (f) =>
          !(
            (f.user1Id === user1Id && f.user2Id === user2Id) ||
            (f.user1Id === user2Id && f.user2Id === user1Id)
          )
      );
    },
  },
});

// ============================================
// ACTIONS
// ============================================

export const {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriendship,
} = friendsSlice.actions;

// ============================================
// SELECTORS
// ============================================

/**
 * Select all friendships
 */
export const selectAllFriendships = (state: RootState): Friendship[] =>
  state.friends.friendships;

/**
 * Select all friend requests
 */
export const selectAllFriendRequests = (state: RootState): FriendRequest[] =>
  state.friends.friendRequests;

/**
 * Get all friends for a user
 */
export const selectFriendsForUser = (
  state: RootState,
  userId: string
): string[] => {
  return state.friends.friendships
    .filter((f) => f.user1Id === userId || f.user2Id === userId)
    .map((f) => (f.user1Id === userId ? f.user2Id : f.user1Id));
};

/**
 * Get friend count for a user
 */
export const selectFriendCount = (state: RootState, userId: string): number => {
  return state.friends.friendships.filter(
    (f) => f.user1Id === userId || f.user2Id === userId
  ).length;
};

/**
 * Check if two users are friends
 */
export const selectAreFriends = (
  state: RootState,
  user1Id: string,
  user2Id: string
): boolean => {
  return state.friends.friendships.some(
    (f) =>
      (f.user1Id === user1Id && f.user2Id === user2Id) ||
      (f.user1Id === user2Id && f.user2Id === user1Id)
  );
};

/**
 * Get pending friend requests received by a user
 */
export const selectPendingRequestsForUser = (
  state: RootState,
  userId: string
): string[] => {
  return state.friends.friendRequests
    .filter((req) => req.status === "pending" && req.receiverId === userId)
    .map((req) => req.senderId);
};

/**
 * Get pending friend requests sent by a user
 */
export const selectSentRequestsByUser = (
  state: RootState,
  userId: string
): string[] => {
  return state.friends.friendRequests
    .filter((req) => req.status === "pending" && req.senderId === userId)
    .map((req) => req.receiverId);
};

/**
 * Check if user has sent a pending request to another user
 */
export const selectHasPendingRequest = (
  state: RootState,
  senderId: string,
  receiverId: string
): boolean => {
  return state.friends.friendRequests.some(
    (req) =>
      req.status === "pending" &&
      req.senderId === senderId &&
      req.receiverId === receiverId
  );
};

/**
 * Get mutual friends between two users
 */
export const selectMutualFriends = (
  state: RootState,
  user1Id: string,
  user2Id: string
): string[] => {
  const user1Friends = selectFriendsForUser(state, user1Id);
  const user2Friends = selectFriendsForUser(state, user2Id);

  return user1Friends.filter((friendId) => user2Friends.includes(friendId));
};

/**
 * Get friend suggestions for a user (friends of friends)
 */
export const selectFriendSuggestions = (
  state: RootState,
  userId: string
): string[] => {
  const myFriends = selectFriendsForUser(state, userId);
  const suggestions = new Set<string>();

  // Get friends of my friends
  myFriends.forEach((friendId) => {
    const friendsOfFriend = selectFriendsForUser(state, friendId);
    friendsOfFriend.forEach((suggestedId) => {
      // Don't suggest myself or existing friends
      if (suggestedId !== userId && !myFriends.includes(suggestedId)) {
        suggestions.add(suggestedId);
      }
    });
  });

  return Array.from(suggestions);
};

/**
 * Get relationship status between current user and another user
 */
export const selectRelationshipStatus = (
  state: RootState,
  currentUserId: string,
  otherUserId: string
): "friends" | "pending_sent" | "pending_received" | "none" => {
  // Check if friends
  if (selectAreFriends(state, currentUserId, otherUserId)) {
    return "friends";
  }

  // Check if pending request sent
  if (selectHasPendingRequest(state, currentUserId, otherUserId)) {
    return "pending_sent";
  }

  // Check if pending request received
  if (selectHasPendingRequest(state, otherUserId, currentUserId)) {
    return "pending_received";
  }

  return "none";
};

// ============================================
// REDUCER
// ============================================

export default friendsSlice.reducer;
