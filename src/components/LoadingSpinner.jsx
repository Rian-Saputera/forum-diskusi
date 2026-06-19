import PropTypes from 'prop-types';

const LoadingSpinner = ({ fullPage, size }) => {
  if (fullPage) {
    return (
      <div className="loading-overlay" role="status" aria-label="Memuat data...">
        <div className="spinner-ring" style={{ width: size, height: size }} />
        <p className="loading-text">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="spinner-inline" role="status" aria-label="Memuat data...">
      <div className="spinner-ring" style={{ width: size, height: size }} />
    </div>
  );
};

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool,
  size: PropTypes.number,
};

LoadingSpinner.defaultProps = {
  fullPage: false,
  size: 40,
};

export default LoadingSpinner;
