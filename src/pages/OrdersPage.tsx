import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { dbOrders } from '../services/db';
import { formatPKR, formatDate } from '../utils/format';
import { Package, Truck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const myOrders = await dbOrders.getMyOrders(user.id);
        setOrders(myOrders);
      } else {
        // Show demo / guest orders if any
        const all = await dbOrders.getAllOrders();
        setOrders(all.slice(0, 3));
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Shipped</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Confirmed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Order Placed</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
            Order Tracking
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
            My Artisan Orders
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track deliveries of authentic handmade handicrafts across Pakistan.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl h-40 border border-gray-200" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="font-cinzel text-lg font-bold text-[#12355B]">No Orders Placed Yet</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              When you purchase handwoven shawls, jewellery, or woodcrafts, they will appear here.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#12355B] text-white rounded-xl text-xs font-semibold hover:bg-[#2F5D50]"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500">Order ID: </span>
                    <span className="font-mono font-bold text-[#12355B] text-sm">{order.order_number}</span>
                    <span className="text-xs text-gray-400 ml-3">Placing Date: {formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.order_status)}
                    <span className="text-sm font-bold text-[#12355B] tabular-nums">
                      {formatPKR(order.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs">
                  {order.items?.map((it) => (
                    <div key={it.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <img src={it.product_image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-semibold text-gray-800">{it.product_name}</p>
                          <p className="text-gray-400 text-[11px]">Quantity: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-700 tabular-nums">{formatPKR(it.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-between text-[11px] text-gray-500">
                  <div>
                    <span>Delivery Address: </span>
                    <strong className="text-gray-700">{order.delivery_address}, {order.city}</strong>
                  </div>
                  <div className="mt-1 sm:mt-0">
                    <span>Payment: </span>
                    <strong className="text-gray-700 uppercase">{order.payment_method.replace('_', ' ')}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
