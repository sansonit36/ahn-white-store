import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, ShieldCheck, X, ChevronRight, Home, Star, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { toggleCart, cart, toggleAdminMode, isAdminMode } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';
  const headerBgClass = scrolled || !isHome || isMobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent';
  const textColorClass = scrolled || !isHome || isMobileMenuOpen ? 'text-gray-900' : 'text-gray-900 md:text-white';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass} ${scrolled ? 'py-3' : 'py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group z-50 relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-300 to-amber-200 group-hover:scale-110 transition-transform duration-500"></div>
            <span className={`font-serif text-2xl font-bold tracking-wide whitespace-nowrap ${textColorClass}`}>
              AHN <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-700">White+</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
            <Link to="/" className={`hover:text-rose-500 transition-colors ${textColorClass}`}>HOME</Link>
            <Link to="/product" className={`hover:text-rose-500 transition-colors ${textColorClass}`}>SHOP</Link>
            <a href="#reviews" className={`hover:text-rose-500 transition-colors ${textColorClass}`}>REVIEWS</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 z-50 relative">
            <button
              onClick={toggleAdminMode}
              className={`p-2 rounded-full transition-colors hidden md:block ${isAdminMode ? 'bg-rose-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Toggle Admin Dashboard"
            >
              <ShieldCheck size={20} />
            </button>

            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-rose-100 rounded-full transition-colors group"
            >
              <ShoppingBag size={24} className={textColorClass} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 ${textColorClass}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out pt-24 px-6 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col gap-6 text-lg font-medium">
          <Link to="/" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors">
            <span className="flex items-center gap-3"><Home size={20} className="text-gray-500" /> Home</span>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <Link to="/product" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors">
            <span className="flex items-center gap-3"><Package size={20} className="text-gray-500" /> Shop Now</span>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <a href="/#reviews" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors">
            <span className="flex items-center gap-3"><Star size={20} className="text-gray-500" /> Reviews</span>
            <ChevronRight size={16} className="text-gray-400" />
          </a>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-4 font-bold text-center">Contact & Support</p>
            <div className="flex justify-center gap-4 text-gray-500">
              <a href="#" className="hover:text-rose-500">Instagram</a>
              <a href="#" className="hover:text-rose-500">Facebook</a>
              <a href="#" className="hover:text-rose-500">WhatsApp</a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};