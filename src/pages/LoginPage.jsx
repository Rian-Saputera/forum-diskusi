import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { loginUser, fetchOwnProfile, clearError } from '../store/authSlice';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {navigate('/', { replace: true });}
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      await dispatch(fetchOwnProfile());
      toast.success('Berhasil masuk!');
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <FiLogIn className="auth-icon" />
          </div>
          <h1 className="auth-title">Selamat Datang</h1>
          <p className="auth-subtitle">Masuk ke akun Forum Diskusi Anda</p>
        </div>

        <form id="form-login" className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="input-email" className="form-label">
              <FiMail /> Email
            </label>
            <input
              id="input-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-password" className="form-label">
              <FiLock /> Password
            </label>
            <input
              id="input-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Password Anda"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            id="btn-login"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size={20} /> : 'Masuk'}
          </button>
        </form>

        <p className="auth-redirect">
          Belum punya akun?{' '}
          <Link to="/register" className="auth-link">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
