import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCurrentUserId, getUserById } from "../../services/userService";
import type { RootState } from "../store";

interface ProfileState {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  bio?: string;
  userType: ("student" | "teacher" | "system")[];
  educationLevel: "UNIVERSITY" | "COLLEGE";
  university?: {
    name: string;
    department?: string;
    section?: string;
    subsection?: string;
    roll?: string;
  };
  college?: {
    name: string;
    department?: string;
    section?: string;
    subsection?: string;
    roll?: string;
    sscBatch?: string;
    level?: "1st year" | "2nd year" | "admission";
  };
  gender?: "male" | "female";
  saved?: string[];
  // groups the user has joined (ids)
  joinedGroup?: string[];
  // groups the user pre-joined (ids) - used for showing institution-specific groups
  preJoinedGroup?: string[];
  // groups the user has sent join requests to (ids)
  sentRequestGroup?: string[];
}

// Load current user data as initial state
const getCurrentUserData = (): ProfileState => {
  const currentUserId = getCurrentUserId();
  const userData = getUserById(currentUserId);

  if (userData) {
    // Map the fixture `UserData` shape into the profile slice shape expected by UI
    return {
      id: userData.id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      avatar: userData.avatar,
      bio: userData.bio,
      userType: userData.userType,
      educationLevel: userData.educationLevel,
      university: userData.university
        ? {
            name: String(userData.university.name || ""),
            department: String(userData.university.department || ""),
            section: userData.university.section,
            subsection: userData.university.subsection,
            roll: undefined,
          }
        : undefined,
      college: userData.college
        ? {
            name: String(userData.college.name || ""),
            department: String(userData.college.department || ""),
            section: undefined,
            subsection: undefined,
            roll: undefined,
            sscBatch: "",
          }
        : undefined,
      gender: userData.gender,
      saved: userData.saved || [],
      joinedGroup: userData.joinedGroup || [],
      preJoinedGroup: userData.preJoinedGroup || [],
      sentRequestGroup: userData.sentRequestGroup || [],
    };
  } else {
    return {
      id: "",
      name: "",
      username: "",
      email: "",
      phone: "",
      avatar: "",
      bio: "",
      userType: ["student"],
      educationLevel: "UNIVERSITY" as const,
      university: {
        name: "",
        department: "",
      },
      college: undefined,
      gender: undefined,
      saved: [],
      joinedGroup: [],
      preJoinedGroup: [],
      sentRequestGroup: [],
    };
  }
};

const initialState: ProfileState = getCurrentUserData();

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchAllUserData() {
      // This will be used to fetch all user data
    },

    updateProfile(state, action: PayloadAction<Partial<ProfileState>>) {
      return { ...state, ...action.payload };
    },
    loadProfile(_, action: PayloadAction<ProfileState>) {
      return action.payload;
    },
    reloadProfile() {
      return getCurrentUserData();
    },
    clearProfile() {
      // will use while user logout to clear profile data
      return {
        id: "",
        name: "",
        username: "",
        email: "",
        phone: "",
        avatar: "",
        bio: "",
        userType: ["student"],
        educationLevel: "UNIVERSITY" as const,
        university: {
          name: "",
          department: "",
        },
        college: undefined,
        gender: undefined,
        saved: [],
        joinedGroup: [],
        preJoinedGroup: [],
        sentRequestGroup: [],
      };
    },
  },
});

export const { updateProfile, loadProfile, reloadProfile, clearProfile } =
  profileSlice.actions;
export default profileSlice.reducer;

/**
 * Selector helper to resolve any user by id. This wraps the in-repo helper so
 * components can call `useAppSelector((s) => selectUserById(s, id))` and keep
 * data access consistent across the app. It intentionally uses the module
 * fixture `getUserById` for now (preview-only behavior).
 */
export const selectUserById = (_state: RootState, id: string) =>
  getUserById(id);
