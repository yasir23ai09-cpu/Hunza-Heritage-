import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { dbProducts, dbCategories } from '../services/db';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { SEED_ARTISANS, heroBannerImg } from '../data/seedData';
import { 
  ArrowRight, ShieldCheck, HeartHandshake, Truck, Sparkles, 
  Award, Star, Quote, ChevronRight, Gem, Store, Clock
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allProds, allCats] = await Promise.all([
          dbProducts.getAll('approved'),
          dbCategories.getAll()
        ]);
        setProducts(allProds);
        setCategories(allCats);
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 8);
  const bestSellers = [...products].sort((a, b) => b.review_count - a.review_count).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#12355B] text-white">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <img
            src={heroBannerImg}
            alt="Majestic Karakoram mountains of Hunza Valley"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#12355B] via-[#12355B]/85 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4A017] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Cultural Marketplace</span>
            </span>

            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Handmade Stories from the Mountains
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              Discover authentic crafts created with tradition, skill and love by artisans of Gilgit-Baltistan. Pure wool shawls, carved walnut wood, and natural mountain gemstones delivered directly to your doorstep.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="px-6 py-3.5 rounded-xl bg-[#D4A017] hover:bg-[#B85C38] text-[#12355B] hover:text-white transition-all text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/become-seller"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-[#D4A017]" />
                <span>Become a Seller</span>
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 text-white/80">
              <div>
                <p className="font-cinzel text-xl sm:text-2xl font-bold text-[#D4A017] tabular-nums">400+</p>
                <p className="text-[11px] sm:text-xs text-white/70">Generational Weavers</p>
              </div>
              <div>
                <p className="font-cinzel text-xl sm:text-2xl font-bold text-[#D4A017] tabular-nums">100%</p>
                <p className="text-[11px] sm:text-xs text-white/70">Fair-Trade Revenue</p>
              </div>
              <div>
                <p className="font-cinzel text-xl sm:text-2xl font-bold text-[#D4A017] tabular-nums">7 Days</p>
                <p className="text-[11px] sm:text-xs text-white/70">Nationwide Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse by Category */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
              Curation of Valleys
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
              Browse by Heritage Craft
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-semibold text-[#B85C38] hover:text-[#12355B] flex items-center gap-1 group"
          >
            <span>Explore All 8 Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-[#12355B]/10 hover:border-[#B85C38]/40 hover:shadow-md transition-all p-3 sm:p-4 flex flex-col"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 mb-3 relative">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-[#12355B] group-hover:text-[#B85C38] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="py-16 bg-white border-y border-[#12355B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2F5D50]">
                Curated Collection
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
                Featured Karakoram Treasures
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-semibold text-[#12355B] hover:text-[#B85C38] flex items-center gap-1 group"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Best Sellers Showcase */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A017]">
              Customer Favorites
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
              Most Cherished Pieces
            </h2>
          </div>
          <Link
            to="/shop?sort=popular"
            className="text-xs sm:text-sm font-semibold text-[#B85C38] hover:text-[#12355B] flex items-center gap-1"
          >
            <span>See Best Sellers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. Meet the Artisans Section */}
      <section className="py-20 bg-[#2F5D50] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#D4A017] text-xs font-semibold uppercase tracking-widest">
              Living Heritage
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold mt-1 text-white">
              Meet the Artisans of Gilgit-Baltistan
            </h2>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Every purchase on Hunza Heritage directly supports indigenous families, women’s weaving cooperatives, and century-old master workshops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEED_ARTISANS.map((artisan) => (
              <div
                key={artisan.id}
                className="bg-white/10 rounded-2xl p-6 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-colors"
              >
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-black/20">
                    <img
                      src={artisan.avatar_url}
                      alt={artisan.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    {artisan.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#D4A017] mt-0.5">
                    <span>{artisan.location}</span>
                    <span>·</span>
                    <span>{artisan.experience_years} yrs craft</span>
                  </div>
                  <p className="text-xs text-white/80 font-medium mt-2">
                    {artisan.specialty}
                  </p>
                  <p className="text-xs text-white/70 italic mt-3 border-l-2 border-[#D4A017] pl-2.5">
                    {artisan.story}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    to="/shop"
                    className="text-xs font-semibold text-[#D4A017] hover:text-white flex items-center justify-between"
                  >
                    <span>View Artisan Works</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
            Ethical & Authentic
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
            Why Choose Hunza Heritage
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Preserving indigenous craftsmanship through fair commerce and nationwide trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#12355B] flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-[#12355B]" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Authentic Local Products</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every item is handmade in the valleys of Hunza, Nagar, Skardu, and Gilgit. No synthetic replicas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6 text-[#2F5D50]" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Support Local Artisans</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Direct revenue goes to the artisan hands, empowering remote mountain communities and women weavers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-[#D4A017]" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Secure Shopping</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cash on delivery, bank transfer, and verified EasyPaisa / JazzCash payment with total peace of mind.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-[#B85C38]" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Delivery Across Pakistan</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Fast, tracked courier shipping from northern mountain hubs to all major cities across Pakistan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <Gem className="w-6 h-6 text-purple-700" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Cultural Craftsmanship</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Centuries-old needlework, natural vegetable dyes, and ancient lapis stones preserved for modern homes.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews Section */}
      <section className="py-16 bg-[#FFF9F0] border-t border-[#12355B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
              Collector Words
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
              Voices of Our Community
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  “The craftsmanship on the Hunza wool shawl is breathtaking. The wool is so soft and warm, and the embroidery is noticeably authentic. Arrived in 3 days to Islamabad.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-[#12355B]">Tariq Mehmood</p>
                <p className="text-[11px] text-gray-500">Islamabad · Verified Buyer</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  “I visited Hunza last year and lost my traditional cap. Ordering this brought all those magical mountain memories right back! The silver brooch is museum quality.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-[#12355B]">Dr. Sarah Jenkins</p>
                <p className="text-[11px] text-gray-500">UK Traveler · Cultural Enthusiast</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  “You can immediately tell this is genuine aged walnut wood. It has that subtle organic apricot oil finish. A true centerpiece for our dining table.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-[#12355B]">Ayesha Raza</p>
                <p className="text-[11px] text-gray-500">Lahore · Interior Collector</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
