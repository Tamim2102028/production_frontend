import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// Types
export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  totalVotes: number;
  isEnded?: boolean;
  endedAt?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  url?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  postedBy: string;
  postedById?: string;
  hasFile?: boolean;
  fileName?: string; // deprecated - keeping for backward compatibility
  fileUrl?: string; // deprecated - keeping for backward compatibility
  files?: AttachedFile[]; // new: multiple files support
  readBy?: string[];
}

export interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  postedBy: string;
  postedById?: string;
  hasFile?: boolean;
  fileName?: string;
  fileUrl?: string;
  readBy?: string[];
}

// State
interface CRCornerState {
  polls: Poll[];
  announcements: Announcement[];
  posts: Post[];
}

const initialState: CRCornerState = {
  polls: [
    {
      id: 1,
      question: "Do you support the new midterm exam schedule?",
      options: [
        { id: 1, text: "Yes, it works for me", votes: 45 },
        { id: 2, text: "No, needs adjustment", votes: 23 },
        { id: 3, text: "Neutral/Don't care", votes: 12 },
      ],
      totalVotes: 80,
    },
    {
      id: 2,
      question: "Should we organize a class trip this semester?",
      options: [
        { id: 1, text: "Yes, definitely!", votes: 67 },
        { id: 2, text: "Maybe next semester", votes: 28 },
        { id: 3, text: "Not interested", votes: 15 },
      ],
      totalVotes: 110,
      isEnded: true,
      endedAt: "Nov 5, 2025 at 3:45 PM",
    },
    {
      id: 3,
      question: "Which topic should we focus on for the study group?",
      options: [
        { id: 1, text: "Data Structures", votes: 42 },
        { id: 2, text: "Algorithms", votes: 38 },
        { id: 3, text: "Database Systems", votes: 25 },
        { id: 4, text: "Operating Systems", votes: 20 },
      ],
      totalVotes: 125,
      isEnded: true,
      endedAt: "Nov 3, 2025 at 10:30 AM",
    },
  ],
  announcements: [
    {
      id: 1,
      title: "Class Representative Meeting",
      content:
        "All CRs are requested to attend the monthly meeting in Room 301.",
      date: "Oct 5, 2025",
      postedBy: "Tamim Ahmed",
      postedById: "tamim-id",
      readBy: [],
    },
    {
      id: 2,
      title: "Circuit Analysis Notes - Shared by Sir",
      content:
        "Our professor has shared the complete lecture notes for Circuit Analysis. Download and study before the midterm exam.",
      date: "Oct 3, 2025",
      postedBy: "Sadia Rahman",
      postedById: "sadia-id",
      readBy: [],
      hasFile: true,
      files: [
        {
          id: "file-1",
          name: "Circuit_Analysis_Notes.pdf",
        },
        {
          id: "file-2",
          name: "Circuit_Analysis_Slides.pptx",
        },
        {
          id: "file-3",
          name: "Practice_Problems.pdf",
        },
      ],
    },
    {
      id: 3,
      title: "Assignment Deadline Extended",
      content:
        "Good news! The CSE 305 assignment deadline has been extended to Oct 15. Make sure to submit on time.",
      date: "Oct 2, 2025",
      postedBy: "Tamim Ahmed",
      postedById: "tamim-id",
      readBy: [],
    },
  ],
  posts: [],
};

