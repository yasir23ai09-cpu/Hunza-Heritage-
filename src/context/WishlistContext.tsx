import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem, Product } from '../types';
import { dbWishlist } from '../services/db';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    const list = await dbWishlist.getWishlist(user?.id);
    setItems(list);
  };

  const isInWishlist = (productId: string) => {
    return items.some(i => i.product_id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    const res = await dbWishlist.toggleWishlist(product, user?.id);
    setItems(res.items);
    return res.isAdded;
  };

  const removeFromWishlist = async (productId: string) => {
    const list = await dbWishlist.removeFromWishlist(productId, user?.id);
    setItems(list);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      itemCount: items.length,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
