export interface GroupMember {
  id: string; // unique membership id
  groupId: string; // which group
  userId: string; // which user is member
  joinedAt: string; // ISO date string when joined
  role?: "member" | "admin" | "owner"; // optional role
  status?: "active" | "pending" | "blocked"; // membership status (default: "active")
}

// Sample group memberships data - migrated from groups members array
export const groupMembers: GroupMember[] = [
  // pg1: BUET Official: CSE Freshers
  {
    id: "gm1",
    groupId: "pg1",
    userId: "1",
    joinedAt: "2024-09-10T10:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm2",
    groupId: "pg1",
    userId: "3",
    joinedAt: "2024-09-11T12:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm3",
    groupId: "pg1",
    userId: "5",
    joinedAt: "2024-09-12T14:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg2: BUET Official: MME Batch
  {
    id: "gm4",
    groupId: "pg2",
    userId: "1",
    joinedAt: "2024-10-01T09:00:00.000Z",
    role: "admin",
    status: "active",
  },
  {
    id: "gm5",
    groupId: "pg2",
    userId: "4",
    joinedAt: "2024-10-02T10:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg3: Dhaka College - Science (Official)
  {
    id: "gm6",
    groupId: "pg3",
    userId: "2",
    joinedAt: "2024-11-01T08:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm7",
    groupId: "pg3",
    userId: "4",
    joinedAt: "2024-11-02T09:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm8",
    groupId: "pg3",
    userId: "5",
    joinedAt: "2024-11-03T10:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg4: Notre Dame - Commerce (Official)
  {
    id: "gm9",
    groupId: "pg4",
    userId: "10",
    joinedAt: "2024-12-01T11:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm10",
    groupId: "pg4",
    userId: "6",
    joinedAt: "2024-12-02T12:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg5: BUET Architecture Club
  {
    id: "gm11",
    groupId: "pg5",
    userId: "1",
    joinedAt: "2025-01-15T08:30:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm12",
    groupId: "pg5",
    userId: "3",
    joinedAt: "2025-01-16T10:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg6: KUET EEE Study Circle
  {
    id: "gm13",
    groupId: "pg6",
    userId: "4",
    joinedAt: "2025-02-10T09:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm14",
    groupId: "pg6",
    userId: "5",
    joinedAt: "2025-02-11T10:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm15",
    groupId: "pg6",
    userId: "15",
    joinedAt: "2025-02-12T11:00:00.000Z",
    role: "admin",
    status: "active",
  },

  // pg7: RUET ME Projects
  {
    id: "gm16",
    groupId: "pg7",
    userId: "7",
    joinedAt: "2025-03-01T07:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm17",
    groupId: "pg7",
    userId: "8",
    joinedAt: "2025-03-02T08:00:00.000Z",
    role: "admin",
    status: "active",
  },
  {
    id: "gm18",
    groupId: "pg7",
    userId: "9",
    joinedAt: "2025-03-03T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg8: Dhaka College - Study Group
  {
    id: "gm19",
    groupId: "pg8",
    userId: "12",
    joinedAt: "2025-04-01T10:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm20",
    groupId: "pg8",
    userId: "13",
    joinedAt: "2025-04-02T11:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm21",
    groupId: "pg8",
    userId: "2",
    joinedAt: "2025-04-03T12:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg9: Rajuk College - Commerce Hub
  {
    id: "gm22",
    groupId: "pg9",
    userId: "5",
    joinedAt: "2025-05-01T09:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm23",
    groupId: "pg9",
    userId: "14",
    joinedAt: "2025-05-02T10:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg10: Software Engineering Jobs
  {
    id: "gm24",
    groupId: "pg10",
    userId: "4",
    joinedAt: "2025-06-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm25",
    groupId: "pg10",
    userId: "5",
    joinedAt: "2025-06-02T09:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm26",
    groupId: "pg10",
    userId: "1",
    joinedAt: "2025-06-03T10:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg11: Banking Careers
  {
    id: "gm27",
    groupId: "pg11",
    userId: "12",
    joinedAt: "2025-07-01T11:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm28",
    groupId: "pg11",
    userId: "13",
    joinedAt: "2025-07-02T12:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg12: BUET Robotics Club
  {
    id: "gm29",
    groupId: "pg12",
    userId: "1",
    joinedAt: "2025-08-01T13:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm30",
    groupId: "pg12",
    userId: "3",
    joinedAt: "2025-08-02T14:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg13: KUET Coding Circle
  {
    id: "gm31",
    groupId: "pg13",
    userId: "15",
    joinedAt: "2025-09-01T15:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm32",
    groupId: "pg13",
    userId: "3",
    joinedAt: "2025-09-02T16:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg14: RUET Alumni Connect
  {
    id: "gm33",
    groupId: "pg14",
    userId: "8",
    joinedAt: "2025-10-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm34",
    groupId: "pg14",
    userId: "9",
    joinedAt: "2025-10-02T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg15: Holy Cross Literature Club
  {
    id: "gm35",
    groupId: "pg15",
    userId: "6",
    joinedAt: "2024-08-01T10:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm36",
    groupId: "pg15",
    userId: "12",
    joinedAt: "2024-08-02T11:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg16: Saint Joseph Study Group
  {
    id: "gm37",
    groupId: "pg16",
    userId: "6",
    joinedAt: "2024-07-01T12:00:00.000Z",
    role: "owner",
    status: "active",
  },

  // pg17: Student Careers & Internships
  {
    id: "gm38",
    groupId: "pg17",
    userId: "10",
    joinedAt: "2024-06-01T13:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm39",
    groupId: "pg17",
    userId: "11",
    joinedAt: "2024-06-02T14:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg18: Freelance & Remote Opportunities
  {
    id: "gm40",
    groupId: "pg18",
    userId: "8",
    joinedAt: "2024-05-01T15:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm41",
    groupId: "pg18",
    userId: "9",
    joinedAt: "2024-05-02T16:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg19: General Discussion
  {
    id: "gm42",
    groupId: "pg19",
    userId: "10",
    joinedAt: "2024-04-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm43",
    groupId: "pg19",
    userId: "1",
    joinedAt: "2024-04-02T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg20: Internship Circle
  {
    id: "gm44",
    groupId: "pg20",
    userId: "2",
    joinedAt: "2024-03-01T10:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm45",
    groupId: "pg20",
    userId: "3",
    joinedAt: "2024-03-02T11:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg21: CUET EEE Projects
  {
    id: "gm46",
    groupId: "pg21",
    userId: "9",
    joinedAt: "2024-02-01T12:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm47",
    groupId: "pg21",
    userId: "11",
    joinedAt: "2024-02-02T13:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg22: Career Prep - Campus
  {
    id: "gm48",
    groupId: "pg22",
    userId: "6",
    joinedAt: "2024-01-01T14:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm49",
    groupId: "pg22",
    userId: "7",
    joinedAt: "2024-01-02T15:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg23: RUET Research Group
  {
    id: "gm50",
    groupId: "pg23",
    userId: "8",
    joinedAt: "2023-12-01T16:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm51",
    groupId: "pg23",
    userId: "9",
    joinedAt: "2023-12-02T17:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg24: Student Entrepreneurship
  {
    id: "gm52",
    groupId: "pg24",
    userId: "10",
    joinedAt: "2023-11-01T18:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm53",
    groupId: "pg24",
    userId: "11",
    joinedAt: "2023-11-02T19:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg25: Community Volunteers
  {
    id: "gm54",
    groupId: "pg25",
    userId: "12",
    joinedAt: "2023-10-01T20:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm55",
    groupId: "pg25",
    userId: "13",
    joinedAt: "2023-10-02T21:00:00.000Z",
    role: "member",
    status: "active",
  },

  // pg26-pg40: BUET/KUET section groups (minimal members for demo)
  {
    id: "gm56",
    groupId: "pg26",
    userId: "1",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm57",
    groupId: "pg27",
    userId: "1",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm58",
    groupId: "pg28",
    userId: "1",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm59",
    groupId: "pg29",
    userId: "1",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm60",
    groupId: "pg30",
    userId: "1",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm61",
    groupId: "pg31",
    userId: "1",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm62",
    groupId: "pg32",
    userId: "1",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm63",
    groupId: "pg33",
    userId: "1",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm64",
    groupId: "pg34",
    userId: "11",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm65",
    groupId: "pg35",
    userId: "11",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm66",
    groupId: "pg36",
    userId: "11",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm67",
    groupId: "pg37",
    userId: "11",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm68",
    groupId: "pg38",
    userId: "11",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm69",
    groupId: "pg39",
    userId: "11",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm70",
    groupId: "pg40",
    userId: "11",
    joinedAt: "2024-09-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },

  // ========================================
  // User-created groups (g1-g10) from groupsData.ts
  // ========================================

  // g1: BUET Student Hub - members: ["1", "2", "3"]
  {
    id: "gm71",
    groupId: "g1",
    userId: "1",
    joinedAt: "2025-01-01T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm72",
    groupId: "g1",
    userId: "2",
    joinedAt: "2025-01-01T09:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm73",
    groupId: "g1",
    userId: "3",
    joinedAt: "2025-01-01T10:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g2: KUET Job & Internship Hub - members: ["15", "3", "9", "11"]
  {
    id: "gm74",
    groupId: "g2",
    userId: "15",
    joinedAt: "2025-01-02T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm75",
    groupId: "g2",
    userId: "3",
    joinedAt: "2025-01-02T09:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm76",
    groupId: "g2",
    userId: "9",
    joinedAt: "2025-01-02T10:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm77",
    groupId: "g2",
    userId: "11",
    joinedAt: "2025-01-02T11:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g3: Dhaka College Study Group - members: ["12", "13"]
  {
    id: "gm78",
    groupId: "g3",
    userId: "12",
    joinedAt: "2025-01-03T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm79",
    groupId: "g3",
    userId: "13",
    joinedAt: "2025-01-03T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g4: Student Internships & Jobs - members: ["4", "5"]
  {
    id: "gm80",
    groupId: "g4",
    userId: "4",
    joinedAt: "2025-01-04T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm81",
    groupId: "g4",
    userId: "5",
    joinedAt: "2025-01-04T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g5: BUET Robotics Club - members: ["1", "3", "8"]
  {
    id: "gm82",
    groupId: "g5",
    userId: "1",
    joinedAt: "2025-01-05T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm83",
    groupId: "g5",
    userId: "3",
    joinedAt: "2025-01-05T09:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm84",
    groupId: "g5",
    userId: "8",
    joinedAt: "2025-01-05T10:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g6: KUET Electronics Careers - members: ["11", "12"]
  {
    id: "gm85",
    groupId: "g6",
    userId: "11",
    joinedAt: "2025-01-06T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm86",
    groupId: "g6",
    userId: "12",
    joinedAt: "2025-01-06T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g7: Holy Cross Career Opportunities - members: ["6", "12"]
  {
    id: "gm87",
    groupId: "g7",
    userId: "6",
    joinedAt: "2025-01-07T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm88",
    groupId: "g7",
    userId: "12",
    joinedAt: "2025-01-07T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g8: Campus Jobs & Startups - members: ["10", "11"]
  {
    id: "gm89",
    groupId: "g8",
    userId: "10",
    joinedAt: "2025-01-08T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm90",
    groupId: "g8",
    userId: "11",
    joinedAt: "2025-01-08T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g9: Community Volunteer & Job Posts - members: ["12", "13"]
  {
    id: "gm91",
    groupId: "g9",
    userId: "12",
    joinedAt: "2025-01-09T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm92",
    groupId: "g9",
    userId: "13",
    joinedAt: "2025-01-09T09:00:00.000Z",
    role: "member",
    status: "active",
  },

  // g10: General Jobs & Career Discussion - members: ["10", "1", "14"]
  {
    id: "gm93",
    groupId: "g10",
    userId: "10",
    joinedAt: "2025-01-10T08:00:00.000Z",
    role: "owner",
    status: "active",
  },
  {
    id: "gm94",
    groupId: "g10",
    userId: "1",
    joinedAt: "2025-01-10T09:00:00.000Z",
    role: "member",
    status: "active",
  },
  {
    id: "gm95",
    groupId: "g10",
    userId: "14",
    joinedAt: "2025-01-10T10:00:00.000Z",
    role: "member",
    status: "active",
  },
];

// Helper functions

// Get all members for a specific group
export const getMembersForGroup = (groupId: string): string[] => {
  return groupMembers
    .filter((m) => m.groupId === groupId && m.status === "active")
    .map((m) => m.userId);
};

// Get all groups for a specific user
export const getGroupsForUser = (userId: string): string[] => {
  return groupMembers
    .filter((m) => m.userId === userId && m.status === "active")
    .map((m) => m.groupId);
};

// Check if a user is a member of a group
export const isMemberOfGroup = (userId: string, groupId: string): boolean => {
  return groupMembers.some(
    (m) => m.userId === userId && m.groupId === groupId && m.status === "active"
  );
};

// Get member count for a group
export const getMemberCount = (groupId: string): number => {
  return groupMembers.filter(
    (m) => m.groupId === groupId && m.status === "active"
  ).length;
};

// Get membership details for a user in a group
export const getMembershipDetails = (
  userId: string,
  groupId: string
): GroupMember | undefined => {
  return groupMembers.find(
    (m) => m.userId === userId && m.groupId === groupId && m.status === "active"
  );
};

// Get the owner of a group
export const getGroupOwner = (groupId: string): string | undefined => {
  return groupMembers.find((m) => m.groupId === groupId && m.role === "owner")
    ?.userId;
};

// Get all admins of a group (excluding owner)
export const getGroupAdmins = (groupId: string): string[] => {
  return groupMembers
    .filter(
      (m) =>
        m.groupId === groupId && m.role === "admin" && m.status === "active"
    )
    .map((m) => m.userId);
};

// Get all admins including owner
export const getAllAdmins = (groupId: string): string[] => {
  return groupMembers
    .filter(
      (m) =>
        m.groupId === groupId &&
        (m.role === "admin" || m.role === "owner") &&
        m.status === "active"
    )
    .map((m) => m.userId);
};

// Check if user is owner of a group
export const isOwner = (userId: string, groupId: string): boolean => {
  return groupMembers.some(
    (m) =>
      m.userId === userId &&
      m.groupId === groupId &&
      m.role === "owner" &&
      m.status === "active"
  );
};

// Check if user is admin of a group (not including owner)
export const isAdmin = (userId: string, groupId: string): boolean => {
  return groupMembers.some(
    (m) =>
      m.userId === userId &&
      m.groupId === groupId &&
      m.role === "admin" &&
      m.status === "active"
  );
};

// Check if user is admin or owner
export const isAdminOrOwner = (userId: string, groupId: string): boolean => {
  return groupMembers.some(
    (m) =>
      m.userId === userId &&
      m.groupId === groupId &&
      (m.role === "admin" || m.role === "owner") &&
      m.status === "active"
  );
};

// Get pending members for a group (for approval in private groups)
export const getPendingMembers = (groupId: string): string[] => {
  return groupMembers
    .filter((m) => m.groupId === groupId && m.status === "pending")
    .map((m) => m.userId);
};

// Get blocked members for a group
export const getBlockedMembers = (groupId: string): string[] => {
  return groupMembers
    .filter((m) => m.groupId === groupId && m.status === "blocked")
    .map((m) => m.userId);
};

// Add a member to a group
export const addMemberToGroup = (
  userId: string,
  groupId: string,
  role: "member" | "admin" | "owner" = "member",
  status: "active" | "pending" | "blocked" = "active"
): void => {
  const newMember: GroupMember = {
    id: `gm${groupMembers.length + 1}`,
    groupId,
    userId,
    joinedAt: new Date().toISOString(),
    role,
    status,
  };
  groupMembers.push(newMember);
};

// Remove a member from a group
export const removeMemberFromGroup = (
  userId: string,
  groupId: string
): void => {
  const index = groupMembers.findIndex(
    (m) => m.userId === userId && m.groupId === groupId
  );
  if (index !== -1) {
    groupMembers.splice(index, 1);
  }
};

// Update member role
export const updateMemberRole = (
  userId: string,
  groupId: string,
  role: "member" | "admin" | "owner"
): void => {
  const member = groupMembers.find(
    (m) => m.userId === userId && m.groupId === groupId
  );
  if (member) {
    member.role = role;
  }
};

// Update member status
export const updateMemberStatus = (
  userId: string,
  groupId: string,
  status: "active" | "pending" | "blocked"
): void => {
  const member = groupMembers.find(
    (m) => m.userId === userId && m.groupId === groupId
  );
  if (member) {
    member.status = status;
  }
};

export default groupMembers;
