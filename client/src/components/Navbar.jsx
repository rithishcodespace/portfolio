import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ensure page always starts at ~/ on initial load or refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setActiveSection('home');

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      // If at or near top of the page, always lock to ~/
      if (scrollY < 120) {
        setActiveSection('home');
        return;
      }

      const sections = portfolioData.header.navLinks.map((link) => link.id);
      const scrollPosition = scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);

    if (id === 'home') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none"
    >
      <nav
        className={`pointer-events-auto w-full max-w-5xl bg-[#091316]/95 backdrop-blur-md border transition-all duration-300 rounded-2xl md:rounded-full px-4 sm:px-5 lg:px-6 py-1.5 sm:py-2 flex flex-col md:flex-row md:items-center justify-between shadow-xl shadow-black/70 ${
          scrolled
            ? 'border-[#00ff9d]/35 shadow-[0_4px_24px_rgba(0,0,0,0.8)] shadow-[#00ff9d]/5'
            : 'border-[#00ff9d]/20'
        }`}
      >
        {/* Header bar row: Logo + Mobile Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Terminal Shell Prompt Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="group flex items-center gap-1.5 font-mono font-bold text-sm sm:text-base text-slate-100 hover:text-[#00ff9d] transition-colors shrink-0 mr-3 lg:mr-4 select-none cursor-pointer"
          >
            <span className="text-[#00ff9d] font-black text-base sm:text-lg transition-transform duration-200 group-hover:translate-x-0.5">&gt;</span>
            <span className="text-[#00e5ff] tracking-tight transition-colors duration-200 group-hover:text-[#00ff9d]">{portfolioData.header.logo}</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-[#00ff9d] p-1.5 rounded-lg border border-[#00ff9d]/20 bg-[#071317] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#00ff9d]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {portfolioData.header.navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative inline-flex items-center justify-center font-mono text-xs px-2.5 lg:px-3 py-1 rounded-full border border-transparent transition-colors duration-200 whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'text-[#00ff9d] font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                {/* Sliding Spring Active Pill */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-[#00ff9d]/12 border border-[#00ff9d]/40 shadow-[0_0_12px_rgba(0,255,157,0.2)]"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Nav Links Tray */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="md:hidden overflow-hidden pt-3 mt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5"
            >
              {portfolioData.header.navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`inline-flex items-center justify-center font-mono text-xs px-3.5 py-2 rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'text-[#00ff9d] font-semibold bg-[#00ff9d]/15 border-[#00ff9d]/35 shadow-[0_0_10px_rgba(0,255,157,0.15)]'
                        : 'text-slate-300 bg-[#071113] border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navbar;
