import VoteButton from './VoteButton';

/** @type { import('@storybook/react').Meta } */
export default {
  title: 'Components/VoteButton',
  component: VoteButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onUpvote: { action: 'upvoted' },
    onDownvote: { action: 'downvoted' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

/** Belum ada vote sama sekali */
export const Default = {
  args: {
    upVotesBy: [],
    downVotesBy: [],
    userId: 'user-current',
    entityId: 'thread-demo',
    size: 'md',
  },
};

/** Pengguna sudah upvote */
export const UserUpvoted = {
  args: {
    upVotesBy: ['user-current', 'user-2', 'user-3'],
    downVotesBy: ['user-4'],
    userId: 'user-current',
    entityId: 'thread-demo-2',
    size: 'md',
  },
};

/** Pengguna sudah downvote */
export const UserDownvoted = {
  args: {
    upVotesBy: ['user-2'],
    downVotesBy: ['user-current', 'user-3'],
    userId: 'user-current',
    entityId: 'thread-demo-3',
    size: 'md',
  },
};

/** Ukuran kecil (untuk digunakan di list) */
export const Small = {
  args: {
    upVotesBy: ['user-1'],
    downVotesBy: [],
    userId: null,
    entityId: 'thread-demo-4',
    size: 'sm',
  },
};

/** Ukuran besar (untuk digunakan di detail) */
export const Large = {
  args: {
    upVotesBy: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    downVotesBy: ['user-6'],
    userId: 'user-current',
    entityId: 'thread-demo-5',
    size: 'lg',
  },
};
