import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="notfound page-enter">
      <div className="container notfound__inner">
        <div className="orb notfound__orb" />
        <h1 className="notfound__code">404</h1>
        <h2 className="notfound__title">Сторінку не знайдено</h2>
        <p className="notfound__text">
          Схоже, ця сторінка переїхала в новий дім 🏠<br />
          Але ми знайдемо для вас щось краще.
        </p>
        <Link to="/" className="btn btn-primary">На головну</Link>
      </div>
    </main>
  );
}
