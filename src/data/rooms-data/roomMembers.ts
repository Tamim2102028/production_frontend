export interface RoomMember {
  id: string; // unique membership id
  roomId: string; // which room
  userId: string; // which user is member
  joinedAt: string; // ISO date string when joined
  role?: "member" | "admin" | "creator"; // optional role
  status?: "open" | "hide"; // user-specific visibility (default: "open")
}

// Sample room memberships data - migrated from rooms members array
export const roomMembers: RoomMember[] = [
  // Math Study Group (r1)
  {
    id: "m1",
    roomId: "r1",
    userId: "1",
    joinedAt: "2024-09-10T10:00:00.000Z",
    role: "creator",
    status: "open",
  },
  {
    id: "m2",
    roomId: "r1",
    userId: "4",
    joinedAt: "2024-09-11T12:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m3",
    roomId: "r1",
    userId: "9",
    joinedAt: "2024-09-12T14:00:00.000Z",
    role: "member",
    status: "hide", // User 9 hid this room
  },
  {
    id: "m4",
    roomId: "r1",
    userId: "2",
    joinedAt: "2024-09-13T16:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m5",
    roomId: "r1",
    userId: "3",
    joinedAt: "2024-09-14T18:00:00.000Z",
    role: "member",
    status: "open",
  },

  // Frontend Helpers (r2)
  {
    id: "m6",
    roomId: "r2",
    userId: "7",
    joinedAt: "2025-01-15T08:30:00.000Z",
    role: "creator",
    status: "open",
  },
  {
    id: "m7",
    roomId: "r2",
    userId: "11",
    joinedAt: "2025-01-16T10:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m8",
    roomId: "r2",
    userId: "5",
    joinedAt: "2025-01-17T12:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m9",
    roomId: "r2",
    userId: "6",
    joinedAt: "2025-01-18T14:00:00.000Z",
    role: "member",
    status: "hide", // User 6 hid this room
  },
  {
    id: "m10",
    roomId: "r2",
    userId: "1",
    joinedAt: "2025-01-19T16:00:00.000Z",
    role: "admin",
    status: "open",
  },

  // Private Study Room (r3)
  {
    id: "m11",
    roomId: "r3",
    userId: "3",
    joinedAt: "2025-06-02T12:00:00.000Z",
    role: "creator",
    status: "open",
  },
  {
    id: "m12",
    roomId: "r3",
    userId: "1",
    joinedAt: "2025-06-03T13:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m13",
    roomId: "r3",
    userId: "4",
    joinedAt: "2025-06-04T14:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m14",
    roomId: "r3",
    userId: "2",
    joinedAt: "2025-06-05T15:00:00.000Z",
    role: "member",
    status: "open",
  },

  // Exam Prep — 2025 (r4)
  {
    id: "m15",
    roomId: "r4",
    userId: "9",
    joinedAt: "2025-03-20T15:45:00.000Z",
    role: "creator",
    status: "open",
  },
  {
    id: "m16",
    roomId: "r4",
    userId: "11",
    joinedAt: "2025-03-21T16:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m17",
    roomId: "r4",
    userId: "10",
    joinedAt: "2025-03-22T17:00:00.000Z",
    role: "member",
    status: "open",
  },

  // Gaming Lounge (r5)
  {
    id: "m18",
    roomId: "r5",
    userId: "2",
    joinedAt: "2024-12-01T20:00:00.000Z",
    role: "creator",
    status: "open",
  },
  {
    id: "m19",
    roomId: "r5",
    userId: "3",
    joinedAt: "2024-12-02T21:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m20",
    roomId: "r5",
    userId: "5",
    joinedAt: "2024-12-03T22:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m21",
    roomId: "r5",
    userId: "7",
    joinedAt: "2024-12-04T23:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m22",
    roomId: "r5",
    userId: "8",
    joinedAt: "2024-12-05T10:00:00.000Z",
    role: "member",
    status: "open",
  },

  // Career & Internships (r6)
  {
    id: "m23",
    roomId: "r6",
    userId: "5",
    joinedAt: "2025-02-11T09:20:00.000Z",
    role: "creator",
    status: "open",
  },
  {
    id: "m24",
    roomId: "r6",
    userId: "6",
    joinedAt: "2025-02-12T10:00:00.000Z",
    role: "member",
    status: "open",
  },
  {
    id: "m25",
    roomId: "r6",
    userId: "7",
    joinedAt: "2025-02-13T11:00:00.000Z",
    role: "member",
    status: "open",
  },

  // Study-Buddy Pairing (r7)
  {
    id: "m26",
    roomId: "r7",
    userId: "8",
    joinedAt: "2025-07-07T07:07:07.000Z",
    role: "creator",
    status: "open",
  },
  {
    id: "m27",
    roomId: "r7",
    userId: "1",
    joinedAt: "2025-07-08T08:00:00.000Z",
    role: "member",
    status: "hide",
  },
  {
    id: "m28",
    roomId: "r7",
    userId: "10",
    joinedAt: "2025-07-09T09:00:00.000Z",
    role: "member",
    status: "open",
  },

  // Alumni Network (r8)
  {
    id: "m29",
    roomId: "r8",
    userId: "2",
    joinedAt: "2023-11-11T11:11:11.000Z",
    role: "creator",
    status: "open",
  },
  {
    id: "m30",
    roomId: "r8",
    userId: "1",
    joinedAt: "2023-11-12T12:00:00.000Z",
    role: "member",
    status: "open",
  },
];

