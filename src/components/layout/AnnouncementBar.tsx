import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Truck, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { user, switchDemoRole } = useAuth();

  return (
    <div className="bg-[#12355B] text-white text-xs py-2 px-4 border-b border-[#2F5D50]/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-center sm:text-left overflow-x-auto whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[#FFF9F0]">
            <Truck className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Free delivery nationwide on orders above <strong>PKR 5,000</strong></span>
          </span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-white/80">
            <HeartHandshake className="w-3.5 h-3.5 text-[#B85C38]" />
            <span>100% Direct Fair-Trade with Gilgit-Baltistan Artisans</span>
          </span>
        </div>

        {/* Demo Fast-Switch Control for easy testing */}
        <div className="flex items-center gap-2 text-[11px] text-white/80 shrink-0">
          <span className="flex items-center gap-1 text-[#D4A017]">
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Role:</span>
          </span>
          <div className="flex items-center bg-white/10 rounded px-1 py-0.5 border border-white/15">
            <button
              onClick={() => switchDemoRole('customer')}
              className={`px-2 py-0.5 rounded transition-colors ${
                user?.role === 'customer' || !user ? 'bg-[#D4A017] text-[#12355B] font-bold' : 'hover:text-white'
              }`}
              title="Test as regular shopper"
            >
              Buyer
            </button>
            <button
              onClick={() => switchDemoRole('seller')}
              className={`px-2 py-0.5 rounded transition-colors ${
                user?.role === 'seller' ? 'bg-[#D4A017] text-[#12355B] font-bold' : 'hover:text-white'
              }`}
              title="Test as Hunza Artisan Seller"
            >
              Seller
            </button>
            <button
              onClick={() => switchDemoRole('admin')}
              className={`px-2 py-0.5 rounded transition-colors ${
                user?.role === 'admin' ? 'bg-[#D4A017] text-[#12355B] font-bold' : 'hover:text-white'
              }`}
              title="Test as Store Administrator"
            >
              Admin
            </button>
          </div>
          {user && (
            <span className="hidden lg:inline text-white/60 ml-1">
              ({user.full_name})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
