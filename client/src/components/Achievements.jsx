import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import {
  Trophy,
  Award,
  Medal,
  Code,
  Terminal,
  ChevronRight,
  CheckCircle2,
  Zap,
  ZoomIn,
  X,
  ExternalLink,
} from 'lucide-react';

const Achievements = () => {
  const { headingCommand, list } = portfolioData.achievements;
  const targetRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // Framer Motion scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Calculate percentage shift: list.length slides means total translation from 0% to -((N - 1) * 100)%
  const totalShift = `-${(list.length - 1) * 100}%`;
  const x = useTransform(scrollYProgress, [0, 1], ['0%', totalShift]);

  // Update active slide index based on scroll position
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const step = 1 / list.length;
    const currentStep = Math.min(list.length - 1, Math.floor(latest / step));
    setActiveIndex(currentStep);
  });

  // Close Lightbox modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Distinct Theme Styling for each achievement card
  const getColorStyles = (color) => {
    switch (color) {
      case 'amber':
        return {
          cardBg: 'bg-[#141209]',
          border: 'border-2 border-amber-400/90',
          shadow: 'shadow-[0_0_45px_rgba(251,191,36,0.22)]',
          badgeText: 'text-amber-400',
          badgeBg: 'bg-amber-400/10 border-amber-400/30',
          imgBorder: 'border-amber-400/40 group-hover:border-amber-400',
          metricText: 'text-amber-400',
        };
      case 'sky':
        return {
          cardBg: 'bg-[#08171d]',
          border: 'border-2 border-[#00e5ff]/90',
          shadow: 'shadow-[0_0_45px_rgba(0,229,255,0.22)]',
          badgeText: 'text-[#00e5ff]',
          badgeBg: 'bg-[#00e5ff]/10 border-[#00e5ff]/30',
          imgBorder: 'border-[#00e5ff]/40 group-hover:border-[#00e5ff]',
          metricText: 'text-[#00e5ff]',
        };
      case 'rose':
        return {
          cardBg: 'bg-[#1a0b12]',
          border: 'border-2 border-rose-400/90',
          shadow: 'shadow-[0_0_45px_rgba(251,113,133,0.22)]',
          badgeText: 'text-rose-400',
          badgeBg: 'bg-rose-400/10 border-rose-400/30',
          imgBorder: 'border-rose-400/40 group-hover:border-rose-400',
          metricText: 'text-rose-400',
        };
      case 'violet':
        return {
          cardBg: 'bg-[#130b1c]',
          border: 'border-2 border-purple-400/90',
          shadow: 'shadow-[0_0_45px_rgba(192,132,252,0.22)]',
          badgeText: 'text-purple-400',
          badgeBg: 'bg-purple-400/10 border-purple-400/30',
          imgBorder: 'border-purple-400/40 group-hover:border-purple-400',
          metricText: 'text-purple-400',
        };
      case 'emerald':
      default:
        return {
          cardBg: 'bg-[#091b16]',
          border: 'border-2 border-[#00ff9d]',
          shadow: 'shadow-[0_0_45px_rgba(0,255,157,0.22)]',
          badgeText: 'text-[#00ff9d]',
          badgeBg: 'bg-[#00ff9d]/10 border-[#00ff9d]/30',
          imgBorder: 'border-[#00ff9d]/40 group-hover:border-[#00ff9d]',
          metricText: 'text-[#00ff9d]',
        };
    }
  };

  // Generate ASCII-style progress bar
  const renderProgressBar = () => {
    const totalBars = 16;
    const activeStep = activeIndex + 1;
    const filledBars = Math.round((activeStep / list.length) * totalBars);
    const emptyBars = totalBars - filledBars;
    return '█'.repeat(filledBars) + '░'.repeat(emptyBars);
  };

  const renderIcon = (iconName, color) => {
    const theme = getColorStyles(color);
    const iconClass = `w-7 h-7 sm:w-9 sm:h-9 ${theme.metricText}`;

    switch (iconName) {
      case 'award':
        return <Award className={iconClass} />;
      case 'trophy':
        return <Trophy className={iconClass} />;
      case 'medal':
        return <Medal className={iconClass} />;
      case 'code':
      default:
        return <Code className={iconClass} />;
    }
  };

  return (
    <section ref={targetRef} id="achievements" className="relative h-[280vh] sm:h-[320vh] font-mono">
      {/* Sticky Viewport pinned while scrolling vertically */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none">
        
        {/* Top Header & Telemetry Bar */}
        <div>
          <SectionHeader command={headingCommand} />

          {/* Telemetry Index & Progress Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mb-2 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00ff9d]" />
              <span className="text-slate-200 font-bold">ACHIEVEMENTS_GALLERY</span>
              <span className="text-slate-500 font-mono">
                [SLIDE {String(activeIndex + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}]
              </span>
            </div>

            {/* Slide Navigation Dots & Progress Bar */}
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400 hidden sm:flex">
                <span>SCROLL DOWN TO EXPLORE</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#00ff9d] animate-pulse" />
              </div>

              {/* Dots indicator */}
              <div className="flex items-center gap-1.5 mr-2">
                {list.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === dotIdx
                        ? 'w-6 bg-[#00ff9d]'
                        : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#00ff9d] tracking-widest">{renderProgressBar()}</span>
                <span className="text-slate-400 font-bold">
                  {Math.round(((activeIndex + 1) / list.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Page Image-First Slideshow Container */}
        <div className="relative flex-1 flex items-center overflow-hidden my-auto w-full">
          <motion.div
            style={{ x }}
            className="flex items-center w-full"
          >
            {list.map((item, idx) => {
              const isActive = activeIndex === idx;
              const theme = getColorStyles(item.color);

              return (
                <div
                  key={idx}
                  className="w-full min-w-full shrink-0 flex items-center justify-center px-1 sm:px-4"
                >
                  {/* Card Container: Fixed aspect layout */}
                  <div
                    className={`w-full max-w-4xl lg:max-w-5xl h-[480px] sm:h-[520px] rounded-2xl p-5 sm:p-8 font-mono flex flex-col justify-between transition-all duration-500 shadow-2xl ${
                      isActive
                        ? `${theme.cardBg} ${theme.border} ${theme.shadow} opacity-100 scale-100`
                        : 'bg-[#081214] border border-slate-800/80 opacity-25 scale-95'
                    }`}
                  >
                    <div>
                      {/* Window Header */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800/80 text-xs sm:text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
                          <span className="ml-2 text-slate-300 font-bold text-xs sm:text-sm">
                            {item.fileName}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded border font-semibold tracking-wider flex items-center gap-1.5 ${theme.badgeText} ${theme.badgeBg}`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>[ {item.badge} ]</span>
                        </span>
                      </div>

                      {/* Main Grid: 60% IMAGE (7 cols) / 40% TEXT (5 cols) on Desktop */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        
                        {/* 1. VISUAL EVIDENCE FRAME (Dominant 60% area / 7 cols) */}
                        <div className="md:col-span-7 relative group">
                          {item.image ? (
                            <div
                              onClick={() => setSelectedImage({
                                src: item.image,
                                title: item.label,
                                fileName: item.fileName,
                                badge: item.badge,
                              })}
                              className={`relative rounded-xl overflow-hidden border ${theme.imgBorder} shadow-2xl bg-[#040c0e] cursor-pointer transition-all duration-300`}
                            >
                              <img
                                src={item.image}
                                alt={item.label}
                                className="w-full h-52 sm:h-64 lg:h-72 object-contain bg-black/60 rounded-xl transform group-hover:scale-[1.02] transition-transform duration-500"
                              />

                              {/* Evidence Badge Overlay */}
                              <div className="absolute top-2.5 left-2.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] border font-mono font-bold flex items-center gap-1.5 shadow-md border-slate-700 text-slate-200">
                                <Award className={`w-3.5 h-3.5 ${theme.badgeText}`} />
                                <span>ACHIEVEMENT ARTIFACT</span>
                              </div>

                              {/* Zoom Lightbox Hint Overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold font-mono backdrop-blur-[2px]">
                                <ZoomIn className={`w-5 h-5 ${theme.badgeText}`} />
                                <span>CLICK TO EXPAND IMAGE</span>
                              </div>
                            </div>
                          ) : (
                            /* Digital Certificate Artifact fallback */
                            <div className="relative rounded-xl border border-slate-700/80 bg-[#050e10] p-6 h-52 sm:h-64 lg:h-72 flex flex-col justify-between shadow-xl">
                              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs">
                                <span className="text-slate-400 font-bold">OFFICIAL_RESULT_ARTIFACT</span>
                                <span className={`font-mono text-[11px] ${theme.badgeText}`}>[ OFFICIAL ]</span>
                              </div>

                              <div className="flex items-center gap-4 my-auto">
                                <div className="p-4 bg-[#08171a] rounded-xl border border-slate-700 shrink-0">
                                  {renderIcon(item.icon, item.color)}
                                </div>
                                <div>
                                  <span className="text-[11px] text-slate-400 font-bold tracking-wider uppercase block mb-1">
                                    {item.tag}
                                  </span>
                                  <h4 className="text-xl sm:text-2xl font-black text-slate-100">
                                    {item.label}
                                  </h4>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/80 font-mono">
                                <span>ISSUER: {item.category}</span>
                                <span className={theme.badgeText}>OFFICIAL</span>
                              </div>
                            </div>
                          )}

                          {/* Evidence Caption */}
                          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
                            <span>REF: {item.fileName}</span>
                            <span className={`flex items-center gap-1 ${theme.badgeText}`}>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>CLICK IMAGE TO ZOOM</span>
                            </span>
                          </div>
                        </div>

                        {/* 2. CONCISE TEXT CONTEXT (40% area / 5 cols) */}
                        <div className="md:col-span-5 flex flex-col justify-center">
                          {/* Achievement Tag */}
                          <span className="text-[11px] text-slate-400 font-bold tracking-wider uppercase bg-[#050e10] px-3 py-1 rounded-md border border-slate-800 w-fit mb-3">
                            {item.tag}
                          </span>

                          {/* Giant Value */}
                          <h3 className={`text-4xl sm:text-5xl font-black mb-2 tracking-tight ${theme.metricText}`}>
                            {item.value}
                          </h3>

                          {/* Title / Label */}
                          <h4 className="text-base sm:text-lg text-slate-100 font-extrabold leading-snug mb-3">
                            {item.label}
                          </h4>

                          {/* Concise One-Line Context */}
                          {item.details && (
                            <p className="text-xs text-slate-300 leading-relaxed bg-[#050e10]/80 p-3 rounded-lg border border-slate-800/80 mb-3">
                              {item.details}
                            </p>
                          )}

                          {/* Embedded Profile / Project URL Link Button */}
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 font-bold text-xs sm:text-sm transition-all duration-200 shadow-[0_0_15px_rgba(0,255,157,0.3)] w-fit mt-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>VIEW LEETCODE PROFILE</span>
                            </a>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Compact Bottom Metadata Bar */}
                    <div className="pt-3.5 border-t border-slate-800/80 mt-auto flex items-center justify-between text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-4">
                        <span><strong className="text-slate-300">CATEGORY:</strong> {item.category}</span>
                      </div>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`flex items-center gap-1.5 font-bold hover:underline ${theme.badgeText}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>leetcode.com/u/rithishcodespace</span>
                        </a>
                      ) : (
                        <div className={`flex items-center gap-1.5 font-bold ${theme.badgeText}`}>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>RECORDED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Section Footer Navigation Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/60 font-mono">
          <span className="hidden sm:inline">
            [SCROLL DOWN TO TRAVERSE ACHIEVEMENTS]
          </span>
          <span className="text-[11px] text-[#00ff9d] font-semibold flex items-center gap-1.5 mx-auto sm:mx-0">
            <span>SCROLL TO PROCEED TO EDUCATION</span>
            <Zap className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#071317] border-2 border-[#00ff9d] rounded-2xl max-w-5xl w-full p-4 sm:p-6 shadow-[0_0_50px_rgba(0,255,157,0.3)] font-mono text-slate-200 overflow-hidden flex flex-col my-auto cursor-default"
          >
            {/* Modal Window Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
                <span className="ml-2 font-bold text-slate-200">
                  ACHIEVEMENT_INSPECTION // {selectedImage.fileName}
                </span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 bg-slate-800 hover:bg-red-900/50 hover:text-red-400 rounded-lg text-slate-400 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox High-Res Image View */}
            <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center max-h-[75vh]">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 font-mono">
              <span className="font-bold text-slate-200">{selectedImage.title}</span>
              <span className="text-[#00ff9d] flex items-center gap-1.5 font-bold">
                <Award className="w-4 h-4" />
                <span>OFFICIAL ACHIEVEMENT ARTIFACT</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Achievements;
