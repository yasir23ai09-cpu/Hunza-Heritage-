import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Send, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#12355B] text-white/90 pt-16 pb-8 border-t border-[#2F5D50]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Card */}
        <div className="bg-[#2F5D50] rounded-2xl p-6 sm:p-10 mb-16 shadow-xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-[#D4A017] text-xs font-semibold tracking-widest uppercase">
              Stories from the Peaks
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mt-1">
              Join Our Mountain Craft Circle
            </h3>
            <p className="text-white/80 text-sm mt-2 leading-relaxed">
              Receive updates on rare artisan batches, cultural stories from Gilgit-Baltistan, and seasonal organic harvests.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-400 text-emerald-200 px-5 py-3 rounded-xl text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Thank you! You are subscribed to Hunza Heritage updates.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-3 bg-white/10 text-white placeholder-white/50 text-sm rounded-xl border border-white/20 focus:outline-none focus:border-[#D4A017] focus:bg-white/15 w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4A017] text-[#12355B] hover:bg-[#B85C38] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-sm">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FFF9F0] flex items-center justify-center text-[#12355B]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                  <path d="M3 19L9 7L13 15L17 9L21 19H3Z" strokeLinejoin="round" />
                  <circle cx="17" cy="6" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-cinzel text-xl font-bold text-white tracking-tight">
                Hunza Heritage
              </span>
            </Link>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm">
              Authentic handcrafted treasures from Gilgit-Baltistan. Connecting generational master weavers, woodcarvers, silversmiths, and organic growers with conscious collectors worldwide.
            </p>
            <div className="pt-2 space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span>Karimabad Main Bazaar, Hunza & Bazaar Road, Gilgit</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span>+92 (05813) 457890 / +92 312 9876543</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span>salam@hunzaheritage.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-white font-semibold text-sm tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link to="/shop" className="hover:text-[#D4A017] transition-colors">All Handicrafts</Link></li>
              <li><Link to="/category/clothing-shawls" className="hover:text-[#D4A017] transition-colors">Handwoven Shawls</Link></li>
              <li><Link to="/category/traditional-wear" className="hover:text-[#D4A017] transition-colors">Gilgit Patti Caps</Link></li>
              <li><Link to="/category/home-decor" className="hover:text-[#D4A017] transition-colors">Walnut Wood Décor</Link></li>
              <li><Link to="/category/jewellery" className="hover:text-[#D4A017] transition-colors">Baltistan Silver Jewellery</Link></li>
              <li><Link to="/category/dry-fruits-gifts" className="hover:text-[#D4A017] transition-colors">Organic Dry Fruits</Link></li>
            </ul>
          </div>

          {/* Marketplace & Artisans */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-white font-semibold text-sm tracking-wider uppercase">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link to="/about" className="hover:text-[#D4A017] transition-colors">About Hunza Heritage</Link></li>
              <li><Link to="/become-seller" className="hover:text-[#D4A017] transition-colors text-[#D4A017] font-medium">Become an Artisan Seller</Link></li>
              <li><Link to="/seller-dashboard" className="hover:text-[#D4A017] transition-colors">Seller Portal</Link></li>
              <li><Link to="/admin" className="hover:text-[#D4A017] transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/orders" className="hover:text-[#D4A017] transition-colors">Track Your Order</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4A017] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-white font-semibold text-sm tracking-wider uppercase">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link to="/faq" className="hover:text-[#D4A017] transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#D4A017] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#D4A017] transition-colors">Terms & Conditions</Link></li>
              <li className="pt-2 text-[11px] text-white/50 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Artisan Sourcing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Hunza Heritage. All rights reserved. Preserving Karakoram craftsmanship.</p>
          <div className="flex items-center gap-4 text-white/70">
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>Bank Transfer</span>
            <span>·</span>
            <span>EasyPaisa & JazzCash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
