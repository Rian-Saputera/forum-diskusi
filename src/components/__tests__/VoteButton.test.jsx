/**
 * Test Scenarios untuk komponen VoteButton:
 * 1. Render: harus menampilkan jumlah upvote dan downvote dengan benar
 * 2. Render: tombol upvote harus punya class active jika userId ada di upVotesBy
 * 3. Render: tombol downvote harus punya class active jika userId ada di downVotesBy
 * 4. Render: tidak ada class active jika user belum vote
 * 5. Interaksi: klik tombol upvote harus memanggil onUpvote
 * 6. Interaksi: klik tombol downvote harus memanggil onDownvote
 * 7. Aksesibilitas: tombol harus punya aria-label yang benar
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoteButton from '../VoteButton';

const defaultProps = {
  upVotesBy: ['user-1', 'user-2'],
  downVotesBy: ['user-3'],
  userId: 'user-4',
  onUpvote: vi.fn(),
  onDownvote: vi.fn(),
  entityId: 'thread-test',
};

describe('VoteButton - Render', () => {
  it('harus menampilkan jumlah upvote dengan benar', () => {
    render(<VoteButton {...defaultProps} />);
    expect(screen.getByLabelText(/Upvote \(2\)/i)).toBeInTheDocument();
  });

  it('harus menampilkan jumlah downvote dengan benar', () => {
    render(<VoteButton {...defaultProps} />);
    expect(screen.getByLabelText(/Downvote \(1\)/i)).toBeInTheDocument();
  });

  it('tombol upvote harus memiliki class active jika userId ada di upVotesBy', () => {
    render(<VoteButton {...defaultProps} userId="user-1" />);
    const upBtn = screen.getByLabelText(/Upvote/i);
    expect(upBtn).toHaveClass('vote-btn--active-up');
  });

  it('tombol downvote harus memiliki class active jika userId ada di downVotesBy', () => {
    render(<VoteButton {...defaultProps} userId="user-3" />);
    const downBtn = screen.getByLabelText(/Downvote/i);
    expect(downBtn).toHaveClass('vote-btn--active-down');
  });

  it('tidak ada class active jika user belum melakukan vote', () => {
    render(<VoteButton {...defaultProps} userId="user-99" />);
    const upBtn = screen.getByLabelText(/Upvote/i);
    const downBtn = screen.getByLabelText(/Downvote/i);
    expect(upBtn).not.toHaveClass('vote-btn--active-up');
    expect(downBtn).not.toHaveClass('vote-btn--active-down');
  });
});

describe('VoteButton - Interaksi', () => {
  it('klik tombol upvote harus memanggil fungsi onUpvote', () => {
    const onUpvote = vi.fn();
    render(<VoteButton {...defaultProps} onUpvote={onUpvote} />);
    fireEvent.click(screen.getByLabelText(/Upvote/i));
    expect(onUpvote).toHaveBeenCalledTimes(1);
  });

  it('klik tombol downvote harus memanggil fungsi onDownvote', () => {
    const onDownvote = vi.fn();
    render(<VoteButton {...defaultProps} onDownvote={onDownvote} />);
    fireEvent.click(screen.getByLabelText(/Downvote/i));
    expect(onDownvote).toHaveBeenCalledTimes(1);
  });
});

describe('VoteButton - Aksesibilitas', () => {
  it('tombol upvote harus punya aria-label yang memuat jumlah vote', () => {
    render(<VoteButton {...defaultProps} />);
    expect(screen.getByLabelText('Upvote (2)')).toBeInTheDocument();
  });

  it('tombol downvote harus punya aria-pressed sesuai status vote', () => {
    render(<VoteButton {...defaultProps} userId="user-3" />);
    const downBtn = screen.getByLabelText(/Downvote/i);
    expect(downBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
