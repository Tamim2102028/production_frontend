export interface ReplyData {
  replyId: string;
  commentId: string;
  userId: string;
  content: string;
  createdAt: string;
  likedBy?: string[];
}

export const repliesData: ReplyData[] = [
  // Replies for comments on post p1
  {
    replyId: "rp1",
    commentId: "c1",
    userId: "1",
    content: "Thanks! Glad you liked it 😊",
    createdAt: "2024-06-01T10:06:00Z",
    likedBy: [],
  },
  {
    replyId: "rp2",
    commentId: "c1001",
    userId: "6",
    content: "Totally agree — great work!",
    createdAt: "2024-06-01T10:19:00Z",
    likedBy: [],
  },
  {
    replyId: "rp3",
    commentId: "c2",
    userId: "1",
    content: "Welcome aboard! 🙌",
    createdAt: "2024-06-01T10:13:00Z",
    likedBy: [],
  },

  // Replies for comments on post p4
  {
    replyId: "rp4",
    commentId: "c7",
    userId: "2",
    content: "Thanks! Highly recommend it.",
    createdAt: "2024-06-04T11:08:00Z",
    likedBy: [],
  },
  {
    replyId: "rp5",
    commentId: "c8",
    userId: "9",
    content: "I added it to my reading list too!",
    createdAt: "2024-06-04T11:21:00Z",
    likedBy: [],
  },
];

export const getRepliesByCommentId = (commentId: string) =>
  repliesData.filter((r) => r.commentId === commentId);

export const getReplyById = (replyId: string) =>
  repliesData.find((r) => r.replyId === replyId);
