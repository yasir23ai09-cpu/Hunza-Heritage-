import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Product, Category, Order, SellerApplication, ContactMessage, UserProfile, OrderStatus, ProductStatus 
} from '../types';
import { 
  dbProducts, dbCategories, dbOrders, dbSellerApplications, dbContact, dbAuth 
} from '../services/db';
import { formatPKR, formatDate } from '../utils/format';
import { 
  Shield, Package, ShoppingBag, Users, Store, Mail, 
  CheckCircle2, XCircle, Trash2, Edit, Plus, Search, 
  Filter, Eye, ArrowUpRight, TrendingUp, Layers, Check, Clock 
} from 'lucide-react';

type AdminTab = 'overview' | 'products' | 'orders' | 'applications' | 'categories' | 'users' | 'messages';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | ProductStatus>('all');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [allProds, allCats, allOrds, allApps, allMsgs, allUsers] = await Promise.all([
        dbProducts.getAll(),
        dbCategories.getAll(),
        dbOrders.getAllOrders(),
        dbSellerApplications.getAll(),
        dbContact.getAll(),
        dbAuth.getAllUsers()
      ]);
      setProducts(allProds);
      setCategories(allCats);
      setOrders(allOrds);
      setApplications(allApps);
      setMessages(allMsgs);
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleApproveProduct = async (id: string) => {
    await dbProducts.updateStatus(id, 'approved');
    await loadAllAdminData();
  };

  const handleRejectProduct = async (id: string) => {
    await dbProducts.updateStatus(id, 'rejected');
    await loadAllAdminData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product permanently?')) {
      await dbProducts.delete(id);
      await loadAllAdminData();
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    await dbProducts.update(product.id, { is_featured: !product.is_featured });
    await loadAllAdminData();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await dbOrders.updateOrderStatus(orderId, status);
    await loadAllAdminData();
  };

  const handleApproveSeller = async (appId: string) => {
    await dbSellerApplications.updateStatus(appId, 'approved');
    await loadAllAdminData();
  };

  const handleRejectSeller = async (appId: string) => {
    await dbSellerApplications.updateStatus(appId, 'rejected');
    await loadAllAdminData();
  };

  const handleMarkMessageRead = async (msgId: string) => {
    await dbContact.updateStatus(msgId, 'read');
    await loadAllAdminData();
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await dbCategories.create({
      name: newCatName,
      slug,
      description: newCatDesc || 'Handcrafted items of Gilgit-Baltistan',
      image_url: newCatImage || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80'
    });
    setNewCatName('');
    setNewCatDesc('');
    setNewCatImage('');
    setIsAddingCat(false);
    await loadAllAdminData();
  };

  const handleDeleteCategory = async (catId: string) => {
    if (window.confirm('Delete this category?')) {
      await dbCategories.delete(catId);
      await loadAllAdminData();
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingProductCount = products.filter(p => p.status === 'pending').length;
  const sellerCount = users.filter(u => u.role === 'seller').length;
  const pendingAppCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B85C38]">
              <Shield className="w-4 h-4 text-[#12355B]" />
              <span>Hunza Heritage Administration</span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
              Store Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              Admin: <strong>{user?.full_name || 'Hunza Admin'}</strong>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Live" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-8 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#12355B] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 relative ${
              activeTab === 'products'
                ? 'bg-[#12355B] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products ({products.length})</span>
            {pendingProductCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingProductCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#12355B] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 relative ${
              activeTab === 'applications'
                ? 'bg-[#12355B] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Artisan Sellers ({applications.length})</span>
            {pendingAppCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingAppCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-[#12355B] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#12355B] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-[#12355B] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Messages ({messages.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-[11px] text-gray-500 font-medium">Total Revenue</span>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-[#12355B] mt-1 tabular-nums">
                  {formatPKR(totalRevenue)}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-[11px] text-gray-500 font-medium">Total Orders</span>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-[#12355B] mt-1 tabular-nums">
                  {orders.length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-[11px] text-gray-500 font-medium">Total Products</span>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-[#12355B] mt-1 tabular-nums">
                  {products.length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-[11px] text-gray-500 font-medium">Pending Review</span>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-amber-600 mt-1 tabular-nums">
                  {pendingProductCount}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-[11px] text-gray-500 font-medium">Active Artisans</span>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-[#2F5D50] mt-1 tabular-nums">
                  {sellerCount}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-[11px] text-gray-500 font-medium">Registered Users</span>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-[#12355B] mt-1 tabular-nums">
                  {users.length}
                </p>
              </div>
            </div>

            {/* Quick Pending Items alerts */}
            {pendingProductCount > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>{pendingProductCount} handicraft products</strong> are waiting for your approval before going live to customers.</span>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 whitespace-nowrap shadow-sm"
                >
                  Review Products
                </button>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cinzel text-base font-bold text-[#12355B]">
                  Recent Marketplace Orders
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#B85C38] hover:underline font-semibold"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No orders received yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="py-2.5 px-3">Order Number</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">City</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#12355B]">{o.order_number}</td>
                          <td className="py-2.5 px-3 font-medium">{o.full_name}</td>
                          <td className="py-2.5 px-3 text-gray-500">{o.city}</td>
                          <td className="py-2.5 px-3 font-bold tabular-nums">{formatPKR(o.total_amount)}</td>
                          <td className="py-2.5 px-3">
                            <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                              {o.order_status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-gray-400">{formatDate(o.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-cinzel text-lg font-bold text-[#12355B]">
                  Manage Products & Artisan Approvals
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Approve, reject, feature, or delete handicrafts.</p>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Filter:</span>
                <select
                  value={productStatusFilter}
                  onChange={(e) => setProductStatusFilter(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-3 py-1.5 font-medium text-gray-700"
                >
                  <option value="all">All Products ({products.length})</option>
                  <option value="pending">Pending Review ({pendingProductCount})</option>
                  <option value="approved">Approved Live</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Artisan Seller</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products
                    .filter(p => productStatusFilter === 'all' || p.status === productStatusFilter)
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image_urls[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                            <div>
                              <span className="font-semibold text-gray-900 block truncate max-w-xs">{p.name}</span>
                              <span className="text-[11px] text-gray-400">{p.origin_city}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-700">{p.seller_name || 'Local Artisan'}</td>
                        <td className="py-3 px-4 font-bold text-[#12355B] tabular-nums">{formatPKR(p.price)}</td>
                        <td className="py-3 px-4 tabular-nums">{p.stock_quantity} in stock</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                              p.is_featured
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {p.is_featured ? '★ Featured' : 'Normal'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          {p.status === 'approved' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Approved
                            </span>
                          )}
                          {p.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Pending Review
                            </span>
                          )}
                          {p.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.status !== 'approved' && (
                              <button
                                onClick={() => handleApproveProduct(p.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase transition-colors"
                                title="Approve for public shop"
                              >
                                Approve
                              </button>
                            )}
                            {p.status !== 'rejected' && (
                              <button
                                onClick={() => handleRejectProduct(p.id)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-semibold transition-colors"
                                title="Reject"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-cinzel text-lg font-bold text-[#12355B]">
                All Orders & Delivery Fulfillment ({orders.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Update status from Placed → Confirmed → Shipped → Delivered.</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">No orders registered in system yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <div key={o.id} className="p-6 hover:bg-gray-50/50 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-[#12355B] text-sm">{o.order_number}</span>
                        <span className="text-gray-400 ml-3">{formatDate(o.created_at)}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-semibold">Status:</span>
                        <select
                          value={o.order_status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#12355B]"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped (On Way)</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold">Customer</p>
                        <p className="font-semibold text-gray-900">{o.full_name} ({o.phone})</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold">Address</p>
                        <p className="text-gray-700">{o.delivery_address}, {o.city}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold">Payment & Total</p>
                        <p className="font-bold text-[#12355B] tabular-nums">
                          {formatPKR(o.total_amount)} ({o.payment_method.toUpperCase()})
                        </p>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-1.5 pl-2 border-l-2 border-[#12355B]/20">
                      {o.items?.map((it) => (
                        <div key={it.id} className="flex justify-between items-center text-gray-600">
                          <span>{it.product_name} × {it.quantity}</span>
                          <span className="font-semibold tabular-nums">{formatPKR(it.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SELLER APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-cinzel text-lg font-bold text-[#12355B]">
                Artisan Seller Applications ({applications.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Review craft credentials and promote approved applicants to Seller role.</p>
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">No seller applications currently pending.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-gray-50/50 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-[#12355B]">{app.business_name}</h3>
                        <p className="text-gray-500 text-[11px]">{app.city} · {app.phone} · Applied: {formatDate(app.created_at)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveSeller(app.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                            >
                              Approve Seller
                            </button>
                            <button
                              onClick={() => handleRejectSeller(app.id)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            app.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {app.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                      <p><strong>Craft Specialty:</strong> {app.product_type}</p>
                      <p><strong>Artisan Description:</strong> {app.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-cinzel text-lg font-bold text-[#12355B]">
                  Product Categories ({categories.length})
                </h2>
                <p className="text-xs text-gray-500">Configure marketplace taxonomy for Gilgit-Baltistan crafts.</p>
              </div>
              <button
                onClick={() => setIsAddingCat(!isAddingCat)}
                className="px-4 py-2 bg-[#12355B] text-white rounded-xl text-xs font-semibold hover:bg-[#2F5D50] flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingCat ? 'Close Form' : 'Add Category'}</span>
              </button>
            </div>

            {isAddingCat && (
              <form onSubmit={handleCreateCategory} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Copperware & Tea Sets"
                      className="w-full p-2.5 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Short description of products..."
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-5 py-2 bg-[#12355B] text-white rounded-lg font-bold">
                    Save Category
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <img src={c.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                    <h3 className="font-bold text-sm text-gray-900">{c.name}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{c.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[11px]">
                    <span className="font-mono text-gray-400">{c.slug}</span>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-cinzel text-lg font-bold text-[#12355B]">
                Registered Profiles ({users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{u.full_name}</td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : u.role === 'seller'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{u.city || 'Pakistan'}</td>
                      <td className="py-3 px-4 text-gray-400">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-cinzel text-lg font-bold text-[#12355B]">
                Customer Inquiries & Exhibitions ({messages.length})
              </h2>
            </div>
            {messages.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">No contact messages received.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map((m) => (
                  <div key={m.id} className="p-6 hover:bg-gray-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#12355B]">{m.name}</span>
                        <span className="text-gray-400 text-[11px]">({m.email})</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">{formatDate(m.created_at)}</span>
                    </div>
                    <p className="font-semibold text-gray-800">{m.subject}</p>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-xl">{m.message}</p>
                    <div className="pt-2 flex justify-end">
                      {m.status === 'new' && (
                        <button
                          onClick={() => handleMarkMessageRead(m.id)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
