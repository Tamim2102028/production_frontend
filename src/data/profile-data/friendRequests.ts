// Friend Request Model - For pending requests only
export interface FriendRequest {
  id: string;
  senderId: string;        // যে request পাঠিয়েছে
  receiverId: string;      // যে request পেয়েছে
  status: "pending";       // Only pending requests are stored
  createdAt: string;       // Request sent time (ISO format)
}

// Sample friend requests data
export const friendRequests: FriendRequest[] = [
  // User 1 (Tamim) sent requests
  {
    id: "req1",
    senderId: "1",
    receiverId: "12",
    status: "pending",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "req2",
    senderId: "1",
    receiverId: "13",
    status: "pending",
    createdAt: "2024-01-16T11:00:00Z",
  },
  {
    id: "req3",
    senderId: "1",
    receiverId: "14",
    status: "pending",
    createdAt: "2024-01-17T09:00:00Z",
  },
  {
    id: "req4",
    senderId: "1",
    receiverId: "15",
    status: "pending",
    createdAt: "2024-01-18T14:00:00Z",
  },

  // User 1 (Tamim) received requests
  {
    id: "req5",
    senderId: "6",
    receiverId: "1",
    status: "pending",
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "req6",
    senderId: "7",
    receiverId: "1",
    status: "pending",
    createdAt: "2024-01-21T11:00:00Z",
  },
  {
    id: "req7",
    senderId: "8",
    receiverId: "1",
    status: "pending",
    createdAt: "2024-01-22T12:00:00Z",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all pending requests received by a user (Inbox)
 */
export const getPendingRequestsForUser = (userId: string): string[] => {
  return friendRequests
    .filter((req) => req.status === "pending" && req.receiverId === userId)
    .map((req) => req.senderId);
};

/**
 * Get all pending requests sent by a user (Outbox)
 */
export const getSentRequestsByUser = (userId: string): string[] => {
  return friendRequests
    .filter((req) => req.status === "pending" && req.senderId === userId)
    .map((req) => req.receiverId);
};

/**
 * Check if user A has sent a pending request to user B
 */
export const hasPendingRequest = (
  senderId: string,
  receiverId: string
): boolean => {
  return friendRequests.some(
    (req) =>
      req.status === "pending" &&
      req.senderId === senderId &&
      req.receiverId === receiverId
  );
};

/**
 * Get a specific friend request
 */
export const getFriendRequest = (
  senderId: string,
  receiverId: string
): FriendRequest | undefined => {
  return friendRequests.find(
    (req) =>
      req.status === "pending" &&
      req.senderId === senderId &&
      req.receiverId === receiverId
  );
};

/**
 * Send a friend request
 */
export const sendFriendRequest = (
  senderId: string,
  receiverId: string
): FriendRequest => {
  // Check if request already exists
  const existing = hasPendingRequest(senderId, receiverId);
  if (existing) {
    throw new Error("Friend request already sent");
  }

  const newRequest: FriendRequest = {
    id: `req${Date.now()}`,
    senderId,
    receiverId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  friendRequests.push(newRequest);
  return newRequest;
};

/**
 * Cancel/Delete a sent friend request
 */
export const cancelFriendRequest = (
  senderId: string,
  receiverId: string
): boolean => {
  const index = friendRequests.findIndex(
    (req) =>
      req.status === "pending" &&
      req.senderId === senderId &&
      req.receiverId === receiverId
  );

  if (index !== -1) {
    friendRequests.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * Reject a received friend request (removes it completely)
 */
export const rejectFriendRequest = (
  senderId: string,
  receiverId: string
): boolean => {
  const index = friendRequests.findIndex(
    (req) =>
      req.status === "pending" &&
      req.senderId === senderId &&
      req.receiverId === receiverId
  );

  if (index !== -1) {
    friendRequests.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * Remove a friend request from the list (e.g., after accepting)
 */
export const removeFriendRequest = (
  senderId: string,
  receiverId: string
): boolean => {
  const index = friendRequests.findIndex(
    (req) => req.senderId === senderId && req.receiverId === receiverId
  );

  if (index !== -1) {
    friendRequests.splice(index, 1);
    return true;
  }
  return false;
};
