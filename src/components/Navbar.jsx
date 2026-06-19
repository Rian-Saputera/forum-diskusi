import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiMessageSquare, FiAward, FiLogIn, FiLogOut, FiPlusCircle, FiUser } from 'react-icons/fi';
import { logoutUser } from '../store/authSlice';
import useAuth from '../hooks/useAuth';
import Avatar from './Avatar';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser, isAuthenticated } = useAuth();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Navigasi utama">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Forum Diskusi - Halaman Utama">
          <FiMessageSquare className="brand-icon" />
          <span className="brand-text">Forum<span className="brand-accent">Diskusi</span></span>
        </Link>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            end
          >
            Thread
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            <FiAward />
            Leaderboard
          </NavLink>
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/threads/new" className="btn btn-primary btn-sm">
                <FiPlusCircle />
                Buat Thread
              </Link>
              <div className="user-menu">
                <Avatar src={authUser?.avatar} name={authUser?.name} size={34} />
                <span className="user-name">{authUser?.name}</span>
              </div>
              <button
                type="button"
                id="btn-logout"
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                aria-label="Keluar dari akun"
              >
                <FiLogOut />
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                <FiLogIn />
                Masuk
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <FiUser />
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
