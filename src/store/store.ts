import { configureStore } from "@reduxjs/toolkit";
import chatSlice, { chatState } from "./chatSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice,
  },
});

export type RootState = {
  chat: chatState;
};
export type AppDispatch = typeof store.dispatch;
