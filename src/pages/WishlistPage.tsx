import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { items, itemCount } = useWishlist();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-[#12355B]">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Save unique handcrafted pieces you love from Gilgit-Baltistan to revisit later.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl text-xs font-semibold"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
            Curated Treasures
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
            My Wishlist ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review and move your favorite mountain handicrafts to your shopping bag.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      </div>
    </div>
  );
};
