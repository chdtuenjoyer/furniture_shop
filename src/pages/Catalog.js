import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import './Catalog.css';

const CATEGORY_TRANSLATION = {
  sofas: 'дивани',
  tables: 'столи',
  chairs: 'крісла',
  wardrobes: 'шафи',
  beds: 'спальня',
  nightstands: 'шафи',
  shelves: 'стелажі',
  desks: 'столи',
};

const FALLBACK_CATEGORIES = ['всі', 'дивани', 'крісла', 'столи', 'спальня', 'шафи', 'стелажі'];

function normalizeCategory(value) {
  if (!value) return value;
  const key = String(value).trim().toLowerCase();
  return CATEGORY_TRANSLATION[key] || value;
}

export default function Catalog() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = normalizeCategory(searchParams.get('category') || 'всі');
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');

  // Якщо в URL є ?category= — підхоплюємо
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(normalizeCategory(cat));
  }, [searchParams]);

  // Динамічні категорії — з API або fallback
  const categories = useMemo(() => {
    const apiCats = [...new Set(products.map(p => normalizeCategory(p.category)))].filter(Boolean);
    return ['всі', ...apiCats];
  }, [products]);

  const handleCategorySelect = (cat) => {
    const normalized = normalizeCategory(cat);
    setActiveCategory(normalized);
    if (normalized === 'всі') setSearchParams({});
    else setSearchParams({ category: normalized });
  };

  const filtered = useMemo(() => {
    let list = products;

    // Фільтр по категорії
    if (activeCategory && activeCategory !== 'всі') {
      list = list.filter(p =>
        normalizeCategory(p.category).toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Пошук
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // Сортування
    switch (sortBy) {
      case 'price-asc':  return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
      case 'rating':     return [...list].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
      default:           return list;
    }
  }, [products, activeCategory, sortBy, search]);

  return (
    <main className="catalog page-enter">
      <div className="container">
        <div className="catalog__header">
          <h1 className="section-title">Каталог <span>меблів</span></h1>
          <p className="catalog__sub">
            {loading ? '...' : `${products.length} позицій у наявності`}
          </p>
        </div>

        {/* Search */}
        <div className="catalog__search-wrap">
          <svg className="catalog__search-icon" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="catalog__search"
            type="text"
            placeholder="Пошук по назві або категорії..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Пошук товарів"
          />
          {search && (
            <button className="catalog__search-clear" onClick={() => setSearch('')} aria-label="Очистити">✕</button>
          )}
        </div>

        <FilterBar
          categories={categories.length > 1 ? categories : FALLBACK_CATEGORIES}
          active={activeCategory}
          onSelect={handleCategorySelect}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {loading ? (
          <Loader text="Завантаження товарів..." />
        ) : filtered.length === 0 ? (
          <div className="catalog__empty">
            <p>😔 Нічого не знайдено</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); handleCategorySelect('всі'); }}>
              Скинути фільтри
            </button>
          </div>
        ) : (
          <>
            <p className="catalog__count">{filtered.length} товарів</p>
            <div className="catalog__grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
