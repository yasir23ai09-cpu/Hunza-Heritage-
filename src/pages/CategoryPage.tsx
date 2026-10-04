import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { dbProducts, dbCategories } from '../services/db';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { ArrowLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      if (!slug) return;
      try {
        const cats = await dbCategories.getAll();
        const found = cats.find(c => c.slug === slug);
        if (found) {
          setCategory(found);
          const allProds = await dbProducts.getAll('approved');
          setProducts(allProds.filter(p => p.category_id === found.id));
        }
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#12355B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 text-center">
        <h2 className="font-cinzel text-2xl font-bold text-[#12355B]">Category Not Found</h2>
        <Link to="/categories" className="mt-4 inline-block px-5 py-2 bg-[#12355B] text-white rounded-lg text-xs font-semibold">
          All Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-[#12355B] text-white mb-10 p-8 sm:p-12 shadow-lg">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img src={category.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <Link to="/categories" className="inline-flex items-center gap-1.5 text-xs text-[#D4A017] hover:underline mb-3">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Categories</span>
            </Link>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold">{category.name}</h1>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">{category.description}</p>
          </div>
        </div>

        {/* Products */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cinzel text-lg font-bold text-[#12355B]">
            {products.length} Authenticated Pieces
          </h2>
          <Link to="/shop" className="text-xs font-semibold text-[#B85C38] hover:underline">
            View All Other Crafts
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center border border-gray-200">
            <p className="text-gray-500 text-sm">New batches are being handwoven in the valleys for this category.</p>
            <Link to="/shop" className="mt-4 inline-block px-5 py-2 bg-[#12355B] text-white rounded-lg text-xs font-semibold">
              Browse Other Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        )}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