// Slice
const crCornerSlice = createSlice({
  name: "crCorner",
  initialState,
  reducers: {
    // Poll Actions
    createPoll: (state, action: PayloadAction<Poll>) => {
      state.polls.unshift(action.payload);
    },

    updatePoll: (
      state,
      action: PayloadAction<{
        id: number;
        question: string;
        options: PollOption[];
      }>
    ) => {
      const { id, question, options } = action.payload;
      const poll = state.polls.find((p) => p.id === id);
      if (poll) {
        poll.question = question;
        poll.options = options;
      }
    },

    deletePoll: (state, action: PayloadAction<number>) => {
      state.polls = state.polls.filter((p) => p.id !== action.payload);
    },

    endPoll: (
      state,
      action: PayloadAction<{ id: number; endedAt: string }>
    ) => {
      const poll = state.polls.find((p) => p.id === action.payload.id);
      if (poll) {
        poll.isEnded = true;
        poll.endedAt = action.payload.endedAt;
      }
    },

    reopenPoll: (state, action: PayloadAction<number>) => {
      const poll = state.polls.find((p) => p.id === action.payload);
      if (poll) {
        poll.isEnded = false;
        poll.endedAt = undefined;
      }
    },

    votePoll: (
      state,
      action: PayloadAction<{ pollId: number; optionId: number }>
    ) => {
      const poll = state.polls.find((p) => p.id === action.payload.pollId);
      if (poll && !poll.isEnded) {
        const option = poll.options.find(
          (o) => o.id === action.payload.optionId
        );
        if (option) {
          option.votes += 1;
          poll.totalVotes += 1;
        }
      }
    },

    cancelVote: (
      state,
      action: PayloadAction<{ pollId: number; optionId: number }>
    ) => {
      const poll = state.polls.find((p) => p.id === action.payload.pollId);
      if (poll && !poll.isEnded) {
        const option = poll.options.find(
          (o) => o.id === action.payload.optionId
        );
        if (option && option.votes > 0) {
          option.votes -= 1;
          poll.totalVotes -= 1;
        }
      }
    },

    // Announcement Actions
    createAnnouncement: (state, action: PayloadAction<Announcement>) => {
      state.announcements.unshift(action.payload);
    },

    updateAnnouncement: (
      state,
      action: PayloadAction<Partial<Announcement> & { id: number }>
    ) => {
      const { id, ...updates } = action.payload;
      const announcement = state.announcements.find((a) => a.id === id);
      if (announcement) {
        Object.assign(announcement, updates);
      }
    },

    deleteAnnouncement: (state, action: PayloadAction<number>) => {
      state.announcements = state.announcements.filter(
        (a) => a.id !== action.payload
      );
    },

    toggleAnnouncementRead: (
      state,
      action: PayloadAction<{ id: number; userId: string }>
    ) => {
      const announcement = state.announcements.find(
        (a) => a.id === action.payload.id
      );
      if (announcement) {
        if (!announcement.readBy) {
          announcement.readBy = [];
        }
        const index = announcement.readBy.indexOf(action.payload.userId);
        if (index > -1) {
          announcement.readBy.splice(index, 1);
        } else {
          announcement.readBy.push(action.payload.userId);
        }
      }
    },

    // Post Actions
    createPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },

    deletePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },

    togglePostRead: (
      state,
      action: PayloadAction<{ id: number; userId: string }>
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (post) {
        if (!post.readBy) {
          post.readBy = [];
        }
        const index = post.readBy.indexOf(action.payload.userId);
        if (index > -1) {
          post.readBy.splice(index, 1);
        } else {
          post.readBy.push(action.payload.userId);
        }
      }
    },
  },
});

// Actions
export const {
  createPoll,
  updatePoll,
  deletePoll,
  endPoll,
  reopenPoll,
  votePoll,
  cancelVote,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementRead,
  createPost,
  deletePost,
  togglePostRead,
} = crCornerSlice.actions;

// Selectors
export const selectAllPolls = (state: RootState) => state.crCorner.polls;

export const selectActivePolls = (state: RootState) =>
  state.crCorner.polls.filter((poll) => !poll.isEnded);

export const selectEndedPolls = (state: RootState) =>
  state.crCorner.polls.filter((poll) => poll.isEnded);

export const selectAllAnnouncements = (state: RootState) =>
  state.crCorner.announcements;

export const selectAllPosts = (state: RootState) => state.crCorner.posts;

export const selectPollById = (state: RootState, pollId: number) =>
  state.crCorner.polls.find((poll) => poll.id === pollId);

export const selectAnnouncementById = (
  state: RootState,
  announcementId: number
) => state.crCorner.announcements.find((a) => a.id === announcementId);

export const selectPostById = (state: RootState, postId: number) =>
  state.crCorner.posts.find((p) => p.id === postId);

// Reducer
export default crCornerSlice.reducer;
