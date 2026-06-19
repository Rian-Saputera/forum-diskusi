import PropTypes from 'prop-types';
import { FiAward } from 'react-icons/fi';
import Avatar from './Avatar';

const LeaderboardItem = ({ item, rank }) => {
  const rankClass = rank <= 3 ? `leaderboard-rank--top${rank}` : '';

  return (
    <div className="leaderboard-item">
      <div className={`leaderboard-rank ${rankClass}`}>
        {rank <= 3 ? <FiAward /> : rank}
      </div>
      <Avatar src={item.user.avatar} name={item.user.name} size={44} />
      <div className="leaderboard-user-info">
        <span className="leaderboard-name">{item.user.name}</span>
        <span className="leaderboard-email">{item.user.email || ''}</span>
      </div>
      <div className="leaderboard-score">
        <span className="score-value">{item.score}</span>
        <span className="score-label">poin</span>
      </div>
    </div>
  );
};

LeaderboardItem.propTypes = {
  item: PropTypes.shape({
    score: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
      avatar: PropTypes.string,
    }).isRequired,
  }).isRequired,
  rank: PropTypes.number.isRequired,
};

export default LeaderboardItem;
