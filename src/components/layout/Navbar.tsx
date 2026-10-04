import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { 
  Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, 
  Package, LayoutDashboard, Shield, LogOut, Store, ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFF9F0]/95 backdrop-blur-md border-b border-[#12355B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#12355B] hover:text-[#B85C38] focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-full bg-[#12355B] flex items-center justify-center text-[#D4A017] shadow-sm group-hover:bg-[#2F5D50] transition-colors">
                  {/* Mountain Peak / Artisan Knot geometric icon */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
                    <path d="M3 19L9 7L13 15L17 9L21 19H3Z" strokeLinejoin="round" />
                    <circle cx="17" cy="6" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-tight text-[#12355B] group-hover:text-[#B85C38] transition-colors leading-none">
                    Hunza Heritage
                  </span>
                  <span className="text-[10px] tracking-wider uppercase text-[#B85C38] font-medium mt-1">
                    Gilgit-Baltistan
                  </span>
                </div>
              </Link>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1F2937]">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`transition-colors py-1 relative hover:text-[#B85C38] ${
                      isActive ? 'text-[#B85C38] font-semibold' : 'text-[#1F2937]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B85C38] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Actions (Search, Wishlist, Cart, Profile) */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#12355B] hover:text-[#B85C38] transition-colors rounded-full hover:bg-[#12355B]/5"
                title="Search crafts"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-[#12355B] hover:text-[#B85C38] transition-colors rounded-full hover:bg-[#12355B]/5 relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B85C38] text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 text-[#12355B] hover:text-[#B85C38] transition-colors rounded-full hover:bg-[#12355B]/5 relative"
                title="Shopping Bag"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#12355B] text-[#D4A017] text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#12355B]/20 bg-white hover:border-[#B85C38] transition-colors text-xs font-medium text-[#12355B]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#12355B] text-white text-xs flex items-center justify-center font-bold">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline max-w-[90px] truncate">
                      {user.full_name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12355B] text-white hover:bg-[#2F5D50] transition-colors text-xs font-semibold whitespace-nowrap shadow-sm"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                )}

                {/* Dropdown Menu */}
                {user && profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 truncate">{user.full_name}</p>
                      <p className="text-gray-500 text-[11px] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                        {user.role} Account
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-[#FFF9F0] hover:text-[#B85C38]"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-[#FFF9F0] hover:text-[#B85C38]"
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>My Orders</span>
                    </Link>

                    {/* Seller Links */}
                    {(user.role === 'seller' || user.role === 'admin') && (
                      <Link
                        to="/seller-dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-[#FFF9F0] hover:text-[#B85C38]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">Seller Dashboard</span>
                      </Link>
                    )}

                    {/* Admin Links */}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-[#12355B] bg-blue-50/50 hover:bg-blue-100/60 font-semibold"
                      >
                        <Shield className="w-4 h-4 text-[#12355B]" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    {user.role === 'customer' && (
                      <Link
                        to="/become-seller"
                        className="flex items-center gap-2.5 px-4 py-2 text-[#B85C38] hover:bg-[#FFF9F0] font-medium"
                      >
                        <Store className="w-4 h-4" />
                        <span>Become a Seller</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="bg-white border-t border-b border-gray-200 py-3 px-4 shadow-sm animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search handwoven shawls, carved walnut wood, Balti silver jewellery..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#12355B] focus:bg-white transition-colors"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#12355B] text-white text-xs font-semibold rounded-lg hover:bg-[#2F5D50] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFF9F0] border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search handicrafts..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#12355B]"
              />
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 px-3 rounded-lg ${
                    location.pathname === link.path
                      ? 'bg-[#12355B] text-white font-semibold'
                      : 'text-gray-800 hover:bg-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/become-seller"
                className="py-2 px-3 rounded-lg text-[#B85C38] font-semibold hover:bg-white flex items-center justify-between"
              >
                <span>Become an Artisan Seller</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
