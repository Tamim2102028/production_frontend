import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
  coverPhoto?: string;
  university?: string; // University name
  universityId?: string; // University ID for tournament matching
  followers: number;
  following: number;
  postsCount: number;
  joinedDate: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false, // Set to false initially
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateFollowersCount: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.followers = action.payload;
      }
    },
    updateFollowingCount: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.following = action.payload;
      }
    },
    updatePostsCount: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.postsCount = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  login,
  loginFailure,
  logout,
  updateProfile,
  updateFollowersCount,
  updateFollowingCount,
  updatePostsCount,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
