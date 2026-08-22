import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('smart_mess_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('smart_mess_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, category: item.category, imageUrl: item.imageUrl, availableQuantity: item.availableQuantity, quantity: 1 }];
    });
  };

  const updateQuantity = (menuItemId, delta) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.menuItemId === menuItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: Math.min(newQty, i.availableQuantity) } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (menuItemId) => {
    setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCredits = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalCredits, totalItemsCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
