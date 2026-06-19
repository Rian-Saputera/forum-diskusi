import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FiClock } from 'react-icons/fi';
import Avatar from './Avatar';
import VoteButton from './VoteButton';
import formatDate from '../utils/dateFormatter';
import useAuth from '../hooks/useAuth';
import { optimisticVoteComment } from '../store/threadDetailSlice';
import {
  apiUpvoteComment,
  apiDownvoteComment,
  apiNeutralVoteComment,
} from '../api';

const CommentCard = ({ comment, threadId }) => {
  const dispatch = useDispatch();
  const { authUser } = useAuth();

  const handleUpvote = async () => {
    if (!authUser) {return;}
    const alreadyUpvoted = comment.upVotesBy.includes(authUser.id);
    dispatch(optimisticVoteComment({ commentId: comment.id, userId: authUser.id, voteType: 'up' }));
    try {
      if (alreadyUpvoted) {
        await apiNeutralVoteComment(threadId, comment.id);
      } else {
        await apiUpvoteComment(threadId, comment.id);
      }
    } catch {
      dispatch(optimisticVoteComment({ commentId: comment.id, userId: authUser.id, voteType: 'up' }));
    }
  };

  const handleDownvote = async () => {
    if (!authUser) {return;}
    const alreadyDownvoted = comment.downVotesBy.includes(authUser.id);
    dispatch(optimisticVoteComment({ commentId: comment.id, userId: authUser.id, voteType: 'down' }));
    try {
      if (alreadyDownvoted) {
        await apiNeutralVoteComment(threadId, comment.id);
      } else {
        await apiDownvoteComment(threadId, comment.id);
      }
    } catch {
      dispatch(optimisticVoteComment({ commentId: comment.id, userId: authUser.id, voteType: 'down' }));
    }
  };

  return (
    <div className="comment-card">
      <div className="comment-header">
        <Avatar src={comment.owner?.avatar} name={comment.owner?.name} size={32} />
        <div className="comment-owner-info">
          <span className="comment-owner-name">{comment.owner?.name || 'Pengguna'}</span>
          <span className="comment-meta">
            <FiClock />
            {formatDate(comment.createdAt)}
          </span>
        </div>
      </div>
      <div
        className="comment-content"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      <div className="comment-footer">
        <VoteButton
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
          userId={authUser?.id}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          size="sm"
          entityId={comment.id}
        />
      </div>
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
    owner: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentCard;
