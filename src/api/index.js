const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const getToken = () => localStorage.getItem('token');

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth
export const apiRegister = ({ name, email, password }) =>
  fetchWithAuth('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

export const apiLogin = ({ email, password }) =>
  fetchWithAuth('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const apiGetOwnProfile = () => fetchWithAuth('/users/me');

export const apiGetAllUsers = () => fetchWithAuth('/users');

// Threads
export const apiGetAllThreads = () => fetchWithAuth('/threads');

export const apiGetThreadDetail = (threadId) =>
  fetchWithAuth(`/threads/${threadId}`);

export const apiCreateThread = ({ title, body, category }) =>
  fetchWithAuth('/threads', {
    method: 'POST',
    body: JSON.stringify({ title, body, category }),
  });

// Comments
export const apiCreateComment = ({ threadId, content }) =>
  fetchWithAuth(`/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });

// Thread Votes
export const apiUpvoteThread = (threadId) =>
  fetchWithAuth(`/threads/${threadId}/up-vote`, { method: 'POST' });

export const apiDownvoteThread = (threadId) =>
  fetchWithAuth(`/threads/${threadId}/down-vote`, { method: 'POST' });

export const apiNeutralVoteThread = (threadId) =>
  fetchWithAuth(`/threads/${threadId}/neutral-vote`, { method: 'POST' });

// Comment Votes
export const apiUpvoteComment = (threadId, commentId) =>
  fetchWithAuth(`/threads/${threadId}/comments/${commentId}/up-vote`, { method: 'POST' });

export const apiDownvoteComment = (threadId, commentId) =>
  fetchWithAuth(`/threads/${threadId}/comments/${commentId}/down-vote`, { method: 'POST' });

export const apiNeutralVoteComment = (threadId, commentId) =>
  fetchWithAuth(`/threads/${threadId}/comments/${commentId}/neutral-vote`, { method: 'POST' });

// Leaderboard
export const apiGetLeaderboard = () => fetchWithAuth('/leaderboards');
