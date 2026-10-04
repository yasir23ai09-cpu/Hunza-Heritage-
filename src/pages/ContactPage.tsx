import React, { useState } from 'react';
import { dbContact } from '../services/db';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dbContact.submit({
        name,
        email,
        subject,
        message
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38]">
            Get In Touch
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#12355B] mt-1">
            Contact Hunza Heritage
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Have questions about custom handwoven orders, wholesale exhibits, or order tracking? Our mountain support team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Info Card (5 Cols) */}
          <div className="md:col-span-5 bg-[#12355B] text-white p-8 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="font-cinzel text-xl font-bold text-[#D4A017]">
                Artisan Coordination Centers
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Hunza Valley Center</strong>
                    <span className="text-white/70">Main Bazaar Road, Near Baltit Fort, Karimabad, Hunza, Gilgit-Baltistan</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Gilgit Logistics Hub</strong>
                    <span className="text-white/70">Airport Road, Gilgit City, Gilgit-Baltistan</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Phone & WhatsApp</strong>
                    <span className="text-white/70">+92 (05813) 457890<br />+92 312 9876543 (Direct WhatsApp)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm">Email</strong>
                    <span className="text-white/70">salam@hunzaheritage.com<br />orders@hunzaheritage.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-white/60 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4A017]" />
              <span>Customer Help Desk: Mon - Sat, 9:00 AM - 7:00 PM PKT</span>
            </div>
          </div>

          {/* Form (7 Cols) */}
          <div className="md:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="font-cinzel text-xl font-bold text-[#12355B] mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Fill out the form below and we will respond within 24 hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 text-emerald-800 rounded-xl text-center border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-sm">Message Sent Successfully!</h3>
                <p className="text-xs mt-1 text-emerald-700">Thank you for reaching out. An artisan coordinator will reply promptly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Zainab Shah"
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiring about custom size shawls"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you today?..."
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
