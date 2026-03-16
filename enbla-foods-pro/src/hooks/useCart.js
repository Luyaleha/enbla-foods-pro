import { useState, useEffect } from 'react';

export const useCart = () => {
  // LOAD: This function runs ONLY ONCE when the app starts
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('enbla_cart');
      if (savedCart) {
        console.log("Found saved cart!", JSON.parse(savedCart));
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Failed to load cart", error);
    }
    return []; // Return empty array if nothing found
  });

  // SAVE: This runs every time the 'cart' variable changes
  useEffect(() => {
    localStorage.setItem('enbla_cart', JSON.stringify(cart));
    console.log("Cart saved to LocalStorage");
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return { cart, addToCart, removeFromCart, total };
  const clearCart = () => {
  setCart([]);
};
// Then add it to your return statement:
return { cart, addToCart, removeFromCart, clearCart, total };
};