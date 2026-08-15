import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Zap, Terminal, FileText } from 'lucide-react';
import { GithubIcon } from './Icons';

const Hero = () => {
  const { command, name, title, tagline, buttons } = portfolioData.hero;

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'zap':
        return <Zap className="w-5 h-5 text-[#00ff9d]" />;
      case 'terminal':
        return <Terminal className="w-5 h-5 text-[#00e5ff]" />;
      case 'fileText':
        return <FileText className="w-5 h-5 text-[#00ff9d]" />;
      case 'github':
        return <GithubIcon className="w-5 h-5 text-[#00ff9d]" />;
      default:
        return null;
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center px-4 pt-28 pb-16 relative z-10 text-center"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Terminal session prompt line */}
        <div className="mb-6 font-mono text-sm sm:text-base md:text-lg text-slate-300 flex items-center gap-2 justify-center flex-wrap bg-[#0c1618]/70 px-5 py-2 rounded-full border border-[#00ff9d]/20 shadow-sm">
          <span className="text-[#00ff9d] font-extrabold">$</span>
          <span className="text-[#00ff9d] font-semibold">{command}</span>
        </div>

        {/* Hero Name Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-mono tracking-tight text-neon-green text-glow-green mb-6 select-none leading-tight">
          {name}
        </h1>

        {/* Subtitle Roles */}
        <p className="text-base sm:text-xl md:text-2xl font-mono text-[#00ff9d] font-medium mb-5 max-w-3xl leading-relaxed">
          {title}
        </p>

        {/* Tagline Command */}
        <div className="mb-10 font-mono text-sm sm:text-base text-slate-300 max-w-2xl flex items-center justify-center gap-2">
          <span className="text-[#00ff9d] font-extrabold">$</span>
          <span className="font-medium">{tagline}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {buttons.map((btn, idx) => {
            const isProjects = btn.type === 'projects';
            return (
              <a
                key={idx}
                href={btn.href}
                target={btn.href.startsWith('http') ? '_blank' : '_self'}
                rel={btn.href.startsWith('http') ? 'noopener noreferrer' : ''}
                className={`font-mono text-sm sm:text-base font-semibold px-5 py-3 rounded-lg flex items-center gap-2.5 border transition-all duration-200 cursor-pointer ${
                  isProjects
                    ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_18px_rgba(0,255,157,0.25)] hover:bg-[#00ff9d]/25 hover:shadow-[0_0_25px_rgba(0,255,157,0.45)] hover:-translate-y-0.5'
                    : 'bg-[#0c1618] border-[#00ff9d]/30 text-[#00ff9d] hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 hover:text-white hover:-translate-y-0.5'
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
