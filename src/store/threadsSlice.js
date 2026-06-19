import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetAllThreads, apiGetAllUsers, apiCreateThread } from '../api';

export const fetchThreadsAndUsers = createAsyncThunk(
  'threads/fetchThreadsAndUsers',
  async (_, { rejectWithValue }) => {
    try {
      const [threadsData, usersData] = await Promise.all([
        apiGetAllThreads(),
        apiGetAllUsers(),
      ]);
      return {
        threads: threadsData.data.threads,
        users: usersData.data.users,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async (threadData, { rejectWithValue }) => {
    try {
      const data = await apiCreateThread(threadData);
      return data.data.thread;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    users: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    // Optimistic vote update on thread list
    optimisticUpvoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.items.find((t) => t.id === threadId);
      if (!thread) {return;}
      const alreadyUpvoted = thread.upVotesBy.includes(userId);
      if (alreadyUpvoted) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      } else {
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
        thread.upVotesBy.push(userId);
      }
    },
    optimisticDownvoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.items.find((t) => t.id === threadId);
      if (!thread) {return;}
      const alreadyDownvoted = thread.downVotesBy.includes(userId);
      if (alreadyDownvoted) {
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      } else {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadsAndUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThreadsAndUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.threads;
        state.users = action.payload.users;
      })
      .addCase(fetchThreadsAndUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createThread.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedCategory,
  clearSelectedCategory,
  optimisticUpvoteThread,
  optimisticDownvoteThread,
} = threadsSlice.actions;

// Selectors
export const selectFilteredThreads = (state) => {
  const { items, selectedCategory } = state.threads;
  if (!selectedCategory) {return items;}
  return items.filter((t) => t.category === selectedCategory);
};

export const selectAllCategories = (state) => {
  const cats = state.threads.items.map((t) => t.category).filter(Boolean);
  return [...new Set(cats)];
};

export default threadsSlice.reducer;
