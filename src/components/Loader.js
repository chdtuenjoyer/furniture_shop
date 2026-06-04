import React from 'react';
import './Loader.css';

export default function Loader({ text = 'Завантаження...' }) {
  return (
    <div className="loader">
      <div className="loader__spinner">
        <div /><div /><div />
      </div>
      {text && <p className="loader__text">{text}</p>}
    </div>
  );
}
