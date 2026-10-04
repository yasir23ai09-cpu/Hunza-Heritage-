import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { dbCategories } from '../services/db';
import { ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await dbCategories.getAll();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
            Cultural Guilds
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#12355B] mt-1">
            Handicraft Categories of Gilgit-Baltistan
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Each craft preserves centuries of indigenous mountain tradition, using sustainable raw sheep wool, wild walnut timber, and raw Karakoram minerals.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl aspect-[3/4] border border-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#B85C38] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="font-cinzel text-lg font-bold text-[#12355B] group-hover:text-[#B85C38] transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-semibold text-[#B85C38] group-hover:text-[#12355B]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
