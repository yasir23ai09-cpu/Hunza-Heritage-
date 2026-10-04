import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="bg-[#12355B] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#D4A017]/40 flex items-center gap-3 max-w-md">
        <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
        <div className="flex-1 text-xs">
          <p className="font-semibold text-[#FFF9F0]">{toastMessage}</p>
        </div>
        <Link
          to="/cart"
          onClick={dismissToast}
          className="text-xs font-bold text-[#D4A017] underline hover:text-white whitespace-nowrap ml-2"
        >
          View Bag
        </Link>
        <button
          onClick={dismissToast}
          className="text-white/60 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
