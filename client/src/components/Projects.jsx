import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import {
  ShoppingCart,
  Database,
  Leaf,
  Search,
  Users,
  Tv,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Code,
  Image as ImageIcon,
} from 'lucide-react';
import { GithubIcon } from './Icons';

const Projects = () => {
  const { headingCommand, list } = portfolioData.projects;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalProjects = list.length;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const renderProjectIcon = (iconName) => {
    switch (iconName) {
      case 'shopping-cart':
        return <ShoppingCart className="w-6 h-6 text-[#00ff9d]" />;
      case 'database':
        return <Database className="w-6 h-6 text-[#00e5ff]" />;
      case 'leaf':
        return <Leaf className="w-6 h-6 text-emerald-400" />;
      case 'search':
        return <Search className="w-6 h-6 text-amber-400" />;
      case 'users':
        return <Users className="w-6 h-6 text-[#00e5ff]" />;
      case 'tv':
        return <Tv className="w-6 h-6 text-purple-400" />;
      default:
        return <Code className="w-6 h-6 text-[#00ff9d]" />;
    }
  };

  const getTitleColor = (color) => {
    switch (color) {
      case 'emerald':
        return 'text-[#00ff9d]';
      case 'sky':
        return 'text-[#00e5ff]';
      case 'fuchsia':
        return 'text-purple-400';
      case 'amber':
        return 'text-amber-400';
      default:
        return 'text-[#00ff9d]';
    }
  };

  // Indices for neighbor cards
  const prevIndex = (currentIndex - 1 + totalProjects) % totalProjects;
  const nextIndex = (currentIndex + 1) % totalProjects;

  // Ultra-smooth slide animation variants with motion blur
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 360 : -360,
      opacity: 0,
      scale: 0.92,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (dir) => ({
      x: dir > 0 ? -360 : 360,
      opacity: 0,
      scale: 0.92,
      filter: 'blur(4px)',
    }),
  };

  // Generate ASCII-style progress bar
  const renderProgressBar = () => {
    const totalBars = 16;
    const filledBars = Math.round(((currentIndex + 1) / totalProjects) * totalBars);
    const emptyBars = totalBars - filledBars;
    return '█'.repeat(filledBars) + '░'.repeat(emptyBars);
  };

  const currentProj = list[currentIndex];

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 max-w-7xl mx-auto relative z-10 font-mono overflow-hidden">
      <SectionHeader command={headingCommand} />

      {/* Header Artifact Index & Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mb-6 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00ff9d]" />
          <span className="text-slate-200 font-bold">ENGINEERING_ARTIFACTS</span>
          <span className="text-slate-500 font-mono">
            [{String(currentIndex + 1).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}]
          </span>
        </div>

        {/* Progress Bar Indicator */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-500 hidden sm:inline">INDEX:</span>
          <span className="text-[#00ff9d] tracking-widest">{renderProgressBar()}</span>
          <span className="text-slate-400 font-bold">
            {Math.round(((currentIndex + 1) / totalProjects) * 100)}%
          </span>
        </div>
      </div>

      {/* Interactive Project Viewer Container */}
      <div className="relative flex items-center justify-center h-[590px] min-[400px]:h-[620px] sm:h-[650px] my-4 select-none">
        {/* Left Navigation Arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous Project"
          className="absolute left-1 sm:left-4 z-30 bg-[#081518]/90 hover:bg-[#00ff9d] text-[#00ff9d] hover:text-black border border-[#00ff9d]/40 p-2.5 sm:p-4 rounded-full shadow-[0_0_20px_rgba(0,255,157,0.25)] transition-all duration-200 cursor-pointer group"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next Project"
          className="absolute right-1 sm:right-4 z-30 bg-[#081518]/90 hover:bg-[#00ff9d] text-[#00ff9d] hover:text-black border border-[#00ff9d]/40 p-2.5 sm:p-4 rounded-full shadow-[0_0_20px_rgba(0,255,157,0.25)] transition-all duration-200 cursor-pointer group"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Previous Card Peek (Desktop / Tablet) */}
        <div
          onClick={handlePrev}
          className="hidden md:block absolute left-[-18%] lg:left-[-12%] xl:left-[-8%] w-[420px] lg:w-[460px] h-[560px] min-[400px]:h-[580px] sm:h-[610px] opacity-30 hover:opacity-60 transition-all duration-300 scale-90 cursor-pointer z-10 filter blur-[0.5px] pointer-events-auto"
        >
          <ProjectCardContent proj={list[prevIndex]} isPeeking={true} renderProjectIcon={renderProjectIcon} getTitleColor={getTitleColor} />
        </div>

        {/* Active Centered Project Card with Framer Motion popLayout */}
        <div className="w-full max-w-2xl sm:max-w-3xl z-20 px-8 sm:px-6 relative h-[560px] min-[400px]:h-[580px] sm:h-[610px]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 },
                opacity: { duration: 0.25 },
                scale: { duration: 0.3 },
                filter: { duration: 0.25 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (offset.x < -50 || swipe < -400) handleNext();
                else if (offset.x > 50 || swipe > 400) handlePrev();
              }}
              className="cursor-grab active:cursor-grabbing w-full h-full"
            >
              <ProjectCardContent proj={currentProj} isPeeking={false} renderProjectIcon={renderProjectIcon} getTitleColor={getTitleColor} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Card Peek (Desktop / Tablet) */}
        <div
          onClick={handleNext}
          className="hidden md:block absolute right-[-18%] lg:right-[-12%] xl:right-[-8%] w-[420px] lg:w-[460px] h-[560px] min-[400px]:h-[580px] sm:h-[610px] opacity-30 hover:opacity-60 transition-all duration-300 scale-90 cursor-pointer z-10 filter blur-[0.5px] pointer-events-auto"
        >
          <ProjectCardContent proj={list[nextIndex]} isPeeking={true} renderProjectIcon={renderProjectIcon} getTitleColor={getTitleColor} />
        </div>
      </div>

      {/* Footer Navigation Affordance & Shortcut Hint */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-6 pt-3 border-t border-slate-800/60 font-mono">
        <span className="hidden sm:inline">
          [USE <span className="text-[#00ff9d]">←</span> <span className="text-[#00ff9d]">→</span> ARROW KEYS OR DRAG TO NAVIGATE]
        </span>
        <span className="text-[11px] text-[#00ff9d] font-semibold flex items-center gap-1.5 mx-auto sm:mx-0">
          <span>SWIPE OR CLICK ARROWS TO EXPLORE</span>
          <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
        </span>
      </div>
    </section>
  );
};

