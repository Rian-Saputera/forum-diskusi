import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { registerUser, clearError } from '../store/authSlice';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });

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
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Akun berhasil dibuat! Silakan masuk.');
      navigate('/login');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <FiUserPlus className="auth-icon" />
          </div>
          <h1 className="auth-title">Buat Akun</h1>
          <p className="auth-subtitle">Bergabunglah dengan komunitas Forum Diskusi</p>
        </div>

        <form id="form-register" className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="input-name" className="form-label">
              <FiUser /> Nama
            </label>
            <input
              id="input-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="Nama lengkap Anda"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            id="btn-register"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size={20} /> : 'Buat Akun'}
          </button>
        </form>

        <p className="auth-redirect">
          Sudah punya akun?{' '}
          <Link to="/login" className="auth-link">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
