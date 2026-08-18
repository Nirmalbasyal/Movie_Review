import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../http/api";
import type { Movie } from "../types";

type WatchlistState = {
  items: Movie[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
};

const initialState: WatchlistState = {
  items: [],
  status: "idle",
  error: null,
};

const handleErr = (err: any, fallback: string) => err.response?.data?.message || fallback;

// fetch the logged-in user's watchlist
export const fetchWatchlist = createAsyncThunk("watchlist/fetchWatchlist", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/watchlist");
    return res.data.data.map((entry: any) => entry.movie) as Movie[];
  } catch (err) {
    return rejectWithValue(handleErr(err, "Failed to load watchlist"));
  }
});

// add a movie to the watchlist
export const addToWatchlistAsync = createAsyncThunk(
  "watchlist/addToWatchlistAsync",
  async (movieId: string, { rejectWithValue }) => {
    try {
      const res = await API.post(`/watchlist/${movieId}`);
      return (res.data.data.movie ?? res.data.data) as Movie;
    } catch (err) {
      return rejectWithValue(handleErr(err, "Failed to add to watchlist"));
    }
  },
);

// remove a movie from the watchlist
export const removeFromWatchlistAsync = createAsyncThunk(
  "watchlist/removeFromWatchlistAsync",
  async (movieId: string, { rejectWithValue }) => {
    try {
      await API.delete(`/watchlist/${movieId}`);
      return movieId;
    } catch (err) {
      return rejectWithValue(handleErr(err, "Failed to remove from watchlist"));
    }
  },
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    // clears watchlist on logout
    resetWatchlist(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchWatchlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // add
      .addCase(addToWatchlistAsync.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(addToWatchlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // remove
      .addCase(removeFromWatchlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m._id !== action.payload);
      })
      .addCase(removeFromWatchlistAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
