import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF9F0] py-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-200 shadow-md">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#12355B] flex items-center justify-center mx-auto mb-4">
          <Mountain className="w-8 h-8 text-[#12355B]" />
        </div>
        <span className="text-4xl font-cinzel font-bold text-[#B85C38]">404</span>
        <h1 className="font-cinzel text-xl font-bold text-[#12355B] mt-2">
          Lost in the High Valleys
        </h1>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          The trail you are following does not exist or has been shifted by winter snows.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Village Homepage</span>
        </Link>
      </div>
    </div>
  );
};
