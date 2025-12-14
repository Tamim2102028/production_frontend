import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MessagesState {
  selectedConversation: string;
  messageText: string;
  searchQuery: string;
}

const initialState: MessagesState = {
  selectedConversation: "1",
  messageText: "",
  searchQuery: "",
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setSelectedConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversation = action.payload;
    },
    setMessageText: (state, action: PayloadAction<string>) => {
      state.messageText = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearMessageText: (state) => {
      state.messageText = "";
    },
    resetMessagesState: () => initialState,
  },
});

export const {
  setSelectedConversation,
  setMessageText,
  setSearchQuery,
  clearMessageText,
  resetMessagesState,
} = messagesSlice.actions;

export default messagesSlice.reducer;
