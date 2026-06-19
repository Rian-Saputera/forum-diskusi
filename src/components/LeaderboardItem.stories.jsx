import LeaderboardItem from './LeaderboardItem';

/** @type { import('@storybook/react').Meta } */
export default {
  title: 'Components/LeaderboardItem',
  component: LeaderboardItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

const baseUser = {
  id: 'user-1',
  name: 'Dicoding Indonesia',
  email: 'dicoding@dicoding.com',
  avatar: 'https://ui-avatars.com/api/?name=Dicoding&background=f59e0b&color=fff',
};

/** Peringkat 1 — mendapat badge emas */
export const Rank1 = {
  args: {
    item: { score: 980, user: baseUser },
    rank: 1,
  },
};

/** Peringkat 2 — mendapat badge perak */
export const Rank2 = {
  args: {
    item: {
      score: 750,
      user: { ...baseUser, id: 'user-2', name: 'Budi Santoso', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=94a3b8&color=fff' },
    },
    rank: 2,
  },
};

/** Peringkat 3 — mendapat badge perunggu */
export const Rank3 = {
  args: {
    item: {
      score: 620,
      user: { ...baseUser, id: 'user-3', name: 'Siti Rahayu', avatar: 'https://ui-avatars.com/api/?name=Siti+Rahayu&background=b45309&color=fff' },
    },
    rank: 3,
  },
};

/** Peringkat biasa (tanpa badge ikon) */
export const RegularRank = {
  args: {
    item: {
      score: 120,
      user: { ...baseUser, id: 'user-10', name: 'Andi Wijaya', avatar: '' },
    },
    rank: 10,
  },
};
