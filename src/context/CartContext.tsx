'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryTotal: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  deliveryTotal: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('kss_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Could not parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('kss_cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i => 
          i.productId === item.productId 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(i => 
      i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
    ));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Basic generic logic: sum of unique seller delivery charges or just simple sum of all item delivery charges
  // For simplicity, summing item delivery charge multiplied by quantity or just flat per item type.
  const deliveryTotal = cart.reduce((sum, item) => sum + (item.deliveryCharge * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, deliveryTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
