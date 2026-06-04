import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './Home.css';

const FEATURES = [
  { icon: '🪵', title: 'Натуральні матеріали', text: 'Лише перевірена деревина, шкіра та тканини без шкідливих речовин.' },
  { icon: '🚚', title: 'Безкоштовна доставка', text: 'Доставляємо по всій Україні при замовленні від 5 000 грн.' },
  { icon: '🔄', title: '30 днів на повернення', text: 'Не підійшло? Повернемо кошти без зайвих питань.' },
  { icon: '🛠️', title: 'Гарантія 2 роки', text: 'На всі вироби офіційна гарантія від виробника.' },
];

export default function Home() {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 4);

  return (
    <main className="home page-enter">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="orb hero__orb1" />
        <div className="orb hero__orb2" />
        <div className="hero__content container">
          <div className="hero__text">
            <p className="hero__eyebrow">Колекція 2025</p>
            <h1 className="hero__title">
              Меблі, що<br />
              <span>розкажуть<br />вашу історію</span>
            </h1>
            <p className="hero__sub">
              Преміум меблі ручної роботи. Від ескізу до вашого дому — з любов'ю до деталей.
            </p>
            <div className="hero__actions">
              <Link to="/catalog" className="btn btn-primary">Переглянути каталог</Link>
              <Link to="/catalog?category=дивани" className="btn btn-outline">Дивани</Link>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__img-wrap">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85"
                alt="Преміум диван"
                className="hero__img"
              />
              <div className="hero__img-badge">
                <span className="hero__img-badge-num">500+</span>
                <span>моделей у каталозі</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features container">
        {FEATURES.map(f => (
          <div key={f.title} className="features__item">
            <span className="features__icon">{f.icon}</span>
            <div>
              <h4 className="features__title">{f.title}</h4>
              <p className="features__text">{f.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Featured Products ── */}
      <section className="featured container">
        <div className="featured__header">
          <h2 className="section-title">Популярні <span>товари</span></h2>
          <Link to="/catalog" className="btn btn-outline">Всі товари →</Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="featured__grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Banner ── */}
      <section className="banner container">
        <div className="banner__inner">
          <div className="orb banner__orb" />
          <div className="banner__text">
            <h2 className="section-title">Знижка <span>−15%</span></h2>
            <p>На перше замовлення при реєстрації. Тільки до кінця місяця.</p>
            <Link to="/profile" className="btn btn-primary">Зареєструватися</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
