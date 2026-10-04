import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPKR } from '../../utils/format';
import { X, Star, ShoppingBag, Heart, Check, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const images = product.image_urls.length > 0 ? product.image_urls : [];

  const handleAddToCart = async () => {
    setAdded(true);
    await addToCart(product, quantity);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-gray-200 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-black flex items-center justify-center shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-6 bg-neutral-50 flex flex-col justify-between">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm relative">
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Image Preview</span>
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx ? 'border-[#12355B] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="font-semibold text-[#2F5D50]">{product.category_name || 'Handicrafts'}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#B85C38]">
                  <MapPin className="w-3 h-3" />
                  <span>{product.origin_city}</span>
                </span>
              </div>

              <h2 className="font-cinzel text-xl font-bold text-[#12355B]">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.review_count} artisan reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#12355B] tabular-nums">
                  {formatPKR(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-gray-400 line-through tabular-nums">
                    {formatPKR(product.original_price)}
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                <p><strong>Material:</strong> {product.material}</p>
                <p><strong>Artisan / Origin:</strong> {product.seller_name || 'Gilgit-Baltistan Guild'}</p>
                <p><strong>Availability:</strong> {product.stock_quantity > 0 ? `${product.stock_quantity} available in stock` : 'Out of stock'}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-semibold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#12355B] hover:bg-[#2F5D50] text-white'
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{added ? 'Added to Bag' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    inWishlist
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-gray-300 text-gray-600 hover:text-[#B85C38]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="mt-3 text-center">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-[#B85C38] hover:text-[#12355B] inline-flex items-center gap-1"
                >
                  <span>View Full Product Story & Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
