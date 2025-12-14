import { createSlice } from "@reduxjs/toolkit";
import type { User, AuthState } from "../../types/user.types";

/**
 * ====================================
 * AUTH SLICE - Redux State Management
 * ====================================
 *
 * এই slice এ authentication related সব state manage করা হয়।
 *
 * State:
 * - user: Current logged in user এর data
 * - isAuthenticated: User logged in কিনা
 * - isLoading: API call চলছে কিনা
 * - isCheckingAuth: App load এ auth check হচ্ছে কিনা
 *
 * Actions:
 * - setUser: Login/Register success এ user set করে
 * - clearUser: Logout এ সব clear করে
 * - setLoading: Loading state toggle
 * - setCheckingAuth: Initial auth check state
 * - updateUser: User data partially update
 */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // ⚠️ IMPORTANT: এটা true থেকে শুরু হয়
  // কারণ app load এ আমরা /current-user check করি
  // Check শেষ না হওয়া পর্যন্ত loading দেখাই
  isCheckingAuth: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isCheckingAuth = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isCheckingAuth = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, setLoading, setCheckingAuth, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
