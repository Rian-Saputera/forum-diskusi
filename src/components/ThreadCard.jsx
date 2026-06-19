import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiMessageCircle, FiClock } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import Avatar from './Avatar';
import VoteButton from './VoteButton';
import formatDate from '../utils/dateFormatter';
import useAuth from '../hooks/useAuth';
import {
  optimisticUpvoteThread,
  optimisticDownvoteThread,
} from '../store/threadsSlice';
import {
  apiUpvoteThread,
  apiDownvoteThread,
  apiNeutralVoteThread,
} from '../api';

const ThreadCard = ({ thread, user }) => {
  const dispatch = useDispatch();
  const { authUser } = useAuth();

  const maxBodyLength = 150;
  const bodyPreview = thread.body && thread.body.length > maxBodyLength
    ? `${thread.body.replace(/<[^>]*>/g, '').substring(0, maxBodyLength)}...`
    : thread.body?.replace(/<[^>]*>/g, '');

  const handleUpvote = async () => {
    if (!authUser) {return;}
    const alreadyUpvoted = thread.upVotesBy.includes(authUser.id);
    dispatch(optimisticUpvoteThread({ threadId: thread.id, userId: authUser.id }));
    try {
      if (alreadyUpvoted) {
        await apiNeutralVoteThread(thread.id);
      } else {
        await apiUpvoteThread(thread.id);
      }
    } catch {
      dispatch(optimisticUpvoteThread({ threadId: thread.id, userId: authUser.id }));
    }
  };

  const handleDownvote = async () => {
    if (!authUser) {return;}
    const alreadyDownvoted = thread.downVotesBy.includes(authUser.id);
    dispatch(optimisticDownvoteThread({ threadId: thread.id, userId: authUser.id }));
    try {
      if (alreadyDownvoted) {
        await apiNeutralVoteThread(thread.id);
      } else {
        await apiDownvoteThread(thread.id);
      }
    } catch {
      dispatch(optimisticDownvoteThread({ threadId: thread.id, userId: authUser.id }));
    }
  };

  return (
    <article className="thread-card">
      <div className="thread-card-header">
        <div className="thread-owner">
          <Avatar src={user?.avatar} name={user?.name} size={36} />
          <div className="thread-owner-info">
            <span className="thread-owner-name">{user?.name || 'Pengguna'}</span>
            <span className="thread-meta">
              <FiClock />
              {formatDate(thread.createdAt)}
            </span>
          </div>
        </div>
        {thread.category && (
          <span className="thread-category-badge">#{thread.category}</span>
        )}
      </div>

      <Link to={`/threads/${thread.id}`} className="thread-card-body">
        <h2 className="thread-title">{thread.title}</h2>
        {bodyPreview && <p className="thread-body-preview">{bodyPreview}</p>}
      </Link>

      <div className="thread-card-footer">
        <VoteButton
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userId={authUser?.id}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          size="sm"
          entityId={thread.id}
        />
        <span className="thread-comments-count">
          <FiMessageCircle />
          {thread.totalComments} komentar
        </span>
      </div>
    </article>
  );
};

ThreadCard.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    totalComments: PropTypes.number,
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

ThreadCard.defaultProps = {
  user: null,
};

export default ThreadCard;
