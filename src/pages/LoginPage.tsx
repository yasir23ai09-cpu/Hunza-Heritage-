import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Store, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'seller' | 'customer') => {
    await switchDemoRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'seller') navigate('/seller-dashboard');
    else navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-14 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-10 border border-gray-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#12355B] text-[#D4A017] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38]">
            Welcome Back
          </span>
          <h1 className="font-cinzel text-2xl font-bold text-[#12355B] mt-1">
            Sign In to Hunza Heritage
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your orders, artisan shop, or explore mountain crafts.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Access
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg font-medium text-gray-700 flex flex-col items-center gap-1 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-[#12355B]" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('seller')}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg font-medium text-gray-700 flex flex-col items-center gap-1 shadow-sm"
            >
              <Store className="w-3.5 h-3.5 text-[#2F5D50]" />
              <span>Artisan</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg font-medium text-gray-700 flex flex-col items-center gap-1 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B85C38]" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#12355B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#12355B] hover:bg-[#2F5D50] text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-semibold text-[#B85C38] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
