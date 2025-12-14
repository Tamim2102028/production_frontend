// Friendship Model - For accepted/established friendships
export interface Friendship {
  id: string;
  user1Id: string;         // First user
  user2Id: string;         // Second user
  becameFriendsAt: string; // When they became friends (ISO format)
}

// Sample friendships data
export const friendships: Friendship[] = [
  // User 1 (Tamim) friendships
  {
    id: "f1",
    user1Id: "1",
    user2Id: "2",
    becameFriendsAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "f2",
    user1Id: "1",
    user2Id: "4",
    becameFriendsAt: "2024-01-06T11:00:00Z",
  },
  {
    id: "f3",
    user1Id: "1",
    user2Id: "5",
    becameFriendsAt: "2024-01-07T09:00:00Z",
  },
  {
    id: "f4",
    user1Id: "1",
    user2Id: "9",
    becameFriendsAt: "2024-01-08T14:00:00Z",
  },
  {
    id: "f5",
    user1Id: "1",
    user2Id: "11",
    becameFriendsAt: "2024-01-09T15:00:00Z",
  },

  // User 2 (Rafid) friendships
  {
    id: "f6",
    user1Id: "2",
    user2Id: "4",
    becameFriendsAt: "2024-01-10T10:00:00Z",
  },

  // User 9 (Tamzid) friendships
  {
    id: "f7",
    user1Id: "4",
    user2Id: "9",
    becameFriendsAt: "2024-01-11T11:00:00Z",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all friends of a user
 */
export const getFriendsForUser = (userId: string): string[] => {
  return friendships
    .filter((f) => f.user1Id === userId || f.user2Id === userId)
    .map((f) => (f.user1Id === userId ? f.user2Id : f.user1Id));
};

/**
 * Check if two users are friends
 */
export const areFriends = (user1Id: string, user2Id: string): boolean => {
  return friendships.some(
    (f) =>
      (f.user1Id === user1Id && f.user2Id === user2Id) ||
      (f.user1Id === user2Id && f.user2Id === user1Id)
  );
};

/**
 * Get a specific friendship
 */
export const getFriendship = (
  user1Id: string,
  user2Id: string
): Friendship | undefined => {
  return friendships.find(
    (f) =>
      (f.user1Id === user1Id && f.user2Id === user2Id) ||
      (f.user1Id === user2Id && f.user2Id === user1Id)
  );
};

/**
 * Get friendship count for a user
 */
export const getFriendCount = (userId: string): number => {
  return friendships.filter(
    (f) => f.user1Id === userId || f.user2Id === userId
  ).length;
};

/**
 * Add a new friendship (after accepting friend request)
 */
export const addFriendship = (
  user1Id: string,
  user2Id: string
): Friendship => {
  // Check if already friends
  if (areFriends(user1Id, user2Id)) {
    throw new Error("Users are already friends");
  }

  const newFriendship: Friendship = {
    id: `f${Date.now()}`,
    user1Id,
    user2Id,
    becameFriendsAt: new Date().toISOString(),
  };

  friendships.push(newFriendship);
  return newFriendship;
};

/**
 * Remove a friendship (unfriend)
 */
export const removeFriendship = (
  user1Id: string,
  user2Id: string
): boolean => {
  const index = friendships.findIndex(
    (f) =>
      (f.user1Id === user1Id && f.user2Id === user2Id) ||
      (f.user1Id === user2Id && f.user2Id === user1Id)
  );

  if (index !== -1) {
    friendships.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * Get mutual friends between two users
 */
export const getMutualFriends = (
  user1Id: string,
  user2Id: string
): string[] => {
  const user1Friends = getFriendsForUser(user1Id);
  const user2Friends = getFriendsForUser(user2Id);

  return user1Friends.filter((friendId) => user2Friends.includes(friendId));
};

/**
 * Get friend suggestions (friends of friends who are not my friends)
 */
export const getFriendSuggestions = (userId: string): string[] => {
  const myFriends = getFriendsForUser(userId);
  const suggestions = new Set<string>();

  // Get friends of my friends
  myFriends.forEach((friendId) => {
    const friendsOfFriend = getFriendsForUser(friendId);
    friendsOfFriend.forEach((suggestedId) => {
      // Don't suggest myself or existing friends
      if (suggestedId !== userId && !myFriends.includes(suggestedId)) {
        suggestions.add(suggestedId);
      }
    });
  });

  return Array.from(suggestions);
};
