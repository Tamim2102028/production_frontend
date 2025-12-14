import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RoomPost } from "../../../data/rooms-data/roomPostData";
import { roomPosts as seededPosts } from "../../../data/rooms-data/roomPostData";

interface RoomPostsState {
  posts: RoomPost[];
}

const initialState: RoomPostsState = {
  posts: seededPosts.map((p) => ({ ...p })),
};

const roomPostsSlice = createSlice({
  name: "roomPosts",
  initialState,
  reducers: {
    addReply: (
      state,
      action: PayloadAction<{
        postId: string;
        reply: {
          id: string;
          authorId?: string;
          content: string;
          createdAt: string;
        };
      }>
    ) => {
      const { postId, reply } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        if (!post.replies) post.replies = [];
        // add new replies at the start so newest replies show first
        post.replies.unshift(reply);
      }
    },

    // Optionally expose an action to add posts
    addPost: (state, action: PayloadAction<RoomPost>) => {
      state.posts.unshift(action.payload);
    },
    editPost: (
      state,
      action: PayloadAction<{ postId: string; content: string }>
    ) => {
      const { postId, content } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) post.content = content;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
    editReply: (
      state,
      action: PayloadAction<{
        postId: string;
        replyId: string;
        content: string;
      }>
    ) => {
      const { postId, replyId, content } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post && post.replies) {
        const reply = post.replies.find((r) => r.id === replyId);
        if (reply) reply.content = content;
      }
    },
    deleteReply: (
      state,
      action: PayloadAction<{ postId: string; replyId: string }>
    ) => {
      const { postId, replyId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post && post.replies) {
        post.replies = post.replies.filter((r) => r.id !== replyId);
      }
    },
    togglePinPost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) post.pinned = !post.pinned;
    },
  },
});

export const {
  addReply,
  addPost,
  editPost,
  deletePost,
  editReply,
  deleteReply,
  togglePinPost,
} = roomPostsSlice.actions;
export default roomPostsSlice.reducer;

// selectors
export const selectRoomPosts = (state: { roomPosts: RoomPostsState }) =>
  state.roomPosts.posts;

export const selectPostsForRoom =
  (roomId: string) => (state: { roomPosts: RoomPostsState }) =>
    state.roomPosts.posts.filter((p) => p.roomId === roomId);
