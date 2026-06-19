import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiClock, FiMessageCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchThreadDetail, addComment, optimisticVoteThread, clearThreadDetail } from '../store/threadDetailSlice';
import CommentCard from '../components/CommentCard';
import CommentForm from '../components/CommentForm';
import VoteButton from '../components/VoteButton';
import Avatar from '../components/Avatar';
import LoadingSpinner from '../components/LoadingSpinner';
import formatDate from '../utils/dateFormatter';
import useAuth from '../hooks/useAuth';
import {
  apiUpvoteThread,
  apiDownvoteThread,
  apiNeutralVoteThread,
} from '../api';

const ThreadDetailPage = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { thread, isLoading, error } = useSelector((state) => state.threadDetail);

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, threadId]);

  const handleAddComment = async (content) => {
    if (!authUser) {
      toast.error('Silakan masuk untuk berkomentar');
      navigate('/login');
      return;
    }
    const result = await dispatch(addComment({ threadId, content }));
    if (addComment.fulfilled.match(result)) {
      toast.success('Komentar berhasil ditambahkan!');
    } else {
      toast.error('Gagal menambahkan komentar');
    }
  };

  const handleUpvoteThread = async () => {
    if (!authUser) { toast.error('Silakan masuk terlebih dahulu'); return; }
    const alreadyUpvoted = thread.upVotesBy.includes(authUser.id);
    dispatch(optimisticVoteThread({ userId: authUser.id, voteType: 'up' }));
    try {
      if (alreadyUpvoted) {
        await apiNeutralVoteThread(threadId);
      } else {
        await apiUpvoteThread(threadId);
      }
    } catch {
      dispatch(optimisticVoteThread({ userId: authUser.id, voteType: 'up' }));
    }
  };

  const handleDownvoteThread = async () => {
    if (!authUser) { toast.error('Silakan masuk terlebih dahulu'); return; }
    const alreadyDownvoted = thread.downVotesBy.includes(authUser.id);
    dispatch(optimisticVoteThread({ userId: authUser.id, voteType: 'down' }));
    try {
      if (alreadyDownvoted) {
        await apiNeutralVoteThread(threadId);
      } else {
        await apiDownvoteThread(threadId);
      }
    } catch {
      dispatch(optimisticVoteThread({ userId: authUser.id, voteType: 'down' }));
    }
  };

  if (isLoading) {return <LoadingSpinner fullPage />;}

  if (error) {
    return (
      <div className="error-state">
        <FiAlertCircle className="error-icon" />
        <h2>Thread tidak ditemukan</h2>
        <p>{error}</p>
        <button type="button" id="btn-back-error" className="btn btn-primary" onClick={() => navigate('/')}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (!thread) {return null;}

  return (
    <div className="thread-detail-page">
      <div className="thread-detail-container">
        <button
          type="button"
          id="btn-back"
          className="btn btn-ghost btn-sm back-btn"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
        >
          <FiArrowLeft /> Kembali
        </button>

        <article className="thread-detail-card">
          {thread.category && (
            <span className="thread-category-badge thread-category-badge--lg">#{thread.category}</span>
          )}
          <h1 className="thread-detail-title">{thread.title}</h1>

          <div className="thread-detail-meta">
            <div className="thread-owner">
              <Avatar src={thread.owner?.avatar} name={thread.owner?.name} size={40} />
              <div className="thread-owner-info">
                <span className="thread-owner-name">{thread.owner?.name}</span>
                <span className="thread-meta">
                  <FiClock />
                  {formatDate(thread.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div
            className="thread-detail-body"
            dangerouslySetInnerHTML={{ __html: thread.body }}
          />

          <div className="thread-detail-footer">
            <VoteButton
              upVotesBy={thread.upVotesBy}
              downVotesBy={thread.downVotesBy}
              userId={authUser?.id}
              onUpvote={handleUpvoteThread}
              onDownvote={handleDownvoteThread}
              size="md"
              entityId={thread.id}
            />
            <span className="thread-comments-count">
              <FiMessageCircle />
              {thread.comments?.length || 0} komentar
            </span>
          </div>
        </article>

        <section className="comments-section" aria-label="Komentar">
          <h2 className="comments-title">
            <FiMessageCircle />
            Komentar ({thread.comments?.length || 0})
          </h2>

          <CommentForm onSubmit={handleAddComment} />

          <div className="comments-list">
            {thread.comments && thread.comments.length > 0 ? (
              thread.comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} threadId={threadId} />
              ))
            ) : (
              <div className="empty-state empty-state--sm">
                <p>Belum ada komentar. Jadilah yang pertama!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ThreadDetailPage;
