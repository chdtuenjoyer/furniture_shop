import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { totalItems } = useCart();
  const { user, isAuth } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Закрити меню при кліку за межами
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">✦</span>
          <span className="header__logo-text">LuxeWood</span>
        </Link>

        {/* Nav */}
        <nav className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}
             onClick={e => e.stopPropagation()}>
          <NavLink to="/" className={({ isActive }) => `header__link${isActive ? ' active' : ''}`}
                   onClick={() => setMenuOpen(false)} end>
            Головна
          </NavLink>
          <NavLink to="/catalog" className={({ isActive }) => `header__link${isActive ? ' active' : ''}`}
                   onClick={() => setMenuOpen(false)}>
            Каталог
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `header__link${isActive ? ' active' : ''}`}
                   onClick={() => setMenuOpen(false)}>
            {isAuth ? user?.name : 'Профіль'}
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <Link to="/cart" className="header__cart" aria-label="Кошик">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="header__badge">{totalItems > 99 ? '99+' : totalItems}</span>
            )}
          </Link>

          {/* Burger */}
          <button className={`header__burger${menuOpen ? ' open' : ''}`}
                  aria-label="Меню"
                  onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
