import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type chatState = {
  id: string;
  name: string;
  timeStamp: string;
  closed: boolean;
  uid: string;
  chatHistory: {
    id: string;
    type: string;
    data: string;
    timeStamp: string;
    fulltimeStamp: string;
  }[];
}[];

const chatSlice = createSlice({
  name: "chat",
  initialState: [],
  reducers: {
    addNewChat: (
      state: chatState,
      action: PayloadAction<{ id: string; uid: string }>
    ) => {
      state.push({
        id: action.payload.id,
        name: action.payload.id,
        timeStamp: new Date()
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("-"),
        closed: false,
        uid: action.payload.uid,
        chatHistory: [],
      });
    },
    addUserChat: (
      state: chatState,
      action: PayloadAction<{ user: string; id: string }>
    ) => {
      const chatID = state.findIndex((chat) => chat.id === action.payload.id);
      state[chatID].chatHistory.push({
        id: Math.floor(Math.random() * 3216120315).toString(),
        type: "User",
        data: action.payload.user,
        timeStamp: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        fulltimeStamp: new Date().toISOString(),
      });
    },
    addBotChat: (
      state: chatState,
      action: PayloadAction<{ bot: string; id: string }>
    ) => {
      const chatID = state.findIndex((chat) => chat.id === action.payload.id);
      state[chatID].chatHistory.push({
        id: Math.floor(Math.random() * 32112020315).toString(),
        type: "Bot",
        data: action.payload.bot,
        timeStamp: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        fulltimeStamp: new Date().toISOString(),
      });
    },
    removeChat: (state: chatState, action: PayloadAction<{ id: string }>) => {
      const chatID = state.findIndex((chat) => chat.id === action.payload.id);
      state[chatID].chatHistory = [];
    },
    closeChat: (state: chatState, action: PayloadAction<{ id: string }>) => {
      const chatID = state.findIndex((chat) => chat.id === action.payload.id);
      state[chatID].closed = true;
    },
  },
});

export const { addNewChat, addUserChat, addBotChat, removeChat, closeChat } =
  chatSlice.actions;

export default chatSlice.reducer;
