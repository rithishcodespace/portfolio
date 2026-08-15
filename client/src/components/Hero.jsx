import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Zap, Terminal, FileText } from 'lucide-react';
import { GithubIcon } from './Icons';

const Hero = () => {
  const { command, name, title, tagline, buttons } = portfolioData.hero;

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'zap':
        return <Zap className="w-4 h-4 text-[#00ff9d]" />;
      case 'terminal':
        return <Terminal className="w-4 h-4 text-[#00e5ff]" />;
      case 'fileText':
        return <FileText className="w-4 h-4 text-[#00ff9d]" />;
      case 'github':
        return <GithubIcon className="w-4 h-4 text-[#00ff9d]" />;
      default:
        return null;
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-12 relative z-10 text-center"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Terminal session line */}
        <div className="mb-6 font-mono text-sm sm:text-base text-slate-300 flex items-center gap-2 justify-center flex-wrap">
          <span className="text-[#00ff9d] font-bold">$</span>
          <span className="text-[#00ff9d]">{command}</span>
        </div>

        {/* Hero Name Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-tight text-neon-green text-glow-green mb-6 select-none">
          {name}
        </h1>

        {/* Subtitle Roles */}
        <p className="text-sm sm:text-lg md:text-xl font-mono text-[#00ff9d] font-medium mb-4 max-w-2xl">
          {title}
        </p>

        {/* Tagline Command */}
        <div className="mb-10 font-mono text-xs sm:text-sm text-slate-400 max-w-xl flex items-center justify-center gap-2">
          <span className="text-[#00ff9d] font-bold">$</span>
          <span>{tagline}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {buttons.map((btn, idx) => {
            const isProjects = btn.type === 'projects';
            return (
              <a
                key={idx}
                href={btn.href}
                target={btn.href.startsWith('http') ? '_blank' : '_self'}
                rel={btn.href.startsWith('http') ? 'noopener noreferrer' : ''}
                className={`font-mono text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-md flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
                  isProjects
                    ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_12px_rgba(0,255,157,0.2)] hover:bg-[#00ff9d]/20 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]'
                    : 'bg-[#0c1618] border-[#00ff9d]/25 text-[#00ff9d] hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 hover:text-white'
                }`}
              >
                {renderIcon(btn.icon)}
                <span>{btn.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
