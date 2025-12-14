import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { postData } from "../../data/profile-data/profilePostData";
import type { PostData } from "../../data/profile-data/profilePostData";

interface PostsState {
  posts: PostData[];
  loading: boolean;
  error: string | null;
  createPostLoading: boolean;
}

const initialState: PostsState = {
  posts: postData,
  loading: false,
  error: null,
  createPostLoading: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Fetch posts
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<PostData[]>) => {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create post
    createPostStart: (state) => {
      state.createPostLoading = true;
      state.error = null;
    },
    createPostSuccess: (state, action: PayloadAction<PostData>) => {
      state.posts.unshift(action.payload);
      state.createPostLoading = false;
      state.error = null;
    },
    createPostFailure: (state, action: PayloadAction<string>) => {
      state.createPostLoading = false;
      state.error = action.payload;
    },

    // Like/Unlike post
    toggleLikePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(
        (p: PostData) => p.postId === action.payload
      );
      if (post) {
        // Toggle like for current user (for demo, just toggle userId '1')
        const userId = "1";
        if (post.likedBy.includes(userId)) {
          post.likedBy = post.likedBy.filter((id) => id !== userId);
        } else {
          post.likedBy.push(userId);
        }
      }
    },

    // Bookmark/Unbookmark post
    // Bookmarks are not in PostData, so this is a placeholder
    toggleBookmarkPost: (state, action: PayloadAction<string>) => {
      // Implement if you add bookmarks to PostData
    },

    // Update comment count
    updateCommentCount: (
      state,
      action: PayloadAction<{ postId: string; count: number }>
    ) => {
      const post = state.posts.find(
        (p: PostData) => p.postId === action.payload.postId
      );
      if (post) {
        post.comments = action.payload.count;
      }
    },

    // Increment comment count
    incrementCommentCount: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(
        (p: PostData) => p.postId === action.payload
      );
      if (post) {
        post.comments += 1;
      }
    },

    // Decrement comment count
    decrementCommentCount: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(
        (p: PostData) => p.postId === action.payload
      );
      if (post) {
        post.comments = Math.max(0, post.comments - 1);
      }
    },

    // Update share count
    updateShareCount: (
      state,
      action: PayloadAction<{ postId: string; count: number }>
    ) => {
      const post = state.posts.find(
        (p: PostData) => p.postId === action.payload.postId
      );
      if (post) {
        // PostData uses sharesBy array, so update its length if needed
        // For demo, do nothing or implement logic as needed
      }
    },

    // Delete post
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(
        (p: PostData) => p.postId !== action.payload
      );
    },

    // Clear error
    clearPostsError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  toggleLikePost,
  toggleBookmarkPost,
  updateCommentCount,
  incrementCommentCount,
  decrementCommentCount,
  updateShareCount,
  deletePost,
  clearPostsError,
} = postsSlice.actions;

export default postsSlice.reducer;
