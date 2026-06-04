import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = isInCart(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formatPrice = (n) =>
    new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(n);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__img-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-card__img"
          loading="lazy"
        />
        <div className="product-card__overlay">
          <button
            className={`product-card__add${inCart ? ' in-cart' : ''}${added ? ' just-added' : ''}`}
            onClick={handleAdd}
            aria-label="Додати до кошика"
          >
            {added ? '✓ Додано' : inCart ? 'В кошику' : 'До кошика'}
          </button>
        </div>
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__footer">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <div className="product-card__rating">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#a78bfa">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>{product.rating?.rate ?? '—'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
