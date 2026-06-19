/**
 * Test Scenarios untuk threadsSlice:
 * 1. Reducer - setSelectedCategory: harus mengubah selectedCategory
 * 2. Reducer - clearSelectedCategory: harus mengosongkan selectedCategory
 * 3. Reducer - optimisticUpvoteThread: harus menambah userId ke upVotesBy
 * 4. Reducer - optimisticUpvoteThread: jika sudah upvote, harus menghapus (toggle off)
 * 5. Reducer - optimisticDownvoteThread: harus menambah userId ke downVotesBy
 * 6. Reducer - optimisticDownvoteThread: jika sudah downvote, harus toggle off
 * 7. Reducer - optimisticUpvoteThread: jika sebelumnya downvote, harus pindah ke upvote
 * 8. Thunk - fetchThreadsAndUsers.fulfilled: harus mengisi items dan users
 * 9. Thunk - fetchThreadsAndUsers.rejected: harus menyimpan error
 * 10. Thunk - createThread.fulfilled: harus menambah thread baru ke items
 * 11. Selector - selectFilteredThreads: tanpa filter, return semua threads
 * 12. Selector - selectFilteredThreads: dengan filter, return thread yang sesuai
 * 13. Selector - selectAllCategories: harus return daftar kategori unik
 */

import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setSelectedCategory,
  clearSelectedCategory,
  optimisticUpvoteThread,
  optimisticDownvoteThread,
  fetchThreadsAndUsers,
  createThread,
  selectFilteredThreads,
  selectAllCategories,
} from '../threadsSlice';

const mockThread1 = {
  id: 'thread-1',
  title: 'Belajar Redux',
  body: 'Konten thread redux',
  category: 'redux',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  totalComments: 2,
  upVotesBy: ['user-2'],
  downVotesBy: [],
};

const mockThread2 = {
  id: 'thread-2',
  title: 'Perkenalan',
  body: 'Halo semua!',
  category: 'perkenalan',
  createdAt: '2024-01-02T00:00:00.000Z',
  ownerId: 'user-2',
  totalComments: 1,
  upVotesBy: [],
  downVotesBy: ['user-1'],
};

const initialState = {
  items: [mockThread1, mockThread2],
  users: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

describe('threadsSlice - Reducer category filter', () => {
  it('setSelectedCategory: harus mengubah selectedCategory menjadi nilai yang diberikan', () => {
    const result = threadsReducer(initialState, setSelectedCategory('redux'));
    expect(result.selectedCategory).toBe('redux');
  });

  it('clearSelectedCategory: harus mengosongkan selectedCategory menjadi null', () => {
    const stateWithCat = { ...initialState, selectedCategory: 'redux' };
    const result = threadsReducer(stateWithCat, clearSelectedCategory());
    expect(result.selectedCategory).toBeNull();
  });
});

describe('threadsSlice - Reducer optimistic upvote', () => {
  it('optimisticUpvoteThread: harus menambah userId ke upVotesBy jika belum ada', () => {
    const result = threadsReducer(
      initialState,
      optimisticUpvoteThread({ threadId: 'thread-1', userId: 'user-3' }),
    );
    const thread = result.items.find((t) => t.id === 'thread-1');
    expect(thread.upVotesBy).toContain('user-3');
  });

  it('optimisticUpvoteThread: harus toggle off jika userId sudah ada di upVotesBy', () => {
    const result = threadsReducer(
      initialState,
      optimisticUpvoteThread({ threadId: 'thread-1', userId: 'user-2' }),
    );
    const thread = result.items.find((t) => t.id === 'thread-1');
    expect(thread.upVotesBy).not.toContain('user-2');
  });

  it('optimisticUpvoteThread: harus memindahkan userId dari downVotesBy ke upVotesBy', () => {
    const result = threadsReducer(
      initialState,
      optimisticUpvoteThread({ threadId: 'thread-2', userId: 'user-1' }),
    );
    const thread = result.items.find((t) => t.id === 'thread-2');
    expect(thread.upVotesBy).toContain('user-1');
    expect(thread.downVotesBy).not.toContain('user-1');
  });
});

describe('threadsSlice - Reducer optimistic downvote', () => {
  it('optimisticDownvoteThread: harus menambah userId ke downVotesBy jika belum ada', () => {
    const result = threadsReducer(
      initialState,
      optimisticDownvoteThread({ threadId: 'thread-1', userId: 'user-3' }),
    );
    const thread = result.items.find((t) => t.id === 'thread-1');
    expect(thread.downVotesBy).toContain('user-3');
  });

  it('optimisticDownvoteThread: harus toggle off jika userId sudah ada di downVotesBy', () => {
    const result = threadsReducer(
      initialState,
      optimisticDownvoteThread({ threadId: 'thread-2', userId: 'user-1' }),
    );
    const thread = result.items.find((t) => t.id === 'thread-2');
    expect(thread.downVotesBy).not.toContain('user-1');
  });
});

describe('threadsSlice - Thunk extraReducers', () => {
  it('fetchThreadsAndUsers.fulfilled: harus mengisi items dan users', () => {
    const action = {
      type: fetchThreadsAndUsers.fulfilled.type,
      payload: { threads: [mockThread1], users: [{ id: 'user-1', name: 'Budi' }] },
    };
    const result = threadsReducer({ ...initialState, items: [] }, action);
    expect(result.items).toHaveLength(1);
    expect(result.users).toHaveLength(1);
    expect(result.isLoading).toBe(false);
  });

  it('fetchThreadsAndUsers.rejected: harus menyimpan error ke state', () => {
    const action = {
      type: fetchThreadsAndUsers.rejected.type,
      payload: 'Gagal memuat thread',
    };
    const result = threadsReducer(initialState, action);
    expect(result.error).toBe('Gagal memuat thread');
    expect(result.isLoading).toBe(false);
  });

  it('createThread.fulfilled: harus menambah thread baru ke awal items', () => {
    const newThread = {
      id: 'thread-new',
      title: 'Thread Baru',
      category: 'umum',
      upVotesBy: [],
      downVotesBy: [],
    };
    const action = { type: createThread.fulfilled.type, payload: newThread };
    const result = threadsReducer(initialState, action);
    expect(result.items[0].id).toBe('thread-new');
    expect(result.items).toHaveLength(3);
  });
});

describe('threadsSlice - Selectors', () => {
  const storeState = {
    threads: initialState,
  };

  it('selectFilteredThreads: tanpa filter, harus return semua threads', () => {
    const result = selectFilteredThreads(storeState);
    expect(result).toHaveLength(2);
  });

  it('selectFilteredThreads: dengan filter, harus return thread yang sesuai saja', () => {
    const filteredState = { threads: { ...initialState, selectedCategory: 'redux' } };
    const result = selectFilteredThreads(filteredState);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('thread-1');
  });

  it('selectAllCategories: harus return daftar kategori unik', () => {
    const result = selectAllCategories(storeState);
    expect(result).toContain('redux');
    expect(result).toContain('perkenalan');
    expect(result).toHaveLength(2);
  });
});