// Helper functions
export const getMembersForRoom = (roomId: string): string[] => {
  return roomMembers.filter((m) => m.roomId === roomId).map((m) => m.userId);
};

export const getRoomsForUser = (userId: string): string[] => {
  return roomMembers.filter((m) => m.userId === userId).map((m) => m.roomId);
};

export const isMemberOfRoom = (userId: string, roomId: string): boolean => {
  return roomMembers.some((m) => m.userId === userId && m.roomId === roomId);
};

export const getMemberCount = (roomId: string): number => {
  return roomMembers.filter((m) => m.roomId === roomId).length;
};

export const getMembershipDetails = (
  userId: string,
  roomId: string
): RoomMember | undefined => {
  return roomMembers.find((m) => m.userId === userId && m.roomId === roomId);
};

// Get the creator of a room
export const getRoomCreator = (roomId: string): string | undefined => {
  return roomMembers.find((m) => m.roomId === roomId && m.role === "creator")
    ?.userId;
};

// Get all admins of a room (excluding creator)
export const getRoomAdmins = (roomId: string): string[] => {
  return roomMembers
    .filter((m) => m.roomId === roomId && m.role === "admin")
    .map((m) => m.userId);
};

// Get all admins including creator
export const getAllAdmins = (roomId: string): string[] => {
  return roomMembers
    .filter(
      (m) => m.roomId === roomId && (m.role === "admin" || m.role === "creator")
    )
    .map((m) => m.userId);
};

// Check if user is creator of a room
export const isCreator = (userId: string, roomId: string): boolean => {
  return roomMembers.some(
    (m) => m.userId === userId && m.roomId === roomId && m.role === "creator"
  );
};

// Check if user is admin of a room (not including creator)
export const isAdmin = (userId: string, roomId: string): boolean => {
  return roomMembers.some(
    (m) => m.userId === userId && m.roomId === roomId && m.role === "admin"
  );
};

// Check if user is admin or creator
export const isAdminOrCreator = (userId: string, roomId: string): boolean => {
  return roomMembers.some(
    (m) =>
      m.userId === userId &&
      m.roomId === roomId &&
      (m.role === "admin" || m.role === "creator")
  );
};

// Get visible rooms for a user (only "open" status, excluding deleted rooms)
export const getVisibleRoomsForUser = (userId: string): string[] => {
  return roomMembers
    .filter((m) => m.userId === userId && (m.status === "open" || !m.status))
    .map((m) => m.roomId);
};

// Get hidden rooms for a user (only "hide" status)
export const getHiddenRoomsForUser = (userId: string): string[] => {
  return roomMembers
    .filter((m) => m.userId === userId && m.status === "hide")
    .map((m) => m.roomId);
};

// Hide a room for a user
export const hideRoomForUser = (userId: string, roomId: string): void => {
  const membership = roomMembers.find(
    (m) => m.userId === userId && m.roomId === roomId
  );
  if (membership) {
    membership.status = "hide";
  }
};

// Show (unhide) a room for a user
export const showRoomForUser = (userId: string, roomId: string): void => {
  const membership = roomMembers.find(
    (m) => m.userId === userId && m.roomId === roomId
  );
  if (membership) {
    membership.status = "open";
  }
};

// Check if user has hidden a room
export const isRoomHidden = (userId: string, roomId: string): boolean => {
  const membership = roomMembers.find(
    (m) => m.userId === userId && m.roomId === roomId
  );
  return membership?.status === "hide";
};

export default roomMembers;
