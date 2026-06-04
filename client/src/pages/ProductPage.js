import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const formatPrice = (n) =>
    new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(n);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="product-page"><Loader /></div>;
  if (error || !product) return (
    <div className="product-page product-page--error page-enter">
      <div className="container">
        <h2>Товар не знайдено 😔</h2>
        <Link to="/catalog" className="btn btn-primary">← Повернутися до каталогу</Link>
      </div>
    </div>
  );

  return (
    <main className="product-page page-enter">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="product-page__breadcrumb">
          <Link to="/">Головна</Link>
          <span>/</span>
          <Link to="/catalog">Каталог</Link>
          <span>/</span>
          <span>{product.title}</span>
        </nav>

        <div className="product-page__layout">
          {/* Image */}
          <div className="product-page__img-wrap">
            <img src={product.image} alt={product.title} className="product-page__img" />
          </div>

          {/* Info */}
          <div className="product-page__info">
            <p className="product-page__category">{product.category}</p>
            <h1 className="product-page__title">{product.title}</h1>

            {/* Rating */}
            <div className="product-page__rating">
              <div className="product-page__stars">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24"
                       fill={i <= Math.round(product.rating?.rate ?? 0) ? '#a78bfa' : 'none'}
                       stroke="#a78bfa" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="product-page__rating-num">{product.rating?.rate}</span>
              <span className="product-page__rating-count">({product.rating?.count} відгуків)</span>
            </div>

            <div className="product-page__price">{formatPrice(product.price)}</div>

            <p className="product-page__desc">{product.description}</p>

            {/* Qty + Add */}
            <div className="product-page__buy">
              <div className="product-page__qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Менше">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} aria-label="Більше">+</button>
              </div>
              <button
                className={`btn btn-primary product-page__add${added ? ' added' : ''}`}
                onClick={handleAdd}
              >
                {added ? '✓ Додано до кошика!' : 'Додати до кошика'}
              </button>
            </div>

            <Link to="/cart" className="btn btn-outline product-page__go-cart">
              Перейти до кошика →
            </Link>

            {/* Tags */}
            <div className="product-page__tags">
              <span>✓ В наявності</span>
              <span>🚚 Безкоштовна доставка</span>
              <span>🔄 30 днів повернення</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
