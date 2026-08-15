import React, { useRef, useState } from 'react';
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
} from 'lucide-react';

const Achievements = () => {
  const { headingCommand, list } = portfolioData.achievements;
  const targetRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Framer Motion scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Calculate percentage shift: 4 slides means total translation from 0% to -300% ( (N - 1) * 100% )
  const totalShift = `-${(list.length - 1) * 100}%`;
  const x = useTransform(scrollYProgress, [0, 1], ['0%', totalShift]);

  // Update active slide index based on scroll position
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const step = 1 / list.length;
    const currentStep = Math.min(list.length - 1, Math.floor(latest / step));
    setActiveIndex(currentStep);
  });

  // Generate ASCII-style progress bar
  const renderProgressBar = () => {
    const totalBars = 16;
    const activeStep = activeIndex + 1;
    const filledBars = Math.round((activeStep / list.length) * totalBars);
    const emptyBars = totalBars - filledBars;
    return '█'.repeat(filledBars) + '░'.repeat(emptyBars);
  };

  const renderIcon = (iconName, color) => {
    const iconClass = `w-8 h-8 sm:w-10 sm:h-10 ${
      color === 'amber'
        ? 'text-amber-400'
        : color === 'sky'
        ? 'text-[#00e5ff]'
        : color === 'fuchsia'
        ? 'text-purple-400'
        : 'text-[#00ff9d]'
    }`;

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
    <section ref={targetRef} id="achievements" className="relative h-[250vh] sm:h-[300vh] font-mono">
      {/* Sticky Viewport pinned while scrolling vertically */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none">
        
        {/* Top Header & Telemetry Bar */}
        <div>
          <SectionHeader command={headingCommand} />

          {/* Telemetry Index & Progress Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mb-2 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00ff9d]" />
              <span className="text-slate-200 font-bold">ACHIEVEMENT_SLIDESHOW</span>
              <span className="text-slate-500 font-mono">
                [SLIDE {String(activeIndex + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}]
              </span>
            </div>

            {/* Slide Navigation Dots & Progress Bar */}
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400 hidden sm:flex">
                <span>SCROLL DOWN FOR NEXT SLIDE</span>
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

        {/* Full-Page Slideshow Container */}
        <div className="relative flex-1 flex items-center overflow-hidden my-auto w-full">
          <motion.div
            style={{ x }}
            className="flex items-center w-full"
          >
            {list.map((item, idx) => {
              const isActive = activeIndex === idx;

              return (
                <div
                  key={idx}
                  className="w-full min-w-full shrink-0 flex items-center justify-center px-1 sm:px-4"
                >
                  <div
                    className={`w-full max-w-4xl lg:max-w-5xl h-[460px] sm:h-[500px] rounded-2xl p-6 sm:p-10 font-mono flex flex-col justify-between transition-all duration-500 shadow-2xl ${
                      isActive
                        ? item.color === 'amber'
                          ? 'bg-[#11170d] border-2 border-amber-400/90 shadow-[0_0_40px_rgba(251,191,36,0.25)] opacity-100 scale-100'
                          : item.color === 'sky'
                          ? 'bg-[#0a181c] border-2 border-[#00e5ff]/90 shadow-[0_0_40px_rgba(0,229,255,0.25)] opacity-100 scale-100'
                          : item.color === 'fuchsia'
                          ? 'bg-[#170e1c] border-2 border-purple-400/90 shadow-[0_0_40px_rgba(192,132,252,0.25)] opacity-100 scale-100'
                          : 'bg-[#0e1d20] border-2 border-[#00ff9d] shadow-[0_0_40px_rgba(0,255,157,0.25)] opacity-100 scale-100'
                        : 'bg-[#081214] border border-slate-800/80 opacity-20 scale-95'
                    }`}
                  >
                    <div>
                      {/* Terminal window dots & slide filename */}
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80 text-xs sm:text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
                          <span className="ml-2 text-slate-300 font-bold text-xs sm:text-sm">
                            {item.fileName}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded border font-semibold tracking-wider ${
                            item.color === 'amber'
                              ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                              : item.color === 'sky'
                              ? 'text-[#00e5ff] bg-[#00e5ff]/10 border-[#00e5ff]/30'
                              : item.color === 'fuchsia'
                              ? 'text-purple-400 bg-purple-400/10 border-purple-400/30'
                              : 'text-[#00ff9d] bg-[#00ff9d]/10 border-[#00ff9d]/30'
                          }`}
                        >
                          [ {item.badge} ]
                        </span>
                      </div>

                      {/* Icon & Category Badge Row */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="p-3 bg-[#050e10] rounded-xl border border-slate-800/90 shadow-inner">
                          {renderIcon(item.icon, item.color)}
                        </div>
                        <span className="text-xs sm:text-sm text-slate-300 font-bold tracking-wider bg-[#050e10] px-4 py-1.5 rounded-full border border-slate-800">
                          {item.tag}
                        </span>
                      </div>

                      {/* Giant Highlight Value */}
                      <h3
                        className={`text-4xl sm:text-6xl lg:text-7xl font-black mb-3 tracking-tight ${
                          item.color === 'amber'
                            ? 'text-amber-400'
                            : item.color === 'sky'
                            ? 'text-[#00e5ff]'
                            : item.color === 'fuchsia'
                            ? 'text-purple-400'
                            : 'text-[#00ff9d]'
                        }`}
                      >
                        {item.value}
                      </h3>

                      {/* Title / Label */}
                      <h4 className="text-lg sm:text-2xl text-slate-100 font-extrabold leading-snug mb-3">
                        {item.label}
                      </h4>

                      {/* Detailed Description */}
                      {item.details && (
                        <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                          {item.details}
                        </p>
                      )}
                    </div>

                    {/* Footer Status */}
                    <div className="pt-4 border-t border-slate-800/80 mt-auto flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-500 font-mono text-xs sm:text-sm font-semibold">
                        CATEGORY: {item.category}
                      </span>
                      <div className="flex items-center gap-2 text-[#00ff9d] font-bold text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>VERIFIED ACHIEVEMENT</span>
                      </div>
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
            [SCROLL VERTICALLY TO TRAVERSE SLIDESHOW]
          </span>
          <span className="text-[11px] text-[#00ff9d] font-semibold flex items-center gap-1.5 mx-auto sm:mx-0">
            <span>SCROLL TO PROCEED TO EDUCATION</span>
            <Zap className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
