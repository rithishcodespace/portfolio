import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import { Zap, Terminal, FileText, Activity, ShieldCheck, Award, Code2 } from 'lucide-react';
import { GithubIcon } from './Icons';

const Hero = () => {
  const { command, tagline, buttons } = portfolioData.hero;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle interactive ambient spotlight on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      className="min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-16 relative z-10 text-center select-none overflow-hidden"
    >
      {/* Unique Feature 1: Cursor-Tracking Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 157, 0.07), transparent 80%)`,
        }}
      />

      <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">
        
        {/* 1. Terminal Session Prompt Pill */}
        <div className="mb-6 font-mono text-xs sm:text-sm text-slate-300 flex items-center gap-2 justify-center bg-[#071317]/80 px-4 sm:px-5 py-2 rounded-full border border-[#00ff9d]/30 shadow-[0_0_20px_rgba(0,255,157,0.1)] backdrop-blur-md">
          <span className="text-[#00ff9d] font-bold">$</span>
          <span className="text-[#00ff9d] font-medium tracking-wide">
            {command || './init_session.sh --user=rithish'}
          </span>
        </div>

        {/* 2. Hero Name Title with White Brackets & Neon Green Name */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-mono tracking-tight mb-6 leading-tight flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
          {/* Opening bracket in clean white */}
          <span className="text-white text-glow-white font-extrabold drop-shadow-[0_0_18px_rgba(255,255,255,0.6)] animate-pulse">
            &lt;
          </span>
          {/* Name in glowing neon green */}
          <span className="text-[#00ff9d] text-glow-green font-extrabold">
            Rithish S
          </span>
          {/* Closing bracket in clean white */}
          <span className="text-white text-glow-white font-extrabold drop-shadow-[0_0_18px_rgba(255,255,255,0.6)] animate-pulse">
            /&gt;
          </span>
        </h1>

        {/* 3. Role Subtitle Bar */}
        <p className="text-sm sm:text-lg md:text-xl font-mono text-[#00ff9d] font-semibold mb-4 max-w-3xl leading-relaxed tracking-wide">
          Backend Engineer | Distributed Systems | Cloud & DevOps
        </p>

        {/* 4. Tagline Command */}
        <div className="mb-8 font-mono text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl flex items-center justify-center gap-2">
          <span className="text-[#00ff9d] font-bold">$</span>
          <span className="font-medium text-slate-300">{tagline}</span>
        </div>

        {/* 5. Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          {buttons.map((btn, idx) => {
            const isProjects = btn.type === 'projects';
            return (
              <a
                key={idx}
                href={btn.href}
                target={btn.href.startsWith('http') ? '_blank' : '_self'}
                rel={btn.href.startsWith('http') ? 'noopener noreferrer' : ''}
                className={`font-mono text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
                  isProjects
                    ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:bg-[#00ff9d]/25 hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] hover:-translate-y-0.5'
                    : 'bg-[#081518]/90 border-[#00ff9d]/30 text-[#00ff9d] hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 hover:text-white hover:-translate-y-0.5 shadow-sm'
                }`}
              >
                {renderIcon(btn.icon)}
                <span>{btn.label}</span>
              </a>
            );
          })}
        </div>

        {/* Unique Feature 2: Sleek System Telemetry & Milestone Bar */}
        <div className="w-full max-w-3xl bg-[#061215]/60 border border-slate-800/80 rounded-xl p-3 font-mono text-[11px] text-slate-400 flex flex-wrap items-center justify-around gap-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-[#00ff9d]">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">STATUS: ACTIVE</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Code2 className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>1000+ DSA SOLVED</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>NATIONAL HACKATHON WINNER</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 hidden sm:flex">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>PRODUCTION READY</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
