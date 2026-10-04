import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product, Category, OrderItem } from '../types';
import { dbProducts, dbCategories, dbOrders, dbStorage } from '../services/db';
import { formatPKR, formatDate } from '../utils/format';
import { 
  Plus, Edit, Trash2, Package, CheckCircle2, Clock, 
  DollarSign, Upload, Image as ImageIcon, X, Store, ArrowRight, Eye 
} from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [stockQuantity, setStockQuantity] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [originCity, setOriginCity] = useState(user?.city || 'Karimabad, Hunza');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allProds, allCats, allOrders] = await Promise.all([
        dbProducts.getAll(),
        dbCategories.getAll(),
        dbOrders.getAllOrders()
      ]);

      setCategories(allCats);

      // If user is logged in as seller, filter to their products
      const sellerId = user?.id || 'seller-bibi-fatima';
      const myProducts = allProds.filter(p => p.seller_id === sellerId || user?.role === 'admin');
      setProducts(myProducts);

      // Collect order items sold by this seller
      const myItems: OrderItem[] = [];
      allOrders.forEach(o => {
        o.items?.forEach(it => {
          if (it.seller_id === sellerId || user?.role === 'admin') {
            myItems.push(it);
          }
        });
      });
      setOrderItems(myItems);
    } catch (err) {
      console.error('Failed to load seller dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setPrice(3500);
    setOriginalPrice(4200);
    setStockQuantity(5);
    setDescription('');
    setMaterial('Pure Himalayan Wool & Natural Dyes');
    setOriginCity(user?.city || 'Hunza Valley');
    setImageUrls(['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80']);
    setIsFeatured(false);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.category_id);
    setPrice(p.price);
    setOriginalPrice(p.original_price);
    setStockQuantity(p.stock_quantity);
    setDescription(p.description);
    setMaterial(p.material);
    setOriginCity(p.origin_city);
    setImageUrls([...p.image_urls]);
    setIsFeatured(p.is_featured);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const url = await dbStorage.uploadProductImage(file);
      setImageUrls(prev => [...prev, url]);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || price <= 0) {
      setFormError('Please fill in product title, price, and description.');
      return;
    }

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
      const catObj = categories.find(c => c.id === categoryId);

      if (editingProduct) {
        await dbProducts.update(editingProduct.id, {
          name,
          category_id: categoryId,
          price,
          original_price: originalPrice || undefined,
          stock_quantity: stockQuantity,
          description,
          material,
          origin_city: originCity,
          image_urls: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'],
          is_featured: isFeatured,
          category_name: catObj?.name
        });
        setFormSuccess('Handicraft updated successfully!');
      } else {
        await dbProducts.create({
          seller_id: user?.id || 'seller-bibi-fatima',
          category_id: categoryId || categories[0]?.id,
          name,
          slug,
          description,
          price,
          original_price: originalPrice || undefined,
          stock_quantity: stockQuantity,
          image_urls: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'],
          material,
          origin_city: originCity,
          is_featured: isFeatured,
          status: 'pending', // stays pending until admin approves as required!
          rating: 5.0,
          review_count: 0,
          seller_name: user?.full_name || 'Bibi Fatima Gulmiti',
          category_name: catObj?.name
        });
        setFormSuccess('Product submitted! It is now Pending admin review before appearing in public catalog.');
      }

      await loadDashboardData();
      setTimeout(() => {
        setIsFormOpen(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this handicraft listing?')) {
      await dbProducts.delete(id);
      await loadDashboardData();
    }
  };

  const totalSales = orderItems.reduce((acc, it) => acc + it.subtotal, 0);
  const pendingProducts = products.filter(p => p.status === 'pending').length;
  const approvedProducts = products.filter(p => p.status === 'approved').length;

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2F5D50]">
              Artisan Portal
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
              Seller Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Workshop: <strong>{user?.full_name || 'Bibi Fatima Gulmiti'}</strong> ({user?.city || 'Gulmit, Upper Hunza'})
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Handicraft</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#12355B] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Crafts</p>
              <p className="font-cinzel text-xl sm:text-2xl font-bold text-[#12355B] tabular-nums">{products.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Approved Live</p>
              <p className="font-cinzel text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums">{approvedProducts}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending Review</p>
              <p className="font-cinzel text-xl sm:text-2xl font-bold text-amber-700 tabular-nums">{pendingProducts}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#B85C38] flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Artisan Revenue</p>
              <p className="font-cinzel text-xl sm:text-2xl font-bold text-[#12355B] tabular-nums">{formatPKR(totalSales)}</p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-cinzel text-base font-bold text-[#12355B]">
              My Workshop Listings ({products.length})
            </h2>
            <span className="text-[11px] text-gray-500">
              *New products remain Pending until approved by Store Admin
            </span>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No products found for this seller account. Click "Add New Handicraft" above to list a creation.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Craft</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_urls[0] || ''}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-gray-900 block truncate max-w-xs">{p.name}</span>
                            <span className="text-[11px] text-gray-400">{p.origin_city}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{p.category_name || 'Craft'}</td>
                      <td className="py-3 px-4 font-bold text-[#12355B] tabular-nums">{formatPKR(p.price)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold tabular-nums ${p.stock_quantity === 0 ? 'text-red-500' : 'text-gray-800'}`}>
                          {p.stock_quantity} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.status === 'approved' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Approved & Live
                          </span>
                        ) : p.status === 'pending' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Pending Approval
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-gray-500 hover:text-[#12355B] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit craft"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Seller Order Items */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-cinzel text-base font-bold text-[#12355B] mb-4">
            Recent Sold Items ({orderItems.length})
          </h2>
          {orderItems.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No customer orders recorded yet for your products.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-gray-500 text-[11px]">Qty: {item.quantity} × {formatPKR(item.unit_price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#12355B] tabular-nums">{formatPKR(item.subtotal)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Add/Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-cinzel text-xl font-bold text-[#12355B] mb-1">
                {editingProduct ? 'Edit Craft Listing' : 'List a New Gilgit-Baltistan Handicraft'}
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                All submissions are vetted for authentic materials and ethical origins.
              </p>

              {formSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Craft Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hunza Handwoven Pashmina Shawl"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B] bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Origin City / Valley *</label>
                    <input
                      type="text"
                      required
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      placeholder="e.g. Gulmit, Upper Hunza"
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Original Price (PKR strike)</label>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice || ''}
                      onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Optional"
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Materials & Technique *</label>
                  <input
                    type="text"
                    required
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. 100% Himalayan Sheep Wool with Pomegranate Dyes"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Product Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the artisan lineage, dimensions, weaving method, and care instructions..."
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                {/* Image Upload Area */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Product Photos (Upload or Gallery)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {imageUrls.map((url, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-0 right-0 p-0.5 bg-black/60 text-white rounded-bl"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 hover:border-[#12355B] rounded-xl cursor-pointer bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 font-medium">
                      {uploadingImage ? 'Uploading Image...' : 'Click to Upload Craft Photos'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md"
                  >
                    Save & Submit for Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
