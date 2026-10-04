import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/format';
import { 
  ShoppingBag, Trash2, ArrowRight, Truck, ShieldCheck, 
  Sparkles, ArrowLeft 
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    items, itemCount, subtotal, deliveryFee, total, 
    remainingForFreeDelivery, freeDeliveryThreshold,
    updateQuantity, removeFromCart, clearCart 
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#12355B] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-[#12355B]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Support the indigenous weavers and master craftsmen of Gilgit-Baltistan by exploring our authentic collections.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            <span>Explore Handcrafted Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
              Your Bag
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
              Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-[#12355B]">
              <Truck className="w-4 h-4 text-[#D4A017]" />
              {remainingForFreeDelivery === 0 ? (
                <span className="text-emerald-700">Congratulations! You unlocked Free Nationwide Delivery!</span>
              ) : (
                <span>Add <strong>{formatPKR(remainingForFreeDelivery)}</strong> more to get <strong>Free Delivery</strong></span>
              )}
            </span>
            <span className="text-gray-500 font-bold tabular-nums">{freeDeliveryPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                remainingForFreeDelivery === 0 ? 'bg-emerald-600' : 'bg-[#D4A017]'
              }`}
              style={{ width: `${freeDeliveryPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart items list (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const primaryImg = item.product.image_urls[0] || '';
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                >
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 block border border-gray-100"
                  >
                    <img
                      src={primaryImg}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                      {item.product.origin_city}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="block font-semibold text-sm text-[#12355B] hover:text-[#B85C38] transition-colors mt-0.5"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      Material: {item.product.material}
                    </p>
                    <p className="text-xs font-bold text-[#12355B] mt-1 tabular-nums">
                      {formatPKR(item.product.price)} each
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="px-3 py-1.5 text-xs text-gray-600 hover:text-black font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-gray-800 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock_quantity}
                      className="px-3 py-1.5 text-xs text-gray-600 hover:text-black font-bold disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className="text-sm font-bold text-[#12355B] tabular-nums">
                      {formatPKR(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-gray-400 hover:text-red-600 p-1 sm:mt-2 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex justify-between items-center text-xs">
              <Link
                to="/shop"
                className="text-[#12355B] font-semibold hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-28 space-y-4">
              <h2 className="font-cinzel text-lg font-bold text-[#12355B] pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (Across Pakistan)</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatPKR(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Artisan Guild Contribution</span>
                  <span className="text-emerald-700 font-semibold">Included</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#12355B]">Total Amount</span>
                <span className="font-cinzel text-2xl font-bold text-[#12355B] tabular-nums">
                  {formatPKR(total)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery / EasyPaisa / Bank Transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <span>100% Authentic Handcrafted Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
