import { useState, useEffect } from 'react';

export const useCart = () => {
  // 1. Initialize State from LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('enbla_cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Failed to load cart", error);
    }
    return []; 
  });

  // 2. Sync State to LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('enbla_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Logic: Add to Cart
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

  // 4. Logic: Remove Item
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // 5. Logic: Clear Entire Cart (Crucial for Checkout)
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('enbla_cart');
    console.log("Cart Cleared Successfully");
  };

  // 6. Calculation: Total Price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 7. FINAL RETURN (Only one return allowed!)
  return { 
    cart, 
    addToCart, 
    removeFromCart, 
    clearCart, // Make sure this is exported
    total 
  };
};