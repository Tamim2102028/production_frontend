import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { usersData, type UserData } from "../../../data/profile-data/userData";

// Types

export interface SearchHashtag {
  id: string;
  tag: string;
  posts: string;
}

export interface SearchGroup {
  id: string;
  name: string;
  description: string;
  profileImage: string;
  memberCount: number;
  privacy: "public" | "private";
  groupFor?: "students" | "teachers" | "all";
}

interface SearchState {
  query: string;
  activeFilter: "all" | "people" | "posts" | "hashtags" | "groups";
  people: UserData[];
  hashtags: SearchHashtag[];
  recentSearches: string[];
}

const initialState: SearchState = {
  query: "",
  activeFilter: "all",
  people: usersData,
  hashtags: [
    { id: "1", tag: "#photography", posts: "12.3K posts" },
    { id: "2", tag: "#travel", posts: "8.7K posts" },
    { id: "3", tag: "#coding", posts: "5.2K posts" },
    { id: "4", tag: "#food", posts: "4.1K posts" },
  ],
  recentSearches: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      if (
        action.payload.trim() &&
        !state.recentSearches.includes(action.payload)
      ) {
        state.recentSearches.unshift(action.payload);
        if (state.recentSearches.length > 10) {
          state.recentSearches = state.recentSearches.slice(0, 10);
        }
      }
    },

    setActiveFilter: (
      state,
      action: PayloadAction<"all" | "people" | "posts" | "hashtags" | "groups">
    ) => {
      state.activeFilter = action.payload;
    },

    clearSearchQuery: (state) => {
      state.query = "";
    },

    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },

    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        (search) => search !== action.payload
      );
    },
  },
});

export const {
  setSearchQuery,
  setActiveFilter,
  clearSearchQuery,
  clearRecentSearches,
  removeRecentSearch,
} = searchSlice.actions;

// Selectors
export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectActiveFilter = (state: RootState) =>
  state.search.activeFilter;
export const selectRecentSearches = (state: RootState) =>
  state.search.recentSearches;

export const selectFilteredPeople = (state: RootState) => {
  const { query, people } = state.search;
  // Show nothing if search query is empty
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return people.filter(
    (person) =>
      person.name.toLowerCase().includes(lowerQuery) ||
      person.username.toLowerCase().includes(lowerQuery)
  );
};

export const selectFilteredPosts = (state: RootState) => {
  const { query } = state.search;
  const posts = state.posts.posts; // Get posts from postsSlice
  // Show nothing if search query is empty
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return posts.filter((post) => {
    // Search in post content
    return post.content.toLowerCase().includes(lowerQuery);
  });
};

export const selectFilteredHashtags = (state: RootState) => {
  const { query } = state.search;
  const posts = state.posts.posts;

  // Show nothing if search query is empty
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();

  // Filter posts that have tags matching the search query
  return posts.filter((post) => {
    if (!post.tags || post.tags.length === 0) return false;

    return post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
  });
};

export const selectFilteredGroups = (state: RootState) => {
  const { query } = state.search;
  const groups = state.groups.groups; // Get groups from groupSlice
  // Show nothing if search query is empty
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return groups.filter(
    (group) =>
      group.name.toLowerCase().includes(lowerQuery) ||
      (group.description?.toLowerCase().includes(lowerQuery) ?? false)
  );
};

export default searchSlice.reducer;
