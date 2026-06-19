/**
 * Test Scenarios untuk komponen CommentForm:
 * 1. Render (auth): harus menampilkan textarea dan tombol kirim
 * 2. Render (tidak auth): harus menampilkan pesan "silakan masuk"
 * 3. Interaksi: ketik di textarea harus memperbarui nilai input
 * 4. Interaksi: submit form dengan konten harus memanggil onSubmit dengan nilai yang benar
 * 5. Interaksi: submit form tanpa konten tidak boleh memanggil onSubmit
 * 6. State: tombol kirim harus disabled saat isLoading=true
 * 7. State: setelah submit berhasil, textarea harus dikosongkan
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CommentForm from '../CommentForm';

const createMockStore = (isAuthenticated) =>
  configureStore({
    reducer: {
      auth: () => ({
        authUser: isAuthenticated ? { id: 'user-1', name: 'Budi' } : null,
        token: isAuthenticated ? 'token-abc' : null,
        isLoading: false,
        error: null,
      }),
    },
  });

const renderWithStore = (ui, isAuthenticated = true) =>
  render(<Provider store={createMockStore(isAuthenticated)}>{ui}</Provider>);

describe('CommentForm - Render', () => {
  it('jika terautentikasi: harus menampilkan textarea dan tombol kirim', () => {
    renderWithStore(<CommentForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Tulis komentar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kirim Komentar/i })).toBeInTheDocument();
  });

  it('jika tidak terautentikasi: harus menampilkan pesan untuk masuk', () => {
    renderWithStore(<CommentForm onSubmit={vi.fn()} />, false);
    expect(screen.getByText(/Silakan/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Tulis komentar/i)).not.toBeInTheDocument();
  });
});

describe('CommentForm - Interaksi', () => {
  it('ketik di textarea harus memperbarui tampilan nilai', () => {
    renderWithStore(<CommentForm onSubmit={vi.fn()} />);
    const textarea = screen.getByPlaceholderText(/Tulis komentar/i);
    fireEvent.change(textarea, { target: { value: 'Komentar test saya' } });
    expect(textarea.value).toBe('Komentar test saya');
  });

  it('submit dengan konten harus memanggil onSubmit dengan nilai yang benar', () => {
    const onSubmit = vi.fn();
    renderWithStore(<CommentForm onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Tulis komentar/i);
    fireEvent.change(textarea, { target: { value: 'Komentar saya' } });
    fireEvent.submit(screen.getByRole('form', { hidden: true }) || textarea.closest('form'));
    expect(onSubmit).toHaveBeenCalledWith('Komentar saya');
  });

  it('submit dengan textarea kosong tidak boleh memanggil onSubmit', () => {
    const onSubmit = vi.fn();
    renderWithStore(<CommentForm onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Tulis komentar/i);
    fireEvent.submit(textarea.closest('form'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('setelah submit berhasil, textarea harus dikosongkan', () => {
    const onSubmit = vi.fn();
    renderWithStore(<CommentForm onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Tulis komentar/i);
    fireEvent.change(textarea, { target: { value: 'Isi komentar' } });
    fireEvent.submit(textarea.closest('form'));
    expect(textarea.value).toBe('');
  });
});

describe('CommentForm - State loading', () => {
  it('tombol kirim harus disabled saat isLoading=true', () => {
    renderWithStore(<CommentForm onSubmit={vi.fn()} isLoading />);
    const btn = screen.getByRole('button', { name: /Kirim komentar/i });
    expect(btn).toBeDisabled();
  });
});
