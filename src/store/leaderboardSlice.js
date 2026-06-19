import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetLeaderboard } from '../api';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGetLeaderboard();
      return data.data.leaderboards;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default leaderboardSlice.reducer;
