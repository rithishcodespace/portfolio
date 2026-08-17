import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = portfolioData.header.navLinks.map((link) => link.id);
      const scrollPosition = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <nav
        className={`w-full max-w-6xl bg-[#0a1417]/95 backdrop-blur-md border transition-all duration-300 rounded-2xl md:rounded-full px-4 sm:px-6 py-2 sm:py-2.5 flex flex-col md:flex-row md:items-center justify-between shadow-xl shadow-black/60 ${
          scrolled ? 'border-[#00ff9d]/30 shadow-[#00ff9d]/5' : 'border-[#00ff9d]/20'
        }`}
      >
        {/* Header bar row */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-1 font-mono font-bold text-base sm:text-lg text-slate-100 hover:text-[#00ff9d] transition-colors shrink-0 mr-4"
          >
            <span className="text-[#00ff9d] font-extrabold text-lg sm:text-xl">&gt;</span>
            <span className="text-[#00e5ff] tracking-tight">{portfolioData.header.logo}</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-[#00ff9d] p-1.5 rounded-lg border border-[#00ff9d]/20 bg-[#071317] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#00ff9d]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          {portfolioData.header.navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`font-mono text-xs px-2.5 py-1.5 rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#00ff9d] font-semibold bg-[#00ff9d]/15 border border-[#00ff9d]/30 shadow-[0_0_10px_rgba(0,255,157,0.15)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Nav Links Tray */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 mt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 animate-fadeIn">
            {portfolioData.header.navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`font-mono text-xs px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#00ff9d] font-semibold bg-[#00ff9d]/15 border border-[#00ff9d]/30 shadow-[0_0_10px_rgba(0,255,157,0.15)]'
                      : 'text-slate-300 bg-[#071113] border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

