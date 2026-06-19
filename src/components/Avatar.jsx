import PropTypes from 'prop-types';

const Avatar = ({ src, name, size = 36 }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User avatar'}
        className="avatar"
        style={{ width: size, height: size }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className="avatar avatar-fallback"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name}
    >
      {initial}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  src: '',
  name: '',
  size: 36,
};

export default Avatar;
