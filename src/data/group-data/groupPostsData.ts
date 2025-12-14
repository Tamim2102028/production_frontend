export interface GroupPost {
  postId: string;
  createdBy: string;
  groupId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likedBy: string[];
  sharesBy: string[];
  images?: string[];
  status?: "active" | "deleted";
  tags?: string[];
  isPinned?: boolean;
  isAnnouncement?: boolean;
}

export const groupPostsData: GroupPost[] = [
  {
    postId: "g1-p1",
    createdBy: "1",
    groupId: "g1",
    content: "Welcome to Group 1 — this is the first seeded post for preview.",
    createdAt: "2025-10-15T12:00:00.000Z",
    updatedAt: "2025-10-15T12:00:00.000Z",
    likedBy: ["2", "3"],
    sharesBy: ["4"],
    images: ["https://picsum.photos/seed/g1/1200/400"],
    status: "active",
    tags: ["welcome", "rules"],
    isPinned: true,
    isAnnouncement: false,
  },
  {
    postId: "g1-p2",
    createdBy: "2",
    groupId: "g1",
    content:
      "Reminder: Please follow the group rules and keep discussions respectful.",
    createdAt: "2025-10-15T12:00:00.000Z",
    updatedAt: "2025-10-15T12:00:00.000Z",
    likedBy: ["1"],
    sharesBy: [],
    images: [],
    status: "active",
    tags: ["rules"],
    isPinned: false,
    isAnnouncement: false,
  },
  {
    postId: "g1-p3",
    createdBy: "3",
    groupId: "g1",
    content:
      "Share your introductions here — name, department, and what you're studying.",
    createdAt: "2025-10-15T12:00:00.000Z",
    updatedAt: "2025-10-15T12:00:00.000Z",
    likedBy: ["1", "2"],
    sharesBy: [],
    images: ["https://picsum.photos/seed/g1/1200/400"],
    status: "active",
    tags: ["intro", "welcome"],
    isPinned: false,
    isAnnouncement: false,
  },
  {
    postId: "g2-p1",
    createdBy: "2",
    groupId: "g2",
    content: "Welcome to Group 2 — seeded post one for preview purposes.",
    createdAt: "2025-10-15T12:00:00.000Z",
    updatedAt: "2025-10-15T12:00:00.000Z",
    likedBy: ["3"],
    sharesBy: ["1"],
    images: ["https://picsum.photos/seed/g2/1200/400"],
    status: "active",
    tags: ["announcement"],
    isPinned: true,
    isAnnouncement: true,
  },
  {
    postId: "g2-p2",
    createdBy: "3",
    groupId: "g2",
    content: "Event: Study session this Friday at 6pm. All welcome!",
    createdAt: "2025-10-15T12:00:00.000Z",
    updatedAt: "2025-10-15T12:00:00.000Z",
    likedBy: ["2", "4"],
    sharesBy: [],
    images: [],
    status: "active",
    tags: ["event", "study"],
    isPinned: false,
    isAnnouncement: false,
  },
  {
    postId: "g2-p3",
    createdBy: "4",
    groupId: "g2",
    content:
      "Looking for volunteers to help moderate discussions — DM if interested.",
    createdAt: "2025-10-15T12:00:00.000Z",
    updatedAt: "2025-10-15T12:00:00.000Z",
    likedBy: ["3"],
    sharesBy: [],
    images: [],
    status: "active",
    tags: ["volunteer", "moderation"],
    isPinned: false,
    isAnnouncement: false,
  },
];

export const getGroupPostsByGroupId = (groupId: string): GroupPost[] => {
  return groupPostsData.filter((post) => post.groupId === groupId);
};

export const getGroupPostsByUserId = (userId: string): GroupPost[] => {
  return groupPostsData.filter((post) => post.createdBy === userId);
};

export const getPinnedGroupPosts = (groupId: string): GroupPost[] => {
  return groupPostsData.filter(
    (post) => post.groupId === groupId && post.isPinned
  );
};

export const getAnnouncementGroupPosts = (groupId: string): GroupPost[] => {
  return groupPostsData.filter(
    (post) => post.groupId === groupId && post.isAnnouncement
  );
};

export const getActiveGroupPosts = (groupId: string): GroupPost[] => {
  return groupPostsData.filter(
    (post) => post.groupId === groupId && post.status === "active"
  );
};
