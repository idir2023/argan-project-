
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, Sparkles, Search, User, LogOut, Palette, Package } from 'lucide-react';
import { CartItem, User as UserType } from '../types';

interface NavbarProps {
  cart: CartItem[];
  user: UserType | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenStudio: () => void;
  onOpenOrders: () => void;
  onLogout: () => void;
  onScrollToSection: (id: string) => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cart, user, onOpenCart, onOpenAuth, onOpenStudio, onOpenOrders, onLogout, onScrollToSection, onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'الرئيسية', id: 'home' },
    { name: 'منتجاتنا', id: 'products' },
    { name: 'قصتنا', id: 'about' },
    { name: 'المدونة', id: 'blog' },
    { name: 'آراء العملاء', id: 'testimonials' },
    { name: 'تواصل معنا', id: 'contact' },
  ];

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
    searchInputRef.current?.blur();
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onScrollToSection('home')}>
          <div className="bg-gold-500 p-1.5 md:p-2 rounded-full text-white shadow-sm">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
          </div>
          <span className={`text-xl md:text-2xl font-serif font-bold tracking-wide ${isScrolled ? 'text-soil-900' : 'text-soil-900 md:text-soil-900'}`}>
            أرغانيا
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onScrollToSection(link.id)}
              className={`text-base lg:text-lg font-medium hover:text-gold-600 transition-colors ${
                isScrolled ? 'text-soil-800' : 'text-soil-900'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 md:gap-4">
          
          {/* Search Bar */}
          <div className={`flex items-center transition-all duration-300 ${
            isSearchOpen 
              ? 'bg-white rounded-full shadow-sm ring-1 ring-gold-100 pl-2 pr-1 py-0.5 md:pl-3 md:pr-1 md:py-1 absolute left-4 right-16 md:static z-10' 
              : 'bg-transparent'
          }`}>
             <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 md:p-2 text-soil-800 hover:text-gold-600 rounded-full transition-colors"
             >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
             </button>
             <input
                ref={searchInputRef}
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                className={`bg-transparent border-none outline-none text-sm text-soil-800 transition-all duration-300 ${
                  isSearchOpen ? 'w-full md:w-48 opacity-100 mr-2' : 'w-0 opacity-0 mr-0'
                }`}
             />
          </div>

          {/* Studio Button (Hidden on Mobile, available in Menu) */}
          <button
            onClick={onOpenStudio}
            className="hidden md:block p-1.5 md:p-2 hover:bg-gold-100 rounded-full transition-colors text-soil-800"
            title="استوديو التصميم"
          >
            <Palette className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* User Auth */}
          {user ? (
            <div className="relative group">
               <button className="p-1.5 md:p-2 text-soil-800 hover:bg-gold-100 rounded-full transition-colors flex items-center gap-2">
                 <User className="w-5 h-5 md:w-6 md:h-6" />
                 <span className="text-sm font-bold hidden lg:block">{user.name.split(' ')[0]}</span>
               </button>
               <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                 <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                    <span className="text-sm font-bold text-soil-900 block">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                 </div>
                 <button 
                   onClick={onOpenOrders}
                   className="w-full text-right px-4 py-2 text-soil-800 hover:bg-gold-50 flex items-center gap-2"
                 >
                   <Package size={16} className="text-gold-600" />
                   طلباتي
                 </button>
                 <button 
                   onClick={onLogout}
                   className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                 >
                   <LogOut size={16} />
                   تسجيل الخروج
                 </button>
               </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="p-1.5 md:p-2 hover:bg-gold-100 rounded-full transition-colors text-soil-800"
              title="تسجيل الدخول"
            >
              <User className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative p-1.5 md:p-2 hover:bg-gold-100 rounded-full transition-colors text-soil-800"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 md:top-0 md:right-0 bg-gold-600 text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
          
          <button 
            className="md:hidden p-1.5 text-soil-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col gap-4 border-t border-gray-100 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onScrollToSection(link.id);
                setIsMobileMenuOpen(false);
              }}
              className="text-right text-lg font-medium text-soil-800 hover:text-gold-600 py-2 border-b border-gray-50 last:border-0"
            >
              {link.name}
            </button>
          ))}
          <button
              onClick={() => {
                onOpenStudio();
                setIsMobileMenuOpen(false);
              }}
              className="text-right text-lg font-medium text-soil-800 hover:text-gold-600 py-2 border-b border-gray-50 flex items-center gap-2"
            >
              <Palette size={20} />
              استوديو التصميم
          </button>
          {user ? (
             <button
              onClick={() => {
                onOpenOrders();
                setIsMobileMenuOpen(false);
              }}
              className="text-right text-lg font-medium text-soil-800 hover:text-gold-600 py-2 border-b border-gray-50 flex items-center gap-2"
            >
              <Package size={20} />
              طلباتي
            </button>
          ) : (
             <button
              onClick={() => {
                onOpenAuth();
                setIsMobileMenuOpen(false);
              }}
              className="text-right text-lg font-medium text-gold-600 py-2 flex items-center gap-2"
            >
              <User size={20} />
              تسجيل الدخول
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
