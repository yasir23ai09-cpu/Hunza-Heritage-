import React from 'react';
import { Link } from 'react-router-dom';
import { heroBannerImg, shawlImg, artisanLoomImg } from '../data/seedData';
import { HeartHandshake, ShieldCheck, Mountain, Users, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF9F0] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38]">
            Cultural Lineage
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12355B] mt-2">
            The Living Spirit of Karakoram Craftsmanship
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
            Hunza Heritage was born in the heart of Gilgit-Baltistan with a single mission: to preserve centuries-old indigenous handicraft traditions and empower local artisans through dignified, transparent global commerce.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <img
              src={artisanLoomImg}
              alt="Elder artisan weaver in Hunza"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <h2 className="font-cinzel text-2xl font-bold text-[#12355B]">
              Handmade from Valleys to World
            </h2>
            <p>
              Gilgit-Baltistan, crowned by the Karakoram and Himalayan giants (including K2 and Rakaposhi), is home to diverse cultures including Wakhi, Shina, and Balti communities. For centuries along the Old Silk Route, women and men here have transformed high-altitude raw wool, walnut timber, and mineral ores into timeless treasures.
            </p>
            <p>
              Due to geographic isolation, genuine mountain artisans historically relied on intermediaries who kept up to 80% of retail margins. Hunza Heritage changes that equation: every purchase on our platform provides guaranteed, direct fair-trade compensation to the family who crafted it.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#12355B] flex items-center justify-center mx-auto mb-3">
              <Mountain className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-sm text-[#12355B] mb-2">100% Valley Authenticity</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every item is crafted in Gilgit-Baltistan using organic sheep wool, walnut bark dyes, or Karakoram stones.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#2F5D50] flex items-center justify-center mx-auto mb-3">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-sm text-[#12355B] mb-2">Artisan First Economy</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We empower over 400 women weavers, silversmiths, and woodcarvers with direct bank or mobile payouts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#D4A017] flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-sm text-[#12355B] mb-2">Heirloom Quality</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Designed to endure generations. Our textiles and wood bowls carry the durability of mountain resilience.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#12355B] text-white rounded-2xl p-8 sm:p-12 text-center shadow-xl">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold mb-3">
            Join Our Mountain Craft Mission
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto mb-6 leading-relaxed">
            Whether you are decorating your home, seeking a memorable gift, or honoring cultural ancestry, each piece connects you directly to a mountain home.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="px-6 py-3 bg-[#D4A017] hover:bg-[#B85C38] text-[#12355B] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Shop the Collection
            </Link>
            <Link
              to="/become-seller"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors"
            >
              Register as Artisan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
