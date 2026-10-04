import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../types';
import { dbOrders } from '../services/db';
import { formatPKR, formatDate } from '../utils/format';
import { 
  CheckCircle2, Package, Truck, ArrowRight, Home, 
  MapPin, Phone, Calendar, ShieldCheck 
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderNumber) {
        const found = await dbOrders.getOrderByNumber(orderNumber);
        setOrder(found);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-14 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-lg text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38]">
          Order Confirmed
        </span>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
          Shukriya! Your Order is Received
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
          Your order has been forwarded to our artisan coordination center in Gilgit-Baltistan. Handcrafted with care and preparing for dispatch.
        </p>

        {/* Order Reference Box */}
        <div className="mt-6 p-4 bg-[#FFF9F0] rounded-xl border border-[#12355B]/10 inline-block text-left text-xs text-gray-700 min-w-[280px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500">Order Number:</span>
            <span className="font-bold text-[#12355B] font-mono text-sm">{orderNumber}</span>
          </div>
          {order && (
            <>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Date:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Payment:</span>
                <span className="font-semibold uppercase text-xs">{order.payment_method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-[#12355B]">
                <span>Total Amount:</span>
                <span>{formatPKR(order.total_amount)}</span>
              </div>
            </>
          )}
        </div>

        {/* Delivery Details */}
        {order && (
          <div className="mt-8 text-left border-t border-gray-100 pt-6 space-y-3 text-xs text-gray-600">
            <h3 className="font-cinzel font-bold text-sm text-[#12355B]">Delivery Destination</h3>
            <div className="bg-gray-50 p-4 rounded-xl space-y-1.5">
              <p><strong>Recipient:</strong> {order.full_name}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Address:</strong> {order.delivery_address}, {order.city}</p>
              {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
            </div>

            {/* Items summary */}
            {order.items && order.items.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Ordered Crafts ({order.items.length})</h4>
                <div className="space-y-2">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <img src={it.product_image} alt="" className="w-8 h-8 rounded object-cover" />
                        <span className="font-medium text-gray-800">{it.product_name} × {it.quantity}</span>
                      </div>
                      <span className="font-bold text-gray-700 tabular-nums">{formatPKR(it.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View in My Orders</span>
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
