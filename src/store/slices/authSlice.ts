import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthState } from "../../types/user.types";

/**
 * ====================================
 * AUTH SLICE - Redux State Management
 * ====================================
 *
 * এই slice এ authentication related সব state manage করা হয়।
 *
 * State:
 * - user: Current logged in user এর data (null if not logged in)
 * - isAuthenticated: User logged in কিনা
 * - isInitializing: App load এ auth check হচ্ছে কিনা
 *
 * Actions:
 * - setUser: Login/Register success এ user set করে এবং isAuthenticated = true
 * - clearUser: Logout এ সব clear করে
 * - updateUser: User data partially update (profile edit এ use)
 * - setInitializing: App load এ initial auth check state
 */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  // ⚠️ App load এ true থেকে শুরু
  // /current-user check শেষ না হওয়া পর্যন্ত loading দেখাবে
  isCheckingAuth: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Login/Register success এ call হয়
     * User data Redux এ save করে
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
    },

    /**
     * Logout বা token expire এ call হয়
     * সব state clear করে initial state এ ফিরিয়ে আনে
     */
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
    },

    /**
     * Profile update করার পর partial update
     * শুধু changed fields update করে
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, updateUser } = authSlice.actions;

export default authSlice.reducer;
