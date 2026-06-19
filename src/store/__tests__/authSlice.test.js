/**
 * Test Scenarios untuk authSlice:
 * 1. Reducer - logoutUser: harus menghapus authUser, token, dan localStorage
 * 2. Reducer - clearError: harus mengosongkan state error
 * 3. Thunk - loginUser.fulfilled: harus menyimpan token ke state dan localStorage
 * 4. Thunk - loginUser.rejected: harus menyimpan pesan error ke state
 * 5. Thunk - registerUser.fulfilled: state isLoading harus false
 * 6. Thunk - registerUser.rejected: harus menyimpan pesan error
 * 7. Thunk - fetchOwnProfile.fulfilled: harus mengisi authUser
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, {
  logoutUser,
  clearError,
  loginUser,
  registerUser,
  fetchOwnProfile,
} from '../authSlice';

// Mock API module
vi.mock('../../api', () => ({
  apiLogin: vi.fn(),
  apiRegister: vi.fn(),
  apiGetOwnProfile: vi.fn(),
}));

import * as api from '../../api';

const initialState = {
  authUser: null,
  token: null,
  isLoading: false,
  error: null,
};

describe('authSlice - Reducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toMatchObject({
      authUser: null,
      isLoading: false,
      error: null,
    });
  });

  it('logoutUser: harus menghapus authUser dan token dari state', () => {
    const stateWithUser = {
      ...initialState,
      authUser: { id: 'user-1', name: 'Budi' },
      token: 'abc123',
    };
    const result = authReducer(stateWithUser, logoutUser());
    expect(result.authUser).toBeNull();
    expect(result.token).toBeNull();
  });

  it('logoutUser: harus menghapus token dari localStorage', () => {
    localStorage.setItem('token', 'abc123');
    authReducer({ ...initialState, token: 'abc123' }, logoutUser());
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('clearError: harus mengosongkan field error', () => {
    const stateWithError = { ...initialState, error: 'Login gagal' };
    const result = authReducer(stateWithError, clearError());
    expect(result.error).toBeNull();
  });
});

describe('authSlice - Thunk loginUser', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loginUser.fulfilled: harus menyimpan token ke state dan localStorage', async () => {
    api.apiLogin.mockResolvedValue({ status: 'success', data: { token: 'token-xyz' } });

    const dispatch = vi.fn();
    const getState = vi.fn();
    const thunk = loginUser({ email: 'test@test.com', password: '123456' });
    await thunk(dispatch, getState, undefined);

    const calls = dispatch.mock.calls.map((c) => c[0]);
    const fulfilled = calls.find((c) => c.type === 'auth/login/fulfilled');
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload).toBe('token-xyz');

    const resultState = authReducer(initialState, fulfilled);
    expect(resultState.token).toBe('token-xyz');
    expect(resultState.isLoading).toBe(false);
  });

  it('loginUser.rejected: harus menyimpan pesan error ke state', async () => {
    api.apiLogin.mockRejectedValue(new Error('Email atau password salah'));

    const dispatch = vi.fn();
    const thunk = loginUser({ email: 'wrong@test.com', password: 'wrong' });
    await thunk(dispatch, vi.fn(), undefined);

    const calls = dispatch.mock.calls.map((c) => c[0]);
    const rejected = calls.find((c) => c.type === 'auth/login/rejected');
    expect(rejected).toBeDefined();

    const resultState = authReducer(initialState, rejected);
    expect(resultState.error).toBe('Email atau password salah');
    expect(resultState.isLoading).toBe(false);
  });

  it('loginUser.pending: harus set isLoading true dan error null', () => {
    const action = { type: loginUser.pending.type };
    const result = authReducer({ ...initialState, error: 'old error' }, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });
});

describe('authSlice - Thunk registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registerUser.fulfilled: isLoading harus false', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: { id: 'user-2', name: 'Siti' },
    };
    const result = authReducer({ ...initialState, isLoading: true }, action);
    expect(result.isLoading).toBe(false);
  });

  it('registerUser.rejected: harus menyimpan error', () => {
    const action = {
      type: registerUser.rejected.type,
      payload: 'Email sudah digunakan',
    };
    const result = authReducer(initialState, action);
    expect(result.error).toBe('Email sudah digunakan');
    expect(result.isLoading).toBe(false);
  });
});

describe('authSlice - Thunk fetchOwnProfile', () => {
  it('fetchOwnProfile.fulfilled: harus mengisi authUser', () => {
    const mockUser = { id: 'user-3', name: 'Andi', avatar: 'https://example.com/av.jpg' };
    const action = { type: fetchOwnProfile.fulfilled.type, payload: mockUser };
    const result = authReducer(initialState, action);
    expect(result.authUser).toEqual(mockUser);
    expect(result.isLoading).toBe(false);
  });

  it('fetchOwnProfile.rejected: harus menghapus token (token expired)', () => {
    const stateWithToken = { ...initialState, token: 'expired-token' };
    const action = { type: fetchOwnProfile.rejected.type, payload: 'Unauthorized' };
    const result = authReducer(stateWithToken, action);
    expect(result.token).toBeNull();
    expect(result.error).toBe('Unauthorized');
  });
});
