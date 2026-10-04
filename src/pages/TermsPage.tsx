import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF9F0] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38]">
              Marketplace Guidelines
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-400 mt-1">Last updated: October 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">1. Marketplace Scope</h2>
            <p>
              Hunza Heritage operates as a fair-trade platform connecting customers with vetted artisans and cultural workshops across Gilgit-Baltistan. By accessing or using the site, you agree to comply with these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">2. Handmade Nuances & Authenticity</h2>
            <p>
              Because every piece is handwoven, hand-carved, or hand-chiseled from natural mountain elements (raw sheep fleece, vegetable pigments, natural wood grain, and mined minerals), slight organic variations in weave tension, color tint, or timber swirls are celebrated hallmarks of genuine authenticity rather than flaws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">3. Pricing & Currency</h2>
            <p>
              All prices are stated in Pakistani Rupees (PKR). We reserve the right to correct typographical pricing discrepancies. In the event of a listing error, we will contact you prior to order fulfillment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">4. Order Fulfillment & Delivery</h2>
            <p>
              Orders are packaged and dispatched with insured couriers. Delivery across Pakistan typically concludes within 3-7 working days, subject to Karakoram Highway weather conditions during winter passes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">5. Returns & Artisan Support Guarantee</h2>
            <p>
              If a product arrives damaged in transit, notify us within 48 hours of receipt with unboxing photos for an immediate replacement or full reimbursement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
