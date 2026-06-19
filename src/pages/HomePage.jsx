import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { fetchThreadsAndUsers, setSelectedCategory, selectFilteredThreads, selectAllCategories } from '../store/threadsSlice';
import ThreadCard from '../components/ThreadCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const dispatch = useDispatch();
  const { users, selectedCategory, isLoading, error } = useSelector((state) => state.threads);
  const filteredThreads = useSelector(selectFilteredThreads);
  const categories = useSelector(selectAllCategories);

  useEffect(() => {
    dispatch(fetchThreadsAndUsers());
  }, [dispatch]);

  const getUserById = (ownerId) => users.find((u) => u.id === ownerId) || null;

  const handleCategorySelect = (cat) => {
    dispatch(setSelectedCategory(cat));
  };

  if (isLoading) {return <LoadingSpinner fullPage />;}

  if (error) {
    return (
      <div className="error-state">
        <FiAlertCircle className="error-icon" />
        <h2>Gagal memuat thread</h2>
        <p>{error}</p>
        <button
          type="button"
          id="btn-retry"
          className="btn btn-primary"
          onClick={() => dispatch(fetchThreadsAndUsers())}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <main className="threads-main">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">
              <FiMessageSquare />
              Diskusi Terbaru
            </h1>
            <p className="page-subtitle">
              {selectedCategory
                ? `Menampilkan thread dengan kategori #${selectedCategory}`
                : `${filteredThreads.length} thread tersedia`}
            </p>
          </div>
        </div>

        <div className="home-layout">
          <div className="threads-list">
            {filteredThreads.length === 0 ? (
              <div className="empty-state">
                <FiMessageSquare className="empty-icon" />
                <h2>Belum ada thread</h2>
                <p>Jadilah yang pertama memulai diskusi!</p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  user={getUserById(thread.ownerId)}
                />
              ))
            )}
          </div>

          <aside className="sidebar">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
