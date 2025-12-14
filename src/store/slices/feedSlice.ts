import { createSlice } from "@reduxjs/toolkit";

interface FeedState {
  filterType: "latest" | "popular" | "media";
  searchTerm: string;
}

const initialState: FeedState = {
  filterType: "latest",
  searchTerm: "",
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setFilterType, setSearchTerm } = feedSlice.actions;
export default feedSlice.reducer;
