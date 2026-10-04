import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { dbCart } from '../services/db';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  freeDeliveryThreshold: number;
  remainingForFreeDelivery: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const FREE_DELIVERY_THRESHOLD = 5000;
export const STANDARD_DELIVERY_FEE = 350;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    const cart = await dbCart.getCart(user?.id);
    setItems(cart);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const dismissToast = () => setToastMessage(null);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const updated = await dbCart.addToCart(product, quantity, user?.id);
    setItems(updated);
    showToast(`Added "${product.name}" to cart`);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const updated = await dbCart.updateQuantity(productId, quantity, user?.id);
    setItems(updated);
  };

  const removeFromCart = async (productId: string) => {
    const item = items.find(i => i.product_id === productId);
    const updated = await dbCart.removeFromCart(productId, user?.id);
    setItems(updated);
    if (item) {
      showToast(`Removed "${item.product.name}" from cart`);
    }
  };

  const clearCart = async () => {
    await dbCart.clearCart(user?.id);
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal === 0 ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE);
  const total = subtotal + deliveryFee;
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      remainingForFreeDelivery,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toastMessage,
      dismissToast
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
