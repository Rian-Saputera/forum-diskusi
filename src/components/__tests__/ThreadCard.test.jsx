/**
 * Test Scenarios untuk komponen ThreadCard:
 * 1. Render: harus menampilkan judul thread
 * 2. Render: harus menampilkan nama pembuat thread
 * 3. Render: harus menampilkan badge kategori jika ada
 * 4. Render: harus menampilkan potongan body thread
 * 5. Render: harus menampilkan jumlah komentar
 * 6. Render: harus menampilkan VoteButton dengan jumlah vote yang benar
 * 7. Navigasi: judul thread harus berupa link ke halaman detail
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ThreadCard from '../ThreadCard';

vi.mock('../../api', () => ({
  apiUpvoteThread: vi.fn(),
  apiDownvoteThread: vi.fn(),
  apiNeutralVoteThread: vi.fn(),
}));

const mockStore = configureStore({
  reducer: {
    auth: () => ({
      authUser: { id: 'user-99', name: 'Tester' },
      token: 'token-abc',
      isLoading: false,
      error: null,
    }),
    threads: () => ({
      items: [],
      users: [],
      selectedCategory: null,
      isLoading: false,
      error: null,
    }),
  },
});

const mockThread = {
  id: 'thread-1',
  title: 'Belajar Redux Toolkit',
  body: 'Ini adalah konten panjang dari sebuah thread yang membahas Redux Toolkit secara mendalam.',
  category: 'teknologi',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  totalComments: 5,
  upVotesBy: ['user-2', 'user-3'],
  downVotesBy: ['user-4'],
};

const mockUser = {
  id: 'user-1',
  name: 'Dicoding Indonesia',
  avatar: '',
};

const renderThreadCard = (thread = mockThread, user = mockUser) =>
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <ThreadCard thread={thread} user={user} />
      </BrowserRouter>
    </Provider>,
  );

describe('ThreadCard - Render konten', () => {
  it('harus menampilkan judul thread', () => {
    renderThreadCard();
    expect(screen.getByText('Belajar Redux Toolkit')).toBeInTheDocument();
  });

  it('harus menampilkan nama pembuat thread', () => {
    renderThreadCard();
    expect(screen.getByText('Dicoding Indonesia')).toBeInTheDocument();
  });

  it('harus menampilkan badge kategori', () => {
    renderThreadCard();
    expect(screen.getByText('#teknologi')).toBeInTheDocument();
  });

  it('harus menampilkan potongan isi body thread', () => {
    renderThreadCard();
    expect(screen.getByText(/Ini adalah konten panjang/i)).toBeInTheDocument();
  });

  it('harus menampilkan jumlah komentar', () => {
    renderThreadCard();
    expect(screen.getByText(/5 komentar/i)).toBeInTheDocument();
  });

  it('harus menampilkan jumlah upvote (2) dan downvote (1)', () => {
    renderThreadCard();
    expect(screen.getByLabelText('Upvote (2)')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote (1)')).toBeInTheDocument();
  });
});

describe('ThreadCard - Navigasi', () => {
  it('judul thread harus merupakan link menuju halaman detail', () => {
    renderThreadCard();
    const titleLink = screen.getByText('Belajar Redux Toolkit').closest('a');
    expect(titleLink).toHaveAttribute('href', '/threads/thread-1');
  });
});
