import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlusCircle, FiTag, FiType, FiAlignLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createThread } from '../store/threadsSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateThreadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.threads);

  const [form, setForm] = useState({ title: '', body: '', category: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Judul dan isi thread wajib diisi');
      return;
    }
    const result = await dispatch(createThread(form));
    if (createThread.fulfilled.match(result)) {
      toast.success('Thread berhasil dibuat!');
      navigate(`/threads/${result.payload.id}`);
    } else {
      toast.error('Gagal membuat thread. Coba lagi.');
    }
  };

  return (
    <div className="create-thread-page">
      <div className="create-thread-container">
        <div className="page-header">
          <h1 className="page-title">
            <FiPlusCircle />
            Buat Thread Baru
          </h1>
          <p className="page-subtitle">Mulai diskusi baru dengan komunitas</p>
        </div>

        <form id="form-create-thread" className="thread-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="input-thread-title" className="form-label">
              <FiType /> Judul Thread
            </label>
            <input
              id="input-thread-title"
              type="text"
              name="title"
              className="form-input"
              placeholder="Tulis judul yang menarik..."
              value={form.title}
              onChange={handleChange}
              required
              maxLength={200}
            />
            <span className="input-hint">{form.title.length}/200 karakter</span>
          </div>

          <div className="form-group">
            <label htmlFor="input-thread-category" className="form-label">
              <FiTag /> Kategori <span className="form-optional">(opsional)</span>
            </label>
            <input
              id="input-thread-category"
              type="text"
              name="category"
              className="form-input"
              placeholder="Contoh: teknologi, sains, hiburan..."
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-thread-body" className="form-label">
              <FiAlignLeft /> Isi Thread
            </label>
            <textarea
              id="input-thread-body"
              name="body"
              className="form-input form-textarea"
              placeholder="Tulis konten diskusi Anda di sini..."
              value={form.body}
              onChange={handleChange}
              required
              rows={10}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              id="btn-cancel-thread"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-thread"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size={20} /> : (
                <>
                  <FiPlusCircle />
                  Buat Thread
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateThreadPage;
