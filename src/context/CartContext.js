import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'luxewood_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i.id === action.product.id);
      if (exists) {
        return state.map(i =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      if (action.qty <= 0) return state.filter(i => i.id !== action.id);
      return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i);
    case 'CLEAR':
      return [];
    case 'INIT':
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Синхронізація з localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart    = (product)     => dispatch({ type: 'ADD', product });
  const removeFromCart = (id)        => dispatch({ type: 'REMOVE', id });
  const updateQty    = (id, qty)     => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart    = ()            => dispatch({ type: 'CLEAR' });

  const totalItems   = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice   = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const isInCart     = (id)          => items.some(i => i.id === id);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQty, clearCart,
      totalItems, totalPrice, isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
