import PropTypes from 'prop-types';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

const VoteButton = ({
  upVotesBy,
  downVotesBy,
  userId,
  onUpvote,
  onDownvote,
  size,
  entityId,
}) => {
  const isUpvoted = userId && upVotesBy.includes(userId);
  const isDownvoted = userId && downVotesBy.includes(userId);

  return (
    <div className={`vote-group vote-group--${size}`}>
      <button
        type="button"
        id={`btn-upvote-${entityId}`}
        className={`vote-btn vote-btn--up ${isUpvoted ? 'vote-btn--active-up' : ''}`}
        onClick={onUpvote}
        aria-label={`Upvote (${upVotesBy.length})`}
        aria-pressed={isUpvoted}
      >
        <FiThumbsUp />
        <span>{upVotesBy.length}</span>
      </button>
      <button
        type="button"
        id={`btn-downvote-${entityId}`}
        className={`vote-btn vote-btn--down ${isDownvoted ? 'vote-btn--active-down' : ''}`}
        onClick={onDownvote}
        aria-label={`Downvote (${downVotesBy.length})`}
        aria-pressed={isDownvoted}
      >
        <FiThumbsDown />
        <span>{downVotesBy.length}</span>
      </button>
    </div>
  );
};

VoteButton.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string),
  downVotesBy: PropTypes.arrayOf(PropTypes.string),
  userId: PropTypes.string,
  onUpvote: PropTypes.func.isRequired,
  onDownvote: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  entityId: PropTypes.string,
};

VoteButton.defaultProps = {
  upVotesBy: [],
  downVotesBy: [],
  userId: null,
  size: 'md',
  entityId: 'unknown',
};

export default VoteButton;
