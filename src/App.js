import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Header  from './components/Header';
import Footer  from './components/Footer';

import Home        from './pages/Home';
import Catalog     from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import CartPage    from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import NotFound    from './pages/NotFound';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/catalog"     element={<Catalog />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart"        element={<CartPage />} />
              <Route path="/profile"     element={<ProfilePage />} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
