import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPKR } from '../../utils/format';
import { Heart, ShoppingBag, Eye, Star, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.image_urls[0] || '';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-[#12355B]/10 hover:border-[#B85C38]/40 hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Product Image Stage */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/3] bg-neutral-100 overflow-hidden block">
        {!imageError && primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#12355B]/10 to-[#B85C38]/10 text-[#12355B]">
            <MapPin className="w-8 h-8 text-[#B85C38] mb-1" />
            <span className="text-xs font-semibold text-center">{product.name}</span>
            <span className="text-[10px] text-gray-500 mt-1">{product.origin_city}</span>
          </div>
        )}

        {/* Subtle Discount / Limited Run Tag */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-[#B85C38] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            Save {discountPercent}%
          </div>
        )}

        {/* Stock Alert */}
        {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-amber-600/90 text-white text-[10px] font-medium px-2 py-0.5 rounded">
            Only {product.stock_quantity} left
          </div>
        )}

        {/* Action Overlay Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              inWishlist
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 text-gray-600 hover:text-[#B85C38] hover:bg-white'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="w-8 h-8 rounded-full bg-white/90 text-gray-600 hover:text-[#12355B] hover:bg-white flex items-center justify-center transition-colors shadow-sm"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata as per frontend design guidelines */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1.5">
            <span className="font-medium text-[#2F5D50] truncate">{product.category_name || 'Handicrafts'}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-gray-600 shrink-0">
              <MapPin className="w-2.5 h-2.5 text-[#B85C38]" />
              <span>{product.origin_city.split(',')[0]}</span>
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-[#B85C38] transition-colors">
            <h3 className="font-semibold text-sm text-[#1F2937] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-gray-700 text-xs">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400 text-[11px]">({product.review_count})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#12355B] tabular-nums">
              {formatPKR(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[11px] text-gray-400 line-through tabular-nums">
                {formatPKR(product.original_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock_quantity === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm ${
              product.stock_quantity === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAdding
                ? 'bg-emerald-700 text-white'
                : 'bg-[#12355B] text-white hover:bg-[#2F5D50]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock_quantity === 0 ? 'Out of Stock' : isAdding ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
