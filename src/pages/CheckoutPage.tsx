import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { dbOrders } from '../services/db';
import { formatPKR } from '../utils/format';
import { PaymentMethod, OrderItem } from '../types';
import { 
  ShieldCheck, Truck, CreditCard, Banknote, Smartphone, 
  ArrowLeft, CheckCircle2, Lock 
} from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().min(10, 'Valid Pakistani phone number required (e.g. 03001234567)'),
  city: z.string().min(2, 'City name is required'),
  address: z.string().min(8, 'Detailed street and house address is required'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['cod', 'bank_transfer', 'easypaisa_jazzcash'])
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.full_name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      address: user?.address || '',
      notes: '',
      paymentMethod: 'cod'
    }
  });

  const selectedPaymentMethod = watch('paymentMethod');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 px-4 text-center">
        <h2 className="font-cinzel text-2xl font-bold text-[#12355B]">Your Bag is Empty</h2>
        <p className="text-xs text-gray-500 mt-2">Add handicrafts to your shopping bag before proceeding to checkout.</p>
        <Link to="/shop" className="mt-4 inline-block px-6 py-2.5 bg-[#12355B] text-white rounded-xl text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    setOrderError(null);
    try {
      const orderItems: OrderItem[] = items.map(item => ({
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        order_id: '',
        product_id: item.product_id,
        seller_id: item.product.seller_id,
        product_name: item.product.name,
        product_image: item.product.image_urls[0] || '',
        unit_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity
      }));

      const newOrder = await dbOrders.createOrder({
        user_id: user?.id || 'guest-' + Date.now(),
        full_name: data.fullName,
        phone: data.phone,
        city: data.city,
        delivery_address: data.address,
        notes: data.notes,
        total_amount: total,
        payment_method: data.paymentMethod as PaymentMethod,
        items: orderItems
      });

      // Navigate to success
      navigate(`/order-success/${newOrder.order_number}`);
    } catch (err: any) {
      console.error('Order creation error', err);
      setOrderError(err.message || 'Failed to place order. Please check your information and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-[#12355B] hover:text-[#B85C38] font-semibold mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Bag</span>
          </Link>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B]">
            Checkout & Delivery Information
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete your order to receive authentic handicrafts directly from Gilgit-Baltistan.
          </p>
        </div>

        {orderError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
            {orderError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping & Payment Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-cinzel text-base font-bold text-[#12355B] pb-3 border-b border-gray-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B85C38]" />
                <span>1. Delivery Destination</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="e.g. Asad Ullah Khan"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Active WhatsApp) *</label>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="e.g. 0300 1234567"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City / Region (Across Pakistan) *</label>
                <input
                  type="text"
                  {...register('city')}
                  placeholder="e.g. Islamabad, Lahore, Karachi, Rawalpindi, Peshawar, Gilgit"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                />
                {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Complete Street Address *</label>
                <textarea
                  rows={2}
                  {...register('address')}
                  placeholder="House #, Street #, Sector/Area, Landmark..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Order Notes (Optional)</label>
                <input
                  type="text"
                  {...register('notes')}
                  placeholder="Any special packing or gift message instructions..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-cinzel text-base font-bold text-[#12355B] pb-3 border-b border-gray-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#2F5D50]" />
                <span>2. Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'cod'
                      ? 'border-[#12355B] bg-blue-50/30 ring-1 ring-[#12355B]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="cod"
                    {...register('paymentMethod')}
                    className="mt-0.5 accent-[#12355B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-xs text-gray-900">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Pay cash upon delivery at your doorstep anywhere in Pakistan. Recommended for first-time buyers.
                    </p>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'bank_transfer'
                      ? 'border-[#12355B] bg-blue-50/30 ring-1 ring-[#12355B]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="bank_transfer"
                    {...register('paymentMethod')}
                    className="mt-0.5 accent-[#12355B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-xs text-gray-900">
                      <ShieldCheck className="w-4 h-4 text-[#12355B]" />
                      <span>Direct Bank Transfer</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Transfer directly to Hunza Heritage official artisan bank account (Meezan Bank or HBL). Account details provided after checkout.
                    </p>
                    {selectedPaymentMethod === 'bank_transfer' && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 text-[11px] space-y-1 text-gray-700">
                        <p><strong>Bank:</strong> Meezan Bank Limited (Gilgit Branch)</p>
                        <p><strong>Title:</strong> Hunza Heritage Craft Cooperative</p>
                        <p><strong>Account:</strong> 01020304050607</p>
                        <p><strong>IBAN:</strong> PK65MEZN0001020304050607</p>
                      </div>
                    )}
                  </div>
                </label>

                {/* EasyPaisa / JazzCash */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'easypaisa_jazzcash'
                      ? 'border-[#12355B] bg-blue-50/30 ring-1 ring-[#12355B]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="easypaisa_jazzcash"
                    {...register('paymentMethod')}
                    className="mt-0.5 accent-[#12355B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-xs text-gray-900">
                      <Smartphone className="w-4 h-4 text-[#B85C38]" />
                      <span>EasyPaisa / JazzCash Mobile Account</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Instant mobile wallet payment. Send screenshot to our customer desk on WhatsApp (+92 312 9876543).
                    </p>
                    {selectedPaymentMethod === 'easypaisa_jazzcash' && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 text-[11px] space-y-1 text-gray-700">
                        <p><strong>EasyPaisa / JazzCash No:</strong> 0312-9876543</p>
                        <p><strong>Account Name:</strong> Hunza Heritage Crafts</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Review & Submit (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm sticky top-28 space-y-4">
              <h2 className="font-cinzel text-base font-bold text-[#12355B] pb-3 border-b border-gray-100">
                Your Order Items ({items.length})
              </h2>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3">
                    <img
                      src={i.product.image_urls[0] || ''}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{i.product.name}</p>
                      <p className="text-gray-500 text-[11px]">Qty: {i.quantity} × {formatPKR(i.product.price)}</p>
                    </div>
                    <span className="font-bold text-gray-800 tabular-nums">
                      {formatPKR(i.product.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nationwide Courier Delivery</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatPKR(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#12355B]">Total Payable</span>
                <span className="font-cinzel text-2xl font-bold text-[#12355B] tabular-nums">
                  {formatPKR(total)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#D4A017]" />
                <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              </button>

              <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted Order Processing & Artisan Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
