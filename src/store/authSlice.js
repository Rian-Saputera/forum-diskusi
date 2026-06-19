import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiLogin, apiRegister, apiGetOwnProfile } from '../api';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiRegister(credentials);
      return data.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiLogin(credentials);
      const { token } = data.data;
      localStorage.setItem('token', token);
      return token;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchOwnProfile = createAsyncThunk(
  'auth/fetchOwnProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGetOwnProfile();
      return data.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authUser: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.authUser = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch own profile
    builder
      .addCase(fetchOwnProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOwnProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authUser = action.payload;
      })
      .addCase(fetchOwnProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
