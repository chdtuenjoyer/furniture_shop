import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('success');
    setEmail('');
    setMessage('');
    window.setTimeout(() => setStatus(''), 5000);
  };

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-icon">✦</span>
            <span>LuxeWood</span>
          </div>
          <p className="footer__tagline">Меблі, що розповідають вашу історію</p>
          <div className="footer__socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer__social-link">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer__social-link">Facebook</a>
            <a href="https://t.me" target="_blank" rel="noreferrer" className="footer__social-link">Telegram</a>
          </div>
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

        <div className="footer__contact">
          <h4>Контакти</h4>
          <p>Напишіть нам повідомлення, і ми відповімо найближчим часом.</p>
          <form className="footer__form" onSubmit={handleSubmit}>
            <label className="footer__field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@mail.com"
                required
              />
            </label>
            <label className="footer__field">
              <span>Повідомлення</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ваше питання або замовлення"
                rows="4"
                required
              />
            </label>
            <button type="submit" className="btn btn-primary footer__submit">Відправити</button>
            {status === 'success' && (
              <p className="footer__status">Дякуємо! Повідомлення надіслано.</p>
            )}
          </form>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} LuxeWood. Всі права захищені.</p>
      </div>
    </footer>
  );
}
