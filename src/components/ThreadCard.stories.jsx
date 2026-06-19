import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThreadCard from './ThreadCard';

const mockStore = configureStore({
  reducer: {
    auth: () => ({ authUser: null, token: null, isLoading: false, error: null }),
    threads: () => ({ items: [], users: [], selectedCategory: null, isLoading: false, error: null }),
  },
});

const withProviders = (Story) => (
  <Provider store={mockStore}>
    <BrowserRouter>
      <Story />
    </BrowserRouter>
  </Provider>
);

/** @type { import('@storybook/react').Meta } */
export default {
  title: 'Components/ThreadCard',
  component: ThreadCard,
  decorators: [withProviders],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

const baseThread = {
  id: 'thread-1',
  title: 'Bagaimana pengalamanmu belajar Redux?',
  body: 'Coba ceritakan dong, gimana pengalaman kalian belajar Redux di Dicoding? Saya merasa cukup menantang di awal, tapi setelah paham konsepnya jadi sangat menyenangkan.',
  category: 'redux',
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  ownerId: 'user-1',
  totalComments: 7,
  upVotesBy: ['user-2', 'user-3', 'user-4'],
  downVotesBy: ['user-5'],
};

const baseUser = {
  id: 'user-1',
  name: 'Dicoding Indonesia',
  avatar: 'https://ui-avatars.com/api/?name=Dicoding+Indonesia&background=6366f1&color=fff',
};

/** Thread dengan kategori, vote, dan komentar */
export const Default = {
  args: {
    thread: baseThread,
    user: baseUser,
  },
};

/** Thread tanpa kategori dan minim data */
export const Minimal = {
  args: {
    thread: {
      ...baseThread,
      id: 'thread-2',
      title: 'Halo! Selamat datang di Forum Diskusi',
      body: 'Semoga bermanfaat.',
      category: '',
      totalComments: 0,
      upVotesBy: [],
      downVotesBy: [],
    },
    user: null,
  },
};

/** Thread dengan judul sangat panjang */
export const LongTitle = {
  args: {
    thread: {
      ...baseThread,
      id: 'thread-3',
      title: 'Ini adalah judul thread yang sangat panjang sekali untuk menguji bagaimana ThreadCard menampilkan teks yang overflow atau terpotong dengan elegan',
      category: 'diskusi',
    },
    user: baseUser,
  },
};

/** Thread dengan banyak votes */
export const HighVotes = {
  args: {
    thread: {
      ...baseThread,
      id: 'thread-4',
      upVotesBy: Array.from({ length: 42 }, (_, i) => `user-${i}`),
      downVotesBy: Array.from({ length: 7 }, (_, i) => `user-d${i}`),
      totalComments: 23,
    },
    user: baseUser,
  },
};
