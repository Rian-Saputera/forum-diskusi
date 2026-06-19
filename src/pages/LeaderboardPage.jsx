import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiAward, FiAlertCircle } from 'react-icons/fi';
import { fetchLeaderboard } from '../store/leaderboardSlice';
import LeaderboardItem from '../components/LeaderboardItem';
import LoadingSpinner from '../components/LoadingSpinner';

const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (isLoading) {return <LoadingSpinner fullPage />;}

  if (error) {
    return (
      <div className="error-state">
        <FiAlertCircle className="error-icon" />
        <h2>Gagal memuat leaderboard</h2>
        <p>{error}</p>
        <button
          type="button"
          id="btn-retry-leaderboard"
          className="btn btn-primary"
          onClick={() => dispatch(fetchLeaderboard())}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="page-header">
          <div className="leaderboard-hero">
            <div className="trophy-icon">
              <FiAward />
            </div>
            <h1 className="page-title">Leaderboard</h1>
            <p className="page-subtitle">
              Pengguna paling aktif dalam komunitas Forum Diskusi
            </p>
          </div>
        </div>

        <div className="leaderboard-list">
          {items.length === 0 ? (
            <div className="empty-state">
              <FiAward className="empty-icon" />
              <p>Belum ada data leaderboard</p>
            </div>
          ) : (
            items.map((item, index) => (
              <LeaderboardItem
                key={item.user.id}
                item={item}
                rank={index + 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
