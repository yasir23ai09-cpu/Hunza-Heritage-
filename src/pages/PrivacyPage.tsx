import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF9F0] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38]">
              Legal Transparency
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#12355B] mt-1">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400 mt-1">Last updated: October 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">1. Information We Collect</h2>
            <p>
              When you purchase or register on Hunza Heritage, we collect essential transaction details including your name, email address, delivery address, phone number, and order records. We do not store sensitive payment card credentials on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">2. Use of Information</h2>
            <p>
              Your contact details are strictly utilized to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process and fulfill orders placed with Gilgit-Baltistan artisan guilds.</li>
              <li>Provide dispatch and delivery tracking SMS or WhatsApp notifications.</li>
              <li>Notify buyers of relevant seasonal harvests and authentic batch releases.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">3. Artisan Data Protection</h2>
            <p>
              We protect the private bank details and residential addresses of our indigenous artisans. Contact with sellers is mediated through Hunza Heritage to protect against unauthorized exploitation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">4. Cookies & Analytics</h2>
            <p>
              We use functional local storage and minimal session cookies necessary for cart persistence and secure login authentication. We never sell your personal data to third-party ad networks.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-cinzel font-bold text-base text-[#12355B]">5. Contact Regarding Privacy</h2>
            <p>
              For inquiries regarding data removal or privacy inquiries, contact our data coordinator at <strong>privacy@hunzaheritage.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
