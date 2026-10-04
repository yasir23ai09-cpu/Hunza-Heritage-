import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category } from '../types';
import { dbProducts, dbCategories } from '../services/db';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { formatPKR } from '../utils/format';
import { Search, Filter, SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  // Filters state
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedCity = searchParams.get('city') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';
  const minRating = Number(searchParams.get('rating')) || 0;
  const maxPriceParam = Number(searchParams.get('maxPrice')) || 50000;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allProds, allCats] = await Promise.all([
          dbProducts.getAll('approved'),
          dbCategories.getAll()
        ]);
        setProducts(allProds);
        setCategories(allCats);
      } catch (err) {
        console.error('Failed to load shop items', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesMaterial = p.material.toLowerCase().includes(query);
        const matchesCity = p.origin_city.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesMaterial && !matchesCity) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        const cat = categories.find(c => c.slug === selectedCategory);
        if (cat && p.category_id !== cat.id) return false;
      }

      // City
      if (selectedCity !== 'all') {
        if (!p.origin_city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      }

      // Price
      if (p.price > maxPriceParam) return false;

      // Rating
      if (minRating > 0 && p.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'popular') return b.review_count - a.review_count;
      // Newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, categories, searchQuery, selectedCategory, selectedCity, sortBy, minRating, maxPriceParam]);

  const updateFilter = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all' || value === '' || value === 0) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    setSearchParams(params);
    setDisplayCount(12);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setDisplayCount(12);
  };

  const cities = ['Hunza', 'Gilgit', 'Skardu', 'Gojal', 'Khaplu', 'Chilas'];

  const visibleProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
            Marketplace Catalog
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#12355B] mt-1">
            Handcrafted Treasures of Gilgit-Baltistan
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
            Browse authentic mountain craftsmanship. Filter by artisan valley, price, category, and review ratings.
          </p>
        </div>

        {/* Search & Mobile Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search shawls, walnut wood, caps, jewellery..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#12355B] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#12355B]"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-xl border border-gray-200 h-fit sticky top-28 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-cinzel font-bold text-sm text-[#12355B] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#B85C38]" />
                <span>Filter Collection</span>
              </h2>
              {(selectedCategory !== 'all' || selectedCity !== 'all' || minRating > 0 || maxPriceParam < 50000 || searchQuery) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#B85C38] hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">
                Category
              </h3>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => updateFilter('category', 'all')}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#12355B] text-white font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateFilter('category', c.slug)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors truncate ${
                      selectedCategory === c.slug
                        ? 'bg-[#12355B] text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin City Filter */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">
                Origin Valley / City
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => updateFilter('city', 'all')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    selectedCity === 'all'
                      ? 'bg-[#2F5D50] text-white font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Valleys
                </button>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => updateFilter('city', city)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      selectedCity.toLowerCase() === city.toLowerCase()
                        ? 'bg-[#2F5D50] text-white font-semibold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Max Price
                </h3>
                <span className="text-xs font-bold text-[#12355B] tabular-nums">
                  {formatPKR(maxPriceParam)}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={maxPriceParam}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full accent-[#12355B]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>PKR 2,000</span>
                <span>PKR 50,000+</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2">
                Minimum Rating
              </h3>
              <div className="space-y-1 text-xs">
                {[0, 4.5, 4.8, 5.0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFilter('rating', rating)}
                    className={`w-full text-left py-1 px-2 rounded transition-colors flex items-center justify-between ${
                      minRating === rating ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{rating === 0 ? 'Any Rating' : `${rating} Stars & Above`}</span>
                    {rating > 0 && <span className="text-amber-500">★</span>}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4 px-1">
              <span>Showing <strong>{filteredProducts.length}</strong> handcrafted pieces</span>
              {selectedCategory !== 'all' && (
                <span className="font-medium text-[#2F5D50]">
                  Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl aspect-[3/4] border border-gray-200" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-6">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-[#B85C38] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-[#12355B]">No matching crafts found</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  We couldn't find any products matching your specific filters. Try searching for broader terms or clearing your filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-[#12355B] text-white rounded-xl text-xs font-semibold hover:bg-[#2F5D50] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {displayCount < filteredProducts.length && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setDisplayCount(prev => prev + 12)}
                      className="px-8 py-3 bg-white border border-[#12355B]/20 text-[#12355B] hover:bg-[#12355B] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                    >
                      Load More Crafts ({filteredProducts.length - displayCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
