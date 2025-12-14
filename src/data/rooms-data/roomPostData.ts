export interface RoomPost {
  id: string;
  roomId: string;
  authorId: string;
  content: string;
  createdAt: string;
  pinned?: boolean;
  replies?: Array<{
    id: string;
    authorId?: string;
    content: string;
    createdAt: string;
  }>;
  attachments?: Array<{
    id: string;
    fileName: string;
    url?: string;
    mimeType?: string;
    sizeKb?: number;
  }>;
}

export const roomPosts: RoomPost[] = [
  // r1 posts
  {
    id: "pr1",
    roomId: "r1",
    authorId: "1",
    content:
      "Welcome to Math Study Group! Let's start with calculus questions.",
    createdAt: "2025-01-01T10:00:00.000Z",
    replies: [
      {
        id: "rpr1-1",
        authorId: "4",
        content: "Thanks! I have a question about limits.",
        createdAt: "2025-01-01T11:00:00.000Z",
      },
      {
        id: "rpr1-2",
        authorId: "9",
        content: "I can help with that question!",
        createdAt: "2025-01-01T11:30:00.000Z",
      },
      {
        id: "rpr1-3",
        authorId: "1",
        content: "Sure, what specifically are you struggling with?",
        createdAt: "2025-01-01T12:00:00.000Z",
      },
      {
        id: "rpr1-4",
        authorId: "4",
        content: "I'm having trouble understanding L'Hôpital's rule.",
        createdAt: "2025-01-01T12:15:00.000Z",
      },
    ],
  },
  {
    id: "pr2",
    roomId: "r1",
    authorId: "4",
    content: "Does anyone have notes for chapter 3?",
    createdAt: "2025-01-02T11:15:00.000Z",
  },
  {
    id: "pr3",
    roomId: "r1",
    authorId: "9",
    content: "I can share my summary PDF later today.",
    createdAt: "2025-01-02T15:30:00.000Z",
  },

  // r2 posts
  {
    id: "pr4",
    roomId: "r2",
    authorId: "7",
    content: "Frontend Helpers: share your favorite React tips here.",
    createdAt: "2025-02-01T09:00:00.000Z",
    replies: [
      {
        id: "rpr1-1",
        authorId: "4",
        content: "Thanks! I have a question about limits.",
        createdAt: "2025-01-01T11:00:00.000Z",
      },
      {
        id: "rpr1-2",
        authorId: "9",
        content: "I can help with that question!",
        createdAt: "2025-01-01T11:30:00.000Z",
      },
      {
        id: "rpr1-3",
        authorId: "1",
        content: "Sure, what specifically are you struggling with?",
        createdAt: "2025-01-01T12:00:00.000Z",
      },
      {
        id: "rpr1-4",
        authorId: "4",
        content: "I'm having trouble understanding L'Hôpital's rule.",
        createdAt: "2025-01-01T12:15:00.000Z",
      },
      {
        id: "rpr4-1",
        authorId: "11",
        content: "Use useMemo/useCallback sparingly and measure first.",
        createdAt: "2025-02-01T09:30:00.000Z",
      },
    ],
  },
  {
    id: "pr5",
    roomId: "r2",
    authorId: "11",
    content: "Use memoization for expensive renders.",
    createdAt: "2025-02-01T10:20:00.000Z",
  },
  {
    id: "pr6",
    roomId: "r2",
    authorId: "5",
    content: "Does anyone want to pair-program this weekend?",
    createdAt: "2025-02-02T14:45:00.000Z",
  },

  // r3 posts
  {
    id: "pr7",
    roomId: "r3",
    authorId: "3",
    content: "Private Study Room: reminder for tonight's session.",
    createdAt: "2025-03-01T18:00:00.000Z",
  },
  {
    id: "pr8",
    roomId: "r3",
    authorId: "1",
    content: "I'll bring the practice problems.",
    createdAt: "2025-03-01T18:15:00.000Z",
  },
  {
    id: "pr9",
    roomId: "r3",
    authorId: "4",
    content: "Can someone record the session?",
    createdAt: "2025-03-01T19:00:00.000Z",
  },
];

export default roomPosts;
