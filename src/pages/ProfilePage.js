import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

function LoginForm({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onLogin(form);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Вхід до акаунту</h2>
      <form className="auth-form__fields" onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <label>Email</label>
          <input type="email" placeholder="your@email.com" required
                 value={form.email}
                 onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="auth-form__field">
          <label>Пароль</label>
          <input type="password" placeholder="••••••••" required
                 value={form.password}
                 onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        {error && <p className="auth-form__error">{error}</p>}
        <button type="submit" className="btn btn-primary auth-form__submit" disabled={loading}>
          {loading ? 'Завантаження...' : 'Увійти'}
        </button>
      </form>
      <p className="auth-form__switch">
        Немає акаунту? <button onClick={onSwitch}>Зареєструватися</button>
      </p>
    </div>
  );
}

function RegisterForm({ onRegister, onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Паролі не збігаються');
      return;
    }
    if (form.password.length < 6) {
      setError('Пароль має бути не менше 6 символів');
      return;
    }
    setLoading(true);
    const result = await onRegister(form);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Реєстрація</h2>
      <form className="auth-form__fields" onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <label>Ім'я</label>
          <input type="text" placeholder="Ваше ім'я" required
                 value={form.name}
                 onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="auth-form__field">
          <label>Email</label>
          <input type="email" placeholder="your@email.com" required
                 value={form.email}
                 onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="auth-form__field">
          <label>Пароль</label>
          <input type="password" placeholder="Мінімум 6 символів" required
                 value={form.password}
                 onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        <div className="auth-form__field">
          <label>Підтвердити пароль</label>
          <input type="password" placeholder="Повторіть пароль" required
                 value={form.confirm}
                 onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
        </div>
        {error && <p className="auth-form__error">{error}</p>}
        <button type="submit" className="btn btn-primary auth-form__submit" disabled={loading}>
          {loading ? 'Завантаження...' : 'Зареєструватися'}
        </button>
      </form>
      <p className="auth-form__switch">
        Вже є акаунт? <button onClick={onSwitch}>Увійти</button>
      </p>
    </div>
  );
}

function ProfileDashboard({ user, onLogout }) {
  return (
    <div className="profile-dash">
      <div className="profile-dash__hero">
        <img src={user.avatar} alt={user.name} className="profile-dash__avatar" />
        <div>
          <h2 className="profile-dash__name">{user.name}</h2>
          <p className="profile-dash__email">{user.email}</p>
          <p className="profile-dash__joined">
            Учасник з {new Date(user.joinedAt).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      <div className="profile-dash__cards">
        <div className="profile-dash__card">
          <span className="profile-dash__card-icon">📦</span>
          <span className="profile-dash__card-num">{user.orders?.length ?? 0}</span>
          <span className="profile-dash__card-label">Замовлень</span>
        </div>
        <div className="profile-dash__card">
          <span className="profile-dash__card-icon">❤️</span>
          <span className="profile-dash__card-num">0</span>
          <span className="profile-dash__card-label">Обраних</span>
        </div>
        <div className="profile-dash__card">
          <span className="profile-dash__card-icon">⭐</span>
          <span className="profile-dash__card-num">0</span>
          <span className="profile-dash__card-label">Відгуків</span>
        </div>
      </div>

      <div className="profile-dash__orders">
        <h3>Мої замовлення</h3>
        {user.orders?.length === 0 ? (
          <p className="profile-dash__no-orders">Ви ще не робили замовлень.</p>
        ) : (
          <div className="profile-dash__orders-list">
            {user.orders?.map(order => (
              <div key={order.id} className="profile-dash__order">
                <div className="profile-dash__order-header">
                  <span>Замовлення #{order.id}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('uk-UA')}</span>
                </div>
                <div className="profile-dash__order-summary">
                  <span>Сума: {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(order.totalPrice)}</span>
                  <span>Товарів: {order.items.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn-outline profile-dash__logout" onClick={onLogout}>
        Вийти з акаунту
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuth, login, register, logout } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  return (
    <main className="profile-page page-enter">
      <div className="container">
        {isAuth ? (
          <ProfileDashboard user={user} onLogout={logout} />
        ) : mode === 'login' ? (
          <LoginForm onLogin={login} onSwitch={() => setMode('register')} />
        ) : (
          <RegisterForm onRegister={register} onSwitch={() => setMode('login')} />
        )}
      </div>
    </main>
  );
}
