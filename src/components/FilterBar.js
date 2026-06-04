import React from 'react';
import './FilterBar.css';

export default function FilterBar({ categories, active, onSelect, sortBy, onSortChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__cats">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-bar__cat${active === cat ? ' active' : ''}`}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <select
        className="filter-bar__sort"
        value={sortBy}
        onChange={e => onSortChange(e.target.value)}
        aria-label="Сортування"
      >
        <option value="default">За замовчуванням</option>
        <option value="price-asc">Ціна: зростання</option>
        <option value="price-desc">Ціна: спадання</option>
        <option value="rating">За рейтингом</option>
      </select>
    </div>
  );
}
