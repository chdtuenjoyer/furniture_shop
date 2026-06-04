import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-icon">✦</span>
            <span>LuxeWood</span>
          </div>
          <p className="footer__tagline">Меблі, що розповідають вашу історію</p>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4>Магазин</h4>
            <Link to="/catalog">Каталог</Link>
            <Link to="/catalog?category=дивани">Дивани</Link>
            <Link to="/catalog?category=крісла">Крісла</Link>
            <Link to="/catalog?category=столи">Столи</Link>
          </div>
          <div className="footer__col">
            <h4>Аккаунт</h4>
            <Link to="/profile">Мій профіль</Link>
            <Link to="/cart">Кошик</Link>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} LuxeWood. Всі права захищені.</p>
      </div>
    </footer>
  );
}
