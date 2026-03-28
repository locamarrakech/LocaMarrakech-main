import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { t, language } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const isRTL = language === 'ar';

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    setCurrentPath(href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/cars', label: t('cars') },
    { href: '/blog', label: t('blog') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="flex-shrink-0">
            <img src="/logo.png" alt="LocaMarrakech" className="h-12 w-auto" />
          </a>
          
          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
            {navLinks.map(link => {
              const isActive = (link.href === '/' && currentPath === '/') || 
                               (link.href !== '/' && link.href !== '/blog' && currentPath.startsWith(link.href)) ||
                               (link.href === '/blog' && currentPath === '/blog');

              return (
                <a 
                  key={link.href} 
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative px-5 py-2 text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-white"></span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
            <a href="tel:+212627573069" className="flex items-center space-x-3 group">
              <div className="p-2 border border-white/20 transition-colors hover:border-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{t('callUs')}</p>
                <p className="text-sm font-light text-white">+212 6 27 57 30 69</p>
              </div>
            </a>
            
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3 border-r border-l-0 pr-6 pl-0' : 'space-x-3 border-l border-r-0 pl-6 pr-0'}`}>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <a 
              href="/cars" 
              onClick={(e) => handleLinkClick(e, '/cars')} 
              className="border border-white text-white px-6 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
            >
              {t('reserve')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-px w-full bg-white transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-px w-full bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block h-px w-full bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-white/10">
          <nav className="px-6 py-6 space-y-1">
            {navLinks.map(link => {
              const isActive = (link.href === '/' && currentPath === '/') || 
                               (link.href !== '/' && link.href !== '/blog' && currentPath.startsWith(link.href)) ||
                               (link.href === '/blog' && currentPath === '/blog');
              
              return (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={(e) => { handleLinkClick(e, link.href); setIsMenuOpen(false); }} 
                  className={`block px-4 py-3 text-sm font-medium uppercase tracking-widest transition-colors ${isRTL ? 'border-r' : 'border-l'} ${
                    isActive
                      ? 'text-white border-white'
                      : 'text-gray-400 hover:text-white border-transparent'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          
          <div className="px-6 pb-6 pt-6 border-t border-white/10">
            <a 
              href="/cars" 
              onClick={(e) => { handleLinkClick(e, '/cars'); setIsMenuOpen(false); }} 
              className="block text-center border border-white text-white px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-white hover:text-black mb-4"
            >
              {t('reserve')}
            </a>
            
            <div className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} pt-4 border-t border-white/10`}>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;