// Sub-component for Project Card Rendering with Inline Icon + Title Header
const ProjectCardContent = ({ proj, isPeeking, renderProjectIcon, getTitleColor }) => {
  const isHighlighted = proj.isHighlighted;
  const titleColorClass = getTitleColor(proj.color);

  return (
    <div
      className={`bg-[#0c1618] rounded-xl p-4 sm:p-7 font-mono flex flex-col justify-between transition-all duration-300 h-full w-full overflow-hidden ${isPeeking
          ? 'border border-slate-800 bg-[#081113]'
          : isHighlighted
            ? 'border border-[#00ff9d] shadow-[0_0_28px_rgba(0,255,157,0.22)] bg-[#0e1a1d] hover:shadow-[0_0_35px_rgba(0,255,157,0.3)]'
            : 'border border-[#00ff9d]/30 hover:border-[#00ff9d]/70 shadow-[0_0_15px_rgba(0,255,157,0.1)] hover:shadow-[0_0_25px_rgba(0,255,157,0.2)]'
        }`}
    >
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          {/* Header dots & filename */}
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 mb-3 sm:mb-3.5 border-b border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
              <span className="ml-1 text-slate-300 font-medium text-xs sm:text-sm truncate max-w-[140px] sm:max-w-none">{proj.fileName}</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-[#00ff9d] bg-[#00ff9d]/10 px-2 sm:px-2.5 py-0.5 rounded border border-[#00ff9d]/20 font-semibold tracking-wider">
              ● OPERATIONAL
            </span>
          </div>

          {/* Project Title Header Row with Icon placed directly before the Name */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 bg-[#081518] rounded-lg border border-slate-800/90 shrink-0">
                {renderProjectIcon(proj.icon)}
              </div>
              <h3 className={`text-base min-[400px]:text-lg sm:text-2xl font-black ${titleColorClass} leading-tight tracking-tight truncate`}>
                {proj.title}
              </h3>
            </div>
            <span className="text-[10px] sm:text-xs text-[#00e5ff] font-bold bg-[#00e5ff]/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#00e5ff]/30 shrink-0">
              {proj.period}
            </span>
          </div>

          {/* Project Image Preview (e.g. Plantera) */}
          {proj.image && (
            <div className="relative rounded-lg overflow-hidden border border-[#00ff9d]/30 mb-3 group/img h-28 min-[400px]:h-32 sm:h-44 w-full bg-[#040c0e] shrink-0 shadow-md">
              <img
                src={proj.image}
                alt={proj.title}
                className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-[#081518]/90 text-[9px] sm:text-[10px] text-[#00ff9d] border border-[#00ff9d]/40 px-1.5 sm:px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-[#00ff9d]" />
                <span>SYSTEM_PREVIEW</span>
              </div>
            </div>
          )}

          {/* Bullets List */}
          <div className="overflow-y-auto max-h-[130px] min-[400px]:max-h-[150px] sm:max-h-[190px] pr-1.5 mb-2.5 sm:mb-3 no-scrollbar">
            <ul className="space-y-2">
              {proj.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="text-[#00ff9d] text-[10px] sm:text-xs mt-0.5 shrink-0 select-none">▶</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech Stack Pills */}
        {proj.techStack && (
          <div className="pt-2 border-t border-slate-800/60 mt-auto mb-2">
            <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold tracking-wider block mb-1">
              TECH STACK & DEPLOYMENT
            </span>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {proj.techStack.split(',').map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[9px] sm:text-[11px] bg-[#071113] border border-slate-700/80 text-slate-200 px-1.5 sm:px-2 py-0.5 rounded font-mono"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      {!isPeeking && (
        <div className="pt-2.5 sm:pt-3 border-t border-slate-800/80 mt-auto flex items-center justify-between shrink-0">
          <a
            href={proj.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`font-mono text-xs sm:text-sm font-bold px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 border transition-all duration-200 ${isHighlighted
                ? 'bg-[#00ff9d] text-black border-[#00ff9d] hover:bg-[#00ff9d]/90 shadow-[0_0_15px_rgba(0,255,157,0.4)]'
                : 'bg-[#081518] border-[#00ff9d]/40 text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black hover:border-[#00ff9d]'
              }`}
          >
            <GithubIcon className="w-4 h-4" />
            <span>EXPLORE REPOSITORY</span>
          </a>

          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            [REVISION: MAIN]
          </span>
        </div>
      )}
    </div>
  );
};

export default Projects;
