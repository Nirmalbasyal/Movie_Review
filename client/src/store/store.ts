import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "./watchlistSlice.ts";

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
