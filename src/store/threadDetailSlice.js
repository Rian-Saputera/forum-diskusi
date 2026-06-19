import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  apiGetThreadDetail,
  apiCreateComment,
  apiUpvoteThread,
  apiDownvoteThread,
  apiNeutralVoteThread,
  apiUpvoteComment,
  apiDownvoteComment,
  apiNeutralVoteComment,
} from '../api';

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (threadId, { rejectWithValue }) => {
    try {
      const data = await apiGetThreadDetail(threadId);
      return data.data.detailThread;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const addComment = createAsyncThunk(
  'threadDetail/addComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const data = await apiCreateComment({ threadId, content });
      return data.data.comment;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const voteThread = createAsyncThunk(
  'threadDetail/voteThread',
  async ({ threadId, voteType }, { rejectWithValue }) => {
    try {
      let apiFn;
      if (voteType === 'up') {apiFn = apiUpvoteThread;}
      else if (voteType === 'down') {apiFn = apiDownvoteThread;}
      else {apiFn = apiNeutralVoteThread;}
      const data = await apiFn(threadId);
      return data.data.vote;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const voteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({ threadId, commentId, voteType }, { rejectWithValue }) => {
    try {
      let apiFn;
      if (voteType === 'up') {apiFn = (cId) => apiUpvoteComment(threadId, cId);}
      else if (voteType === 'down') {apiFn = (cId) => apiDownvoteComment(threadId, cId);}
      else {apiFn = (cId) => apiNeutralVoteComment(threadId, cId);}
      const data = await apiFn(commentId);
      return data.data.vote;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const applyVote = (votesObj, userId, voteType) => {
  const newVotes = {
    upVotesBy: [...votesObj.upVotesBy],
    downVotesBy: [...votesObj.downVotesBy],
  };
  if (voteType === 'up') {
    const alreadyUp = newVotes.upVotesBy.includes(userId);
    newVotes.upVotesBy = alreadyUp
      ? newVotes.upVotesBy.filter((id) => id !== userId)
      : [...newVotes.upVotesBy.filter((id) => id !== userId), userId];
    if (!alreadyUp) {
      newVotes.downVotesBy = newVotes.downVotesBy.filter((id) => id !== userId);
    }
  } else if (voteType === 'down') {
    const alreadyDown = newVotes.downVotesBy.includes(userId);
    newVotes.downVotesBy = alreadyDown
      ? newVotes.downVotesBy.filter((id) => id !== userId)
      : [...newVotes.downVotesBy.filter((id) => id !== userId), userId];
    if (!alreadyDown) {
      newVotes.upVotesBy = newVotes.upVotesBy.filter((id) => id !== userId);
    }
  } else {
    newVotes.upVotesBy = newVotes.upVotesBy.filter((id) => id !== userId);
    newVotes.downVotesBy = newVotes.downVotesBy.filter((id) => id !== userId);
  }
  return newVotes;
};

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    thread: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearThreadDetail: (state) => {
      state.thread = null;
      state.error = null;
    },
    // Optimistic thread vote
    optimisticVoteThread: (state, action) => {
      if (!state.thread) {return;}
      const { userId, voteType } = action.payload;
      const updated = applyVote(state.thread, userId, voteType);
      state.thread.upVotesBy = updated.upVotesBy;
      state.thread.downVotesBy = updated.downVotesBy;
    },
    // Optimistic comment vote
    optimisticVoteComment: (state, action) => {
      if (!state.thread) {return;}
      const { commentId, userId, voteType } = action.payload;
      const comment = state.thread.comments.find((c) => c.id === commentId);
      if (!comment) {return;}
      const updated = applyVote(comment, userId, voteType);
      comment.upVotesBy = updated.upVotesBy;
      comment.downVotesBy = updated.downVotesBy;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.thread = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.thread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.thread) {
          state.thread.comments.unshift(action.payload);
        }
      });
  },
});

export const {
  clearThreadDetail,
  optimisticVoteThread,
  optimisticVoteComment,
} = threadDetailSlice.actions;

export default threadDetailSlice.reducer;
