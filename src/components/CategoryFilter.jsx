import PropTypes from 'prop-types';
import { FiTag, FiX } from 'react-icons/fi';

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => (
  <div className="category-filter" role="group" aria-label="Filter berdasarkan kategori">
    <div className="category-filter-header">
      <FiTag />
      <span>Kategori</span>
    </div>
    <div className="category-list">
      <button
        type="button"
        id="btn-category-all"
        className={`category-chip ${!selectedCategory ? 'category-chip--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        Semua
        {!selectedCategory && <FiX className="chip-remove" />}
      </button>
      {categories.map((cat) => (
        <button
          type="button"
          key={cat}
          id={`btn-category-${cat}`}
          className={`category-chip ${selectedCategory === cat ? 'category-chip--active' : ''}`}
          onClick={() => onSelect(selectedCategory === cat ? null : cat)}
          aria-pressed={selectedCategory === cat}
        >
          #{cat}
          {selectedCategory === cat && <FiX className="chip-remove" />}
        </button>
      ))}
    </div>
  </div>
);

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

CategoryFilter.defaultProps = {
  selectedCategory: null,
};

export default CategoryFilter;
