import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = portfolioData.header.navLinks.map((link) => link.id);
      const scrollPosition = window.scrollY + 200;

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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-4xl bg-[#0a1417]/85 backdrop-blur-md border border-[#00ff9d]/20 rounded-full px-5 py-2.5 flex items-center justify-between shadow-lg shadow-black/40">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-1 font-mono font-bold text-sm sm:text-base text-slate-100 hover:text-[#00ff9d] transition-colors"
        >
          <span className="text-[#00ff9d] text-base sm:text-lg">&gt;</span>
          <span className="text-[#00e5ff]">Chetan.dev</span>
        </a>

        {/* Nav Links */}
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar py-1">
          {portfolioData.header.navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`font-mono text-xs px-2 py-1 rounded transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#00ff9d] font-semibold bg-[#00ff9d]/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
