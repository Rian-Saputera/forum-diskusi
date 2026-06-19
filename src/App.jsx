import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchOwnProfile } from './store/authSlice';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      dispatch(fetchOwnProfile());
    }
  }, [dispatch, token]);

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
          <Route
            path="/threads/new"
            element={
              <ProtectedRoute>
                <CreateThreadPage />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e2139',
            color: '#e2e8f0',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#1e2139' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1e2139' } },
        }}
      />
    </>
  );
};

export default App;
