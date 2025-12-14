import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark" | "system";
  language: string;
  sidebarCollapsed: boolean;
  loading: {
    global: boolean;
    posts: boolean;
    profile: boolean;
    notifications: boolean;
  };
  modals: {
    createPost: boolean;
    editProfile: boolean;
    confirmDialog: boolean;
  };
  toast: {
    show: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null;
  // Component-specific UI states
  notifications: {
    filter: "all" | "unread";
  };
  friends: {
    activeTab: "friends" | "requests" | "suggestions";
    searchQuery: string;
  };

  settings: {
    notifications: {
      likes: boolean;
      comments: boolean;
      follows: boolean;
      push: boolean;
      email: boolean;
      sms: boolean;
      inApp: boolean;
    };
    privacy: {
      profileVisibility: "public" | "friends" | "private";
      showEmail: boolean;
      showPhone: boolean;
      allowMessagesFromStranger: boolean;
      showOnlineStatus: boolean;
      allowTagging: boolean;
    };
    appTheme: "light" | "dark";
    appLanguage: string;
  };
  createPost: {
    content: string;
    isExpanded: boolean;
  };
  profile: {
    activeTab: string;
  };
  menus: {
    postMenus: { [postId: string]: boolean };
  };
}

const initialState: UIState = {
  theme: "light",
  language: "en",
  sidebarCollapsed: false,
  loading: {
    global: false,
    posts: false,
    profile: false,
    notifications: false,
  },
  modals: {
    createPost: false,
    editProfile: false,
    confirmDialog: false,
  },
  toast: null,
  // Component-specific UI states
  notifications: {
    filter: "all",
  },
  friends: {
    activeTab: "friends",
    searchQuery: "",
  },

  settings: {
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      push: true,
      email: true,
      sms: false,
      inApp: true,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      allowMessagesFromStranger: true,
      showOnlineStatus: true,
      allowTagging: true,
    },
    appTheme: "light",
    appLanguage: "en",
  },
  createPost: {
    content: "",
    isExpanded: false,
  },
  profile: {
    activeTab: "posts",
  },
  menus: {
    postMenus: {},
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Theme management
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },

    // Language management
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },

    // Sidebar management
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    // Loading states
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setPostsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.posts = action.payload;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.profile = action.payload;
    },
    setNotificationsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.notifications = action.payload;
    },

    // Modal management
    openCreatePostModal: (state) => {
      state.modals.createPost = true;
    },
    closeCreatePostModal: (state) => {
      state.modals.createPost = false;
    },
    openEditProfileModal: (state) => {
      state.modals.editProfile = true;
    },
    closeEditProfileModal: (state) => {
      state.modals.editProfile = false;
    },
    openConfirmDialog: (state) => {
      state.modals.confirmDialog = true;
    },
    closeConfirmDialog: (state) => {
      state.modals.confirmDialog = false;
    },
    closeAllModals: (state) => {
      state.modals.createPost = false;
      state.modals.editProfile = false;
      state.modals.confirmDialog = false;
    },

    // Toast notifications
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "warning" | "info";
      }>
    ) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },

    // Notifications component
    setNotificationFilter: (state, action: PayloadAction<"all" | "unread">) => {
      state.notifications.filter = action.payload;
    },

    // Friends component
    setFriendsActiveTab: (
      state,
      action: PayloadAction<"friends" | "requests" | "suggestions">
    ) => {
      state.friends.activeTab = action.payload;
    },
    setFriendsSearchQuery: (state, action: PayloadAction<string>) => {
      state.friends.searchQuery = action.payload;
    },

    // Videos component: removed video filter (replaced with header search box)

    // Settings component
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<UIState["settings"]["notifications"]>>
    ) => {
      state.settings.notifications = {
        ...state.settings.notifications,
        ...action.payload,
      };
    },
    updatePrivacySettings: (
      state,
      action: PayloadAction<Partial<UIState["settings"]["privacy"]>>
    ) => {
      state.settings.privacy = { ...state.settings.privacy, ...action.payload };
    },
    setAppTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.settings.appTheme = action.payload;
    },
    setAppLanguage: (state, action: PayloadAction<string>) => {
      state.settings.appLanguage = action.payload;
    },

    // CreatePost component
    setPostContent: (state, action: PayloadAction<string>) => {
      state.createPost.content = action.payload;
    },
    setPostExpanded: (state, action: PayloadAction<boolean>) => {
      state.createPost.isExpanded = action.payload;
    },
    clearPostContent: (state) => {
      state.createPost.content = "";
      state.createPost.isExpanded = false;
    },

    // Profile component
    setProfileActiveTab: (state, action: PayloadAction<string>) => {
      state.profile.activeTab = action.payload;
    },

    // PostCard component
    togglePostMenu: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.menus.postMenus[postId] = !state.menus.postMenus[postId];
    },
    closePostMenu: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.menus.postMenus[postId] = false;
    },
    closeAllPostMenus: (state) => {
      state.menus.postMenus = {};
    },
  },
});

export const {
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarCollapsed,
  setGlobalLoading,
  setPostsLoading,
  setProfileLoading,
  setNotificationsLoading,
  openCreatePostModal,
  closeCreatePostModal,
  openEditProfileModal,
  closeEditProfileModal,
  openConfirmDialog,
  closeConfirmDialog,
  closeAllModals,
  showToast,
  hideToast,
  // Component-specific actions
  setNotificationFilter,
  setFriendsActiveTab,
  setFriendsSearchQuery,
  updateNotificationSettings,
  updatePrivacySettings,
  setAppTheme,
  setAppLanguage,
  setPostContent,
  setPostExpanded,
  clearPostContent,
  setProfileActiveTab,
  togglePostMenu,
  closePostMenu,
  closeAllPostMenus,
} = uiSlice.actions;

export default uiSlice.reducer;
