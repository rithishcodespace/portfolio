import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  ZoomIn,
  X,
  CheckCircle2,
  Cloud,
  Layers,
  Terminal,
  Code,
  Calendar,
  Key,
  BadgeCheck,
  Sliders,
  MoveRight,
} from 'lucide-react';

const Certifications = () => {
  const { headingCommand, list } = portfolioData.certifications;
  const scrollRef = useRef(null);
  const trackRailRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0); // 0% to 100%
  const [isDraggingScrubber, setIsDraggingScrubber] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle native scroll updates to update scrubber position
  const handleScroll = () => {
    if (!scrollRef.current || isDraggingScrubber) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  // Convert Scrubber click / drag position into scrollLeft
  const handleScrubberMove = (clientX) => {
    if (!trackRailRef.current || !scrollRef.current) return;
    const rect = trackRailRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    scrollRef.current.scrollLeft = percentage * maxScroll;
    setScrollProgress(percentage * 100);
  };

  const handleMouseDownScrubber = (e) => {
    setIsDraggingScrubber(true);
    handleScrubberMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingScrubber) {
        handleScrubberMove(e.clientX);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingScrubber) {
        setIsDraggingScrubber(false);
      }
    };

    if (isDraggingScrubber) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingScrubber]);

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

  // Color styles mapping per certification theme
  const getColorStyles = (color) => {
    switch (color) {
      case 'amber':
        return {
          cardBg: 'bg-[#121008]/95',
          border: 'border-2 border-amber-500/40 hover:border-amber-400',
          glow: 'hover:shadow-[0_0_35px_rgba(251,191,36,0.25)]',
          badgeText: 'text-amber-400',
          badgeBg: 'bg-amber-400/10 border-amber-400/30',
          accentText: 'text-amber-400',
          tagBg: 'bg-amber-400/10 border-amber-400/20 text-amber-300',
          btnBg: 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
        };
      case 'sky':
        return {
          cardBg: 'bg-[#06151a]/95',
          border: 'border-2 border-[#00e5ff]/40 hover:border-[#00e5ff]',
          glow: 'hover:shadow-[0_0_35px_rgba(0,229,255,0.25)]',
          badgeText: 'text-[#00e5ff]',
          badgeBg: 'bg-[#00e5ff]/10 border-[#00e5ff]/30',
          accentText: 'text-[#00e5ff]',
          tagBg: 'bg-[#00e5ff]/10 border-[#00e5ff]/20 text-cyan-300',
          btnBg: 'bg-[#00e5ff] text-black hover:bg-[#00e5ff]/90 shadow-[0_0_15px_rgba(0,229,255,0.3)]',
        };
      case 'rose':
        return {
          cardBg: 'bg-[#170910]/95',
          border: 'border-2 border-rose-500/40 hover:border-rose-400',
          glow: 'hover:shadow-[0_0_35px_rgba(251,113,133,0.25)]',
          badgeText: 'text-rose-400',
          badgeBg: 'bg-rose-400/10 border-rose-400/30',
          accentText: 'text-rose-400',
          tagBg: 'bg-rose-400/10 border-rose-400/20 text-rose-300',
          btnBg: 'bg-rose-500 text-black hover:bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.3)]',
        };
      case 'violet':
        return {
          cardBg: 'bg-[#120a1b]/95',
          border: 'border-2 border-purple-500/40 hover:border-purple-400',
          glow: 'hover:shadow-[0_0_35px_rgba(192,132,252,0.25)]',
          badgeText: 'text-purple-400',
          badgeBg: 'bg-purple-400/10 border-purple-400/30',
          accentText: 'text-purple-400',
          tagBg: 'bg-purple-400/10 border-purple-400/20 text-purple-300',
          btnBg: 'bg-purple-500 text-black hover:bg-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]',
        };
      case 'emerald':
      default:
        return {
          cardBg: 'bg-[#081814]/95',
          border: 'border-2 border-[#00ff9d]/40 hover:border-[#00ff9d]',
          glow: 'hover:shadow-[0_0_35px_rgba(0,255,157,0.25)]',
          badgeText: 'text-[#00ff9d]',
          badgeBg: 'bg-[#00ff9d]/10 border-[#00ff9d]/30',
          accentText: 'text-[#00ff9d]',
          tagBg: 'bg-[#00ff9d]/10 border-[#00ff9d]/20 text-emerald-300',
          btnBg: 'bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 shadow-[0_0_15px_rgba(0,255,157,0.3)]',
        };
    }
  };

  const renderIcon = (iconName, theme) => {
    const iconClass = `w-6 h-6 sm:w-7 sm:h-7 ${theme.accentText}`;
    switch (iconName) {
      case 'cloud':
        return <Cloud className={iconClass} />;
      case 'layers':
        return <Layers className={iconClass} />;
      case 'terminal':
        return <Terminal className={iconClass} />;
      case 'code':
      default:
        return <Code className={iconClass} />;
    }
  };

  return (
    <section id="certs" className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 font-mono scroll-mt-24 select-none">
      {/* Section Header */}
      <SectionHeader command={headingCommand} />

      {/* Header Info Bar */}
      <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00ff9d]" />
          <span className="text-slate-200 font-bold uppercase tracking-wider">CERTIFICATE_STREAM</span>
          <span className="text-[#00ff9d] font-mono text-[11px] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
            [{list.length} CREDENTIALS VERIFIED]
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[11px] hidden sm:flex">
          <Sliders className="w-3.5 h-3.5 text-[#00ff9d]" />
          <span>DRAG SCRUBBER OR SWIPE HORIZONTALLY</span>
        </div>
      </div>

      {/* TACTILE SCRUBBER TIMELINE RAIL */}
      <div className="mb-6 px-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <span className="text-slate-500">SCRUBBER_RAIL</span>
          <span className="text-[#00ff9d] font-bold">
            TRACK POSITION: {Math.round(scrollProgress)}%
          </span>
        </div>

        {/* Interactive Scrub Rail Bar */}
        <div
          ref={trackRailRef}
          onMouseDown={handleMouseDownScrubber}
          className="relative h-3 bg-[#081518] rounded-full border border-slate-800 cursor-pointer overflow-visible group"
        >
          {/* Active Fill Track */}
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#00e5ff] to-[#00ff9d] rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(0,255,157,0.4)]"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* Interactive Thumb Scrubber Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-lg bg-[#071317] border-2 border-[#00ff9d] shadow-[0_0_15px_rgba(0,255,157,0.6)] flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-115 transition-transform"
            style={{ left: `${scrollProgress}%` }}
          >
            <div className="w-1.5 h-3 bg-[#00ff9d] rounded-full" />
          </div>
        </div>
      </div>

      {/* CONTINUOUS HORIZONTAL CARD TRACK */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-stretch gap-6 overflow-x-auto py-4 px-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {list.map((item, idx) => {
            const theme = getColorStyles(item.color);

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`snap-start w-[320px] min-[400px]:w-[360px] sm:w-[420px] shrink-0 rounded-2xl p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between shadow-2xl transition-all duration-300 ${theme.cardBg} ${theme.border} ${theme.glow}`}
              >
                <div>
                  {/* Card Window Bar */}
                  <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
                      <span className="ml-1.5 text-slate-300 font-bold text-xs truncate max-w-[130px]">
                        {item.fileName}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-semibold tracking-wider flex items-center gap-1 ${theme.badgeText} ${theme.badgeBg}`}
                    >
                      <BadgeCheck className="w-3 h-3" />
                      <span>{item.badge}</span>
                    </span>
                  </div>

                  {/* Image OR Digital Artifact Box */}
                  {item.image ? (
                    <div
                      onClick={() =>
                        setSelectedImage({
                          src: item.image,
                          title: item.title,
                          issuer: item.issuer,
                          fileName: item.fileName,
                        })
                      }
                      className="relative mb-4 rounded-xl overflow-hidden border border-slate-700/80 bg-black/60 cursor-pointer group/img"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 sm:h-44 object-contain bg-black/80 transform group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold backdrop-blur-[2px]">
                        <ZoomIn className={`w-4 h-4 ${theme.accentText}`} />
                        <span>EXPAND ARTIFACT</span>
                      </div>
                    </div>
                  ) : (
                    /* Digital Certificate Artifact Container */
                    <div className="relative mb-4 rounded-xl border border-slate-800/90 bg-[#040d10] p-4 flex flex-col justify-between shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className={`w-4 h-4 ${theme.accentText}`} />
                          <span className="text-slate-300 font-bold tracking-wide">VERIFIED_CREDENTIAL</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">CRED_0{idx + 1}</span>
                      </div>

                      <div className="flex items-start gap-3 my-1">
                        <div className="p-2.5 bg-[#07171c] rounded-xl border border-slate-700/60 shrink-0">
                          {renderIcon(item.icon, theme)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5 truncate">
                            {item.issuer}
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-slate-100 leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2.5 border-t border-slate-800/80 mt-2 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>YEAR: {item.issueDate}</span>
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[130px]">
                          <Key className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">ID: {item.credentialId}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Description Box */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#030a0d]/70 p-3 rounded-lg border border-slate-800/80 mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="mb-4">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                      COMPETENCIES:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className={`text-[10px] px-2 py-0.5 rounded border font-medium ${theme.tagBg}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${theme.accentText}`} />
                    <span>VERIFIED</span>
                  </span>

                  {item.verifyUrl && (
                    <a
                      href={item.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${theme.btnBg}`}
                    >
                      <span>VERIFY</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Instruction Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-800/60 font-mono">
        <span className="hidden sm:inline">
          [USE SCRUBBER RAIL OR SWIPE HORIZONTALLY TO TRAVERSE CREDENTIALS]
        </span>
        <span className="text-[11px] text-[#00ff9d] font-semibold flex items-center gap-1.5 mx-auto sm:mx-0">
          <span>DRAG SCRUBBER KNOB TO SEEK</span>
          <MoveRight className="w-3.5 h-3.5 animate-pulse" />
        </span>
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
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
                <span className="ml-2 font-bold text-slate-200">
                  CERTIFICATE_INSPECTION // {selectedImage.fileName}
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

            {/* Modal Image */}
            <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center max-h-[75vh]">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 font-mono">
              <div>
                <span className="font-bold text-slate-100">{selectedImage.title}</span>
                <span className="text-slate-500 ml-2">[{selectedImage.issuer}]</span>
              </div>
              <span className="text-[#00ff9d] flex items-center gap-1.5 font-bold">
                <Award className="w-4 h-4" />
                <span>OFFICIAL CERTIFICATION ARTIFACT</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certifications;
