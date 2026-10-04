import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product, Review } from '../types';
import { dbProducts, dbReviews } from '../services/db';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatPKR, formatDate } from '../utils/format';
import { 
  Star, Heart, ShoppingBag, Truck, ShieldCheck, MapPin, 
  Sparkles, Check, ArrowLeft, RefreshCw, Send, User 
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState(user?.full_name || '');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      if (!slug) return;
      try {
        const found = await dbProducts.getBySlug(slug);
        if (found) {
          setProduct(found);
          const [revs, allProds] = await Promise.all([
            dbReviews.getByProduct(found.id),
            dbProducts.getAll('approved')
          ]);
          setReviews(revs);
          setRelatedProducts(
            allProds.filter(p => p.id !== found.id && p.category_id === found.category_id).slice(0, 4)
          );
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#12355B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-cinzel text-gray-700 text-sm">Carrying treasures from the valleys...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 px-4 text-center">
        <h2 className="font-cinzel text-2xl font-bold text-[#12355B]">Craft Not Found</h2>
        <p className="text-sm text-gray-600 mt-2">The requested handicraft does not exist or has been retired.</p>
        <Link to="/shop" className="mt-6 inline-block px-6 py-2.5 bg-[#12355B] text-white rounded-xl text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const images = product.image_urls.length > 0 ? product.image_urls : [];

  const handleAddToCart = async () => {
    setAddedAnimation(true);
    await addToCart(product, quantity);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const newRev = await dbReviews.addReview({
        user_id: user?.id || 'guest-' + Date.now(),
        user_name: reviewName.trim() || user?.full_name || 'Artisan Supporter',
        product_id: product.id,
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      setReviews([newRev, ...reviews]);
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-[#12355B]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#12355B]">Shop</Link>
          <span>/</span>
          <span className="text-[#2F5D50] font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Contiguous PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-gray-200 shadow-inner relative">
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Product Photo</span>
                </div>
              )}

              {/* Badges */}
              {product.original_price && product.original_price > product.price && (
                <span className="absolute top-4 left-4 bg-[#B85C38] text-white text-xs font-bold px-2.5 py-1 rounded shadow-md">
                  Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx
                        ? 'border-[#12355B] scale-105 shadow-sm'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Contiguous Purchase Module (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="font-semibold text-[#2F5D50]">{product.category_name || 'Handicrafts'}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#B85C38]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{product.origin_city}</span>
                </span>
              </div>

              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.review_count} verified reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#12355B] tabular-nums">
                  {formatPKR(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-gray-400 line-through tabular-nums">
                    {formatPKR(product.original_price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Cultural & Material Specs */}
              <div className="mt-6 p-4 bg-[#FFF9F0] rounded-xl border border-[#12355B]/10 space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Material & Craft:</span>
                  <span className="font-medium text-right max-w-[240px]">{product.material}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200/60 pt-2">
                  <span className="font-semibold text-gray-500">Artisan / Guild:</span>
                  <span className="font-medium text-[#B85C38]">{product.seller_name || 'Bibi Fatima / Hunza Guild'}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200/60 pt-2">
                  <span className="font-semibold text-gray-500">Stock Availability:</span>
                  <span className="font-medium text-emerald-700">
                    {product.stock_quantity > 0 ? `${product.stock_quantity} available in mountain inventory` : 'Made to order'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-sm text-gray-600 hover:text-black font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-semibold text-gray-800 tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3.5 py-2.5 text-sm text-gray-600 hover:text-black font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedAnimation
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#12355B] hover:bg-[#2F5D50] text-white'
                  }`}
                >
                  {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{addedAnimation ? 'Added to Bag' : 'Add to Bag'}</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors ${
                    inWishlist
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-gray-300 text-gray-600 hover:text-[#B85C38]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                className="w-full py-3 px-4 rounded-xl bg-[#D4A017] hover:bg-[#B85C38] text-[#12355B] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Instant Checkout / Buy Now
              </button>

              {/* Trust markers */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-[11px] text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B85C38] shrink-0" />
                  <span>Cash on Delivery nationwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2F5D50] shrink-0" />
                  <span>100% Certified authentic craft</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-14 bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#12355B]">
                Customer Reviews & Craft Appreciation
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Read direct feedback from buyers who cherish Gilgit-Baltistan artisanal crafts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-[#12355B]">{product.rating.toFixed(1)}</div>
              <div>
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-[11px] text-gray-400">{reviews.length} reviews submitted</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Reviews List (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-6">
                  No reviews yet for this handicraft. Be the first to share your appreciation!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#12355B]/10 text-[#12355B] font-bold text-xs flex items-center justify-center">
                          {rev.user_name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-gray-800">{rev.user_name}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">{formatDate(rev.created_at)}</span>
                    </div>

                    <div className="flex items-center text-amber-500 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a review (1 Col) */}
            <div className="bg-[#FFF9F0] p-6 rounded-xl border border-[#12355B]/10 h-fit">
              <h3 className="font-cinzel text-sm font-bold text-[#12355B] mb-3">
                Leave an Artisan Review
              </h3>

              {reviewSuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-xs flex items-center gap-2 border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your review has been published.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Fatima Tariq"
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#12355B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Your Feedback</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe the texture, embroidery quality, or packaging..."
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#12355B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 px-4 bg-[#12355B] text-white hover:bg-[#2F5D50] transition-colors rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
                Complementary Pieces
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#12355B]">
                More from {product.category_name || 'This Collection'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
