import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { items, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const { isAuth, getAuthHeaders } = useAuth();
  const [ordered, setOrdered] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (n) =>
    new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(n);

  const handleOrder = async () => {
    if (!isAuth) {
      navigate('/profile');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok) {
        setOrderError(data.error || 'Не вдалося оформити замовлення');
      } else {
        clearCart();
        setOrdered(true);
      }
    } catch (err) {
      setOrderError('Помилка мережі');
    } finally {
      setLoading(false);
    }
  };

  if (ordered) return (
    <main className="cart-page page-enter">
      <div className="container">
        <div className="cart-page__success">
          <div className="cart-page__success-icon">✓</div>
          <h2>Замовлення оформлено!</h2>
          <p>Дякуємо за покупку. Наш менеджер зв'яжеться з вами найближчим часом.</p>
          <Link to="/catalog" className="btn btn-primary">Продовжити покупки</Link>
        </div>
      </div>
    </main>
  );

  if (items.length === 0) return (
    <main className="cart-page page-enter">
      <div className="container">
        <div className="cart-page__empty">
          <p className="cart-page__empty-icon">🛒</p>
          <h2>Кошик порожній</h2>
          <p>Додайте товари, що вам сподобались</p>
          <Link to="/catalog" className="btn btn-primary">До каталогу</Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="cart-page page-enter">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="section-title">Ваш <span>кошик</span></h1>
          <button className="btn btn-ghost" onClick={clearCart}>Очистити все</button>
        </div>

        <div className="cart-page__layout">
          {/* Items */}
          <div className="cart-page__items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/product/${item.id}`} className="cart-item__img-wrap">
                  <img src={item.image} alt={item.title} className="cart-item__img" />
                </Link>
                <div className="cart-item__info">
                  <p className="cart-item__cat">{item.category}</p>
                  <Link to={`/product/${item.id}`} className="cart-item__title">{item.title}</Link>
                  <p className="cart-item__price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item__controls">
                  <div className="cart-item__qty">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Менше">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Більше">+</button>
                  </div>
                  <p className="cart-item__subtotal">{formatPrice(item.price * item.qty)}</p>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Видалити">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-page__summary">
            <h3 className="cart-page__summary-title">Підсумок</h3>
            <div className="cart-page__summary-row">
              <span>Товарів</span>
              <span>{totalItems} шт.</span>
            </div>
            <div className="cart-page__summary-row">
              <span>Доставка</span>
              <span className="cart-page__free">Безкоштовно</span>
            </div>
            <div className="cart-page__summary-row cart-page__summary-row--total">
              <span>Разом</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            {orderError && <p className="cart-page__error">{orderError}</p>}
            <button className="btn btn-primary cart-page__order-btn" onClick={handleOrder} disabled={loading}>
              {loading ? 'Оформлюємо...' : isAuth ? 'Оформити замовлення' : 'Увійдіть, щоб оформити'}
            </button>
            <Link to="/catalog" className="btn btn-ghost cart-page__continue">
              ← Продовжити покупки
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
