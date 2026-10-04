import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are all products genuinely handmade in Gilgit-Baltistan?',
      a: 'Yes, 100%. Every item listed on Hunza Heritage is hand-crafted by verified indigenous artisans, women’s cooperatives, and generational craftspeople living in Hunza, Nagar, Gilgit, Skardu, Gojal, or Khaplu. We do not sell factory mass-produced replicas.'
    },
    {
      q: 'How does nationwide delivery work across Pakistan?',
      a: 'Crafts are inspected and carefully packed at our Gilgit and Karimabad hubs, then dispatched via leading courier networks (TCS, Leopard, PostEx). Standard delivery takes 3 to 7 business days to major cities like Islamabad, Lahore, Karachi, Rawalpindi, and Peshawar. Delivery is free for orders above PKR 5,000.'
    },
    {
      q: 'What payment options do you support?',
      a: 'We offer flexible payment methods: Cash on Delivery (COD) nationwide across Pakistan, Direct Bank Transfer (Meezan Bank & HBL), and EasyPaisa / JazzCash mobile wallet payments.'
    },
    {
      q: 'How does buying on Hunza Heritage support local artisans?',
      a: 'Unlike traditional tourist souvenir middlemen who take 70-80% of retail profits, Hunza Heritage passes up to 90% of item proceeds directly to the local artisan weavers, silversmiths, and woodworkers. This sustains ancient indigenous skills and provides essential household income in remote mountain valleys.'
    },
    {
      q: 'Can I request custom embroidery or bespoke wooden carvings?',
      a: 'Yes! Many of our master weavers and woodcarvers accept bespoke orders (e.g. customized family crest shawls or specific furniture panels). You can reach out through our Contact page or WhatsApp with your specifications.'
    },
    {
      q: 'How do I care for pure handwoven sheep and pashmina wool shawls?',
      a: 'Because our shawls are woven with pure mountain wool and vegetable dyes, we recommend gentle dry cleaning or hand-washing in cool water with mild wool detergent. Always dry flat in shaded natural air; do not machine tumble-dry or expose to harsh bleach.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38]">
            Help Center
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#12355B] mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Everything you need to know about authentic Gilgit-Baltistan craftsmanship, deliveries, and artisan support.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-cinzel font-bold text-sm text-[#12355B] hover:text-[#B85C38] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#D4A017] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
