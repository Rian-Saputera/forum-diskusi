/**
 * Test Scenarios untuk threadDetailSlice:
 * 1. Reducer - clearThreadDetail: harus mengosongkan thread dan error
 * 2. Reducer - optimisticVoteThread (up): harus menambah userId ke upVotesBy
 * 3. Reducer - optimisticVoteThread (up toggle): jika sudah upvote, harus toggle off
 * 4. Reducer - optimisticVoteThread (down): harus menambah userId ke downVotesBy
 * 5. Reducer - optimisticVoteThread (neutral): harus menghapus dari keduanya
 * 6. Reducer - optimisticVoteComment (up): harus upvote pada komentar yang tepat
 * 7. Reducer - optimisticVoteComment (down): harus downvote pada komentar yang tepat
 * 8. Thunk - fetchThreadDetail.fulfilled: harus mengisi thread
 * 9. Thunk - fetchThreadDetail.rejected: harus menyimpan error
 * 10. Thunk - addComment.fulfilled: harus menambah komentar baru ke awal array
 */

import { describe, it, expect } from 'vitest';
import threadDetailReducer, {
  clearThreadDetail,
  optimisticVoteThread,
  optimisticVoteComment,
  fetchThreadDetail,
  addComment,
} from '../threadDetailSlice';

const mockComment = {
  id: 'comment-1',
  content: 'Komentar pertama',
  createdAt: '2024-01-01T00:00:00.000Z',
  upVotesBy: [],
  downVotesBy: ['user-2'],
  owner: { id: 'user-1', name: 'Budi', avatar: '' },
};

const mockThread = {
  id: 'thread-1',
  title: 'Belajar Redux',
  body: '<p>Konten thread</p>',
  category: 'redux',
  createdAt: '2024-01-01T00:00:00.000Z',
  owner: { id: 'user-1', name: 'Budi', avatar: '' },
  upVotesBy: ['user-2'],
  downVotesBy: [],
  comments: [mockComment],
};

const populatedState = {
  thread: mockThread,
  isLoading: false,
  error: null,
};

describe('threadDetailSlice - Reducer clearThreadDetail', () => {
  it('clearThreadDetail: harus mengosongkan thread dan error', () => {
    const result = threadDetailReducer(populatedState, clearThreadDetail());
    expect(result.thread).toBeNull();
    expect(result.error).toBeNull();
  });
});

describe('threadDetailSlice - Reducer optimisticVoteThread', () => {
  it('voteType "up": harus menambah userId ke upVotesBy thread', () => {
    const result = threadDetailReducer(
      populatedState,
      optimisticVoteThread({ userId: 'user-3', voteType: 'up' }),
    );
    expect(result.thread.upVotesBy).toContain('user-3');
  });

  it('voteType "up" toggle: jika sudah upvote, harus menghapus dari upVotesBy', () => {
    const result = threadDetailReducer(
      populatedState,
      optimisticVoteThread({ userId: 'user-2', voteType: 'up' }),
    );
    expect(result.thread.upVotesBy).not.toContain('user-2');
  });

  it('voteType "down": harus menambah userId ke downVotesBy thread', () => {
    const result = threadDetailReducer(
      populatedState,
      optimisticVoteThread({ userId: 'user-3', voteType: 'down' }),
    );
    expect(result.thread.downVotesBy).toContain('user-3');
  });

  it('voteType "neutral": harus menghapus userId dari upVotesBy dan downVotesBy', () => {
    const stateWithBothVotes = {
      ...populatedState,
      thread: {
        ...mockThread,
        upVotesBy: ['user-1'],
        downVotesBy: ['user-2'],
      },
    };
    const result = threadDetailReducer(
      stateWithBothVotes,
      optimisticVoteThread({ userId: 'user-1', voteType: 'neutral' }),
    );
    expect(result.thread.upVotesBy).not.toContain('user-1');
    expect(result.thread.downVotesBy).not.toContain('user-1');
  });
});

describe('threadDetailSlice - Reducer optimisticVoteComment', () => {
  it('voteType "up": harus menambah userId ke upVotesBy komentar yang sesuai', () => {
    const result = threadDetailReducer(
      populatedState,
      optimisticVoteComment({ commentId: 'comment-1', userId: 'user-3', voteType: 'up' }),
    );
    const comment = result.thread.comments.find((c) => c.id === 'comment-1');
    expect(comment.upVotesBy).toContain('user-3');
  });

  it('voteType "down" toggle: jika sudah downvote, harus toggle off', () => {
    const result = threadDetailReducer(
      populatedState,
      optimisticVoteComment({ commentId: 'comment-1', userId: 'user-2', voteType: 'down' }),
    );
    const comment = result.thread.comments.find((c) => c.id === 'comment-1');
    expect(comment.downVotesBy).not.toContain('user-2');
  });
});

describe('threadDetailSlice - Thunk extraReducers', () => {
  it('fetchThreadDetail.fulfilled: harus mengisi thread ke state', () => {
    const action = { type: fetchThreadDetail.fulfilled.type, payload: mockThread };
    const result = threadDetailReducer({ thread: null, isLoading: true, error: null }, action);
    expect(result.thread).toEqual(mockThread);
    expect(result.isLoading).toBe(false);
  });

  it('fetchThreadDetail.rejected: harus menyimpan error ke state', () => {
    const action = { type: fetchThreadDetail.rejected.type, payload: 'Thread tidak ditemukan' };
    const result = threadDetailReducer({ thread: null, isLoading: true, error: null }, action);
    expect(result.error).toBe('Thread tidak ditemukan');
    expect(result.isLoading).toBe(false);
  });

  it('addComment.fulfilled: harus menambah komentar baru ke awal array comments', () => {
    const newComment = {
      id: 'comment-2',
      content: 'Komentar baru',
      createdAt: '2024-01-02T00:00:00.000Z',
      upVotesBy: [],
      downVotesBy: [],
      owner: { id: 'user-3', name: 'Siti' },
    };
    const action = { type: addComment.fulfilled.type, payload: newComment };
    const result = threadDetailReducer(populatedState, action);
    expect(result.thread.comments[0].id).toBe('comment-2');
    expect(result.thread.comments).toHaveLength(2);
  });
});
