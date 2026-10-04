import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbSellerApplications } from '../services/db';
import { 
  Store, CheckCircle2, ShieldCheck, HeartHandshake, 
  MapPin, Send, ArrowRight, Sparkles 
} from 'lucide-react';

export const BecomeSellerPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState(user?.city || 'Hunza Valley');
  const [phone, setPhone] = useState(user?.phone || '');
  const [productType, setProductType] = useState('Handwoven Woolen Shawls');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dbSellerApplications.submit({
        user_id: user?.id || 'artisan-' + Date.now(),
        user_name: user?.full_name || businessName,
        user_email: user?.email || 'artisan@hunza.pk',
        business_name: businessName,
        city,
        phone,
        product_type: productType,
        description
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38]">
            Artisan Partnership Program
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#12355B] mt-1">
            Become an Artisan Seller on Hunza Heritage
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            We provide local craftswomen, master woodworkers, and generational weavers of Gilgit-Baltistan with direct access to nationwide buyers and fair compensation.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#12355B] flex items-center justify-center mx-auto mb-3">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-xs text-gray-900 mb-1">Direct Online Storefront</h3>
            <p className="text-[11px] text-gray-500">Your own branded artisan catalog without needing any technical website skills.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#2F5D50] flex items-center justify-center mx-auto mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-xs text-gray-900 mb-1">Guaranteed Fair Trade</h3>
            <p className="text-[11px] text-gray-500">You determine your prices and receive up to 90% direct payout per sold item.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-[#D4A017] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-xs text-gray-900 mb-1">Logistics & Packaging Support</h3>
            <p className="text-[11px] text-gray-500">Our Gilgit hub handles courier pickup, protective shipping boxes, and customer care.</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-cinzel text-2xl font-bold text-[#12355B]">
                Artisan Application Received!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you for applying. Our curator team in Gilgit will contact you within 24-48 hours via WhatsApp or phone to review your craft samples and approve your seller dashboard.
              </p>
              <button
                onClick={() => navigate('/seller-dashboard')}
                className="mt-6 px-6 py-2.5 bg-[#12355B] text-white rounded-xl text-xs font-semibold hover:bg-[#2F5D50] transition-colors"
              >
                Go to Seller Dashboard Preview
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="border-b border-gray-100 pb-3 mb-4">
                <h2 className="font-cinzel text-lg font-bold text-[#12355B]">
                  Artisan Guild Registration Form
                </h2>
                <p className="text-gray-500 text-[11px]">Tell us about your workshop, guild, or family craft lineage.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Artisan / Workshop Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Baltit Weaving Guild or Ali Woodcarvers"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Origin City / Village *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Karimabad Hunza, Skardu, Gilgit, Gulmit"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">WhatsApp / Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0312 9876543"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Primary Craft Type *</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B] bg-white"
                  >
                    <option value="Handwoven Woolen Shawls">Handwoven Woolen Shawls</option>
                    <option value="Traditional Gilgit Patti Caps">Traditional Gilgit Patti Caps</option>
                    <option value="Carved Walnut Wood Décor">Carved Walnut Wood Décor</option>
                    <option value="Baltistan Silver & Gemstone Jewellery">Baltistan Silver & Gemstone Jewellery</option>
                    <option value="Wakhi Carpets & Flat-weave Rugs">Wakhi Carpets & Flat-weave Rugs</option>
                    <option value="Organic Sun-Dried Fruits & Oils">Organic Sun-Dried Fruits & Oils</option>
                    <option value="Mountain Fine Art & Calligraphy">Mountain Fine Art & Calligraphy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Craft Description & Materials Used *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your techniques (e.g. vegetable dyes, vintage loom, hand chiseling) and how many artisans work with you..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
