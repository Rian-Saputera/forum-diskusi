import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiSend } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const CommentForm = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {return;}
    onSubmit(content);
    setContent('');
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-form-locked">
        <p>Silakan <a href="/login">masuk</a> untuk memberikan komentar.</p>
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} aria-label="Form komentar">
      <textarea
        id="input-comment-content"
        className="comment-textarea"
        placeholder="Tulis komentar Anda..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
        aria-label="Isi komentar"
      />
      <div className="comment-form-footer">
        <span className="char-count">{content.length} karakter</span>
        <button
          type="submit"
          id="btn-submit-comment"
          className="btn btn-primary"
          disabled={isLoading || !content.trim()}
          aria-label="Kirim komentar"
        >
          {isLoading ? 'Mengirim...' : (
            <>
              <FiSend />
              Kirim Komentar
            </>
          )}
        </button>
      </div>
    </form>
  );
};

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

CommentForm.defaultProps = {
  isLoading: false,
};

export default CommentForm;
