import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { portfolioData } from '../data/portfolioData';
import { Zap, Terminal, FileText } from 'lucide-react';
import { GithubIcon } from './Icons';
import RequestResumeModal from './RequestResumeModal';

const Hero = () => {
  const { command, tagline, buttons } = portfolioData.hero;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const heroRef = useRef(null);
  const sessionBadgeRef = useRef(null);
  const tagOpenRef = useRef(null);
  const tagCloseRef = useRef(null);
  const roleRef = useRef(null);
  const taglineRef = useRef(null);
  const buttonsRef = useRef(null);
  const nameCharsRef = useRef([]);

  const heroNameText = "Rithish S";

  // Instant hardware-accelerated cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect =
        e.currentTarget.getBoundingClientRect?.() || { left: 0, top: 0 };

      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const heroElem = document.getElementById('home');

    if (heroElem) {
      heroElem.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (heroElem) {
        heroElem.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // GSAP Master Terminal Boot Entrance Animation Sequence
  useLayoutEffect(() => {
    const prefersReducedMotion = window
      .matchMedia('(prefers-reduced-motion: reduce)')
      .matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            sessionBadgeRef.current,
            tagOpenRef.current,
            tagCloseRef.current,
            roleRef.current,
            taglineRef.current,
            buttonsRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
          }
        );

        if (nameCharsRef.current.length > 0) {
          gsap.set(nameCharsRef.current, {
            opacity: 1,
            y: 0,
          });
        }

        return;
      }

      // Hide elements initially to prevent flash of unstyled content
      gsap.set(sessionBadgeRef.current, {
        opacity: 0,
        y: -12,
        scale: 0.96,
      });

      if (nameCharsRef.current.length > 0) {
        gsap.set(nameCharsRef.current, {
          opacity: 0,
          y: 8,
        });
      }

      gsap.set(tagOpenRef.current, {
        opacity: 0,
        x: -12,
        scale: 0.85,
      });

      gsap.set(tagCloseRef.current, {
        opacity: 0,
        x: 12,
        scale: 0.85,
      });

      gsap.set(roleRef.current, {
        opacity: 0,
        y: 12,
      });

      gsap.set(taglineRef.current, {
        opacity: 0,
        y: 12,
      });

      const btnContainer = buttonsRef.current;

      if (btnContainer && btnContainer.children) {
        gsap.set(btnContainer.children, {
          opacity: 0,
          y: 12,
          scale: 0.96,
        });
      }

      // Create Master GSAP Timeline
      const tl = gsap.timeline({
        defaults: {
          ease: 'power2.out',
        },
      });

      // 1. Session Prompt Pill Reveal
      tl.to(sessionBadgeRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
      });

      // 2. Character-by-Character Name Reveal ("Rithish S")
      if (nameCharsRef.current.length > 0) {
        tl.to(
          nameCharsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.22,
            stagger: 0.06,
            ease: 'power2.out',
          },
          '-=0.1'
        );
      }

      // 3. Mechanical Code Tags Reveal (< appears first, then />)
      tl.to(
        tagOpenRef.current,
        {
          opacity: 0.95,
          x: 0,
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.4)',
        },
        '+=0.05'
      );

      tl.to(
        tagCloseRef.current,
        {
          opacity: 0.95,
          x: 0,
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.4)',
        },
        '-=0.15'
      );

      // 4. Role Subtitle Bar Reveal
      tl.to(
        roleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        '+=0.08'
      );

      // 5. Tagline Description Reveal
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        '-=0.2'
      );

      // 6. Action Buttons Staggered Reveal
      if (btnContainer && btnContainer.children) {
        tl.to(
          btnContainer.children,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            stagger: 0.08,
          },
          '-=0.2'
        );
      }
    }, heroRef);

    return () => ctx.revert();
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
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-16 relative z-10 text-center select-none overflow-hidden"
    >
      {/* Background Interactive Developer Grid Mask */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20 transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(#00ff9d 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
        }}
      />

      {/* Subtle Radial Cursor Glow Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 157, 0.08), transparent 75%)`,
        }}
      />

      <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">

        {/* 1. Terminal Session Prompt Pill */}
        <div
          ref={sessionBadgeRef}
          className="mb-6 font-mono text-xs sm:text-sm text-slate-300 flex items-center gap-2 justify-center bg-[#071317]/90 px-3.5 sm:px-5 py-2 rounded-full border border-[#00ff9d]/30 shadow-[0_0_20px_rgba(0,255,157,0.1)] backdrop-blur-md hover:border-[#00ff9d] transition-colors duration-200 max-w-full overflow-hidden"
        >
          <span className="text-[#00ff9d] font-bold shrink-0">$</span>

          <span className="text-[#00ff9d] font-medium tracking-wide truncate">
            {command || './init_session.sh --user=rithish'}
          </span>
        </div>

        {/* 2. Hero Name Title */}
        <h1 className="text-3xl min-[380px]:text-4xl min-[480px]:text-5xl sm:text-7xl md:text-8xl font-extrabold font-mono tracking-tight mb-4 sm:mb-6 leading-tight flex items-center justify-center gap-1 sm:gap-2 flex-wrap cursor-default">
          <span
            ref={tagOpenRef}
            className="text-white font-extrabold opacity-95 inline-block"
          >
            &lt;
          </span>

          <span className="text-[#00ff9d] text-glow-green font-extrabold inline-flex">
            {heroNameText.split('').map((char, index) => (
              <span
                key={index}
                ref={(el) => (nameCharsRef.current[index] = el)}
                className="inline-block opacity-0"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>

          <span
            ref={tagCloseRef}
            className="text-white font-extrabold opacity-95 inline-block"
          >
            /&gt;
          </span>
        </h1>

        {/* 3. Role Subtitle Bar */}
        <p
          ref={roleRef}
          className="text-xs min-[380px]:text-sm sm:text-lg md:text-xl font-mono text-[#00ff9d] font-semibold mb-4 max-w-3xl leading-relaxed tracking-wide px-2"
        >
          Backend Engineer | Distributed Systems | Cloud & DevOps
        </p>

        {/* 4. Tagline */}
        <p
          ref={taglineRef}
          className="mb-6 sm:mb-8 font-mono text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl text-center leading-relaxed px-2 font-medium"
        >
          {tagline}
        </p>

        {/* 5. Action Buttons Row */}
        <div
          ref={buttonsRef}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-10 sm:mb-12"
        >
          {buttons.map((btn, idx) => {
            const isProjects = btn.type === 'projects';
            const isResume = btn.type === 'resume';

            if (isResume) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="font-mono text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 border transition-all duration-150 active:scale-95 cursor-pointer bg-[#081518]/90 border-[#00ff9d]/30 text-[#00ff9d] hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 hover:text-white hover:-translate-y-1 shadow-sm"
                >
                  {renderIcon(btn.icon)}
                  <span>{btn.label}</span>
                </button>
              );
            }

            return (
              <a
                key={idx}
                href={btn.href}
                target={btn.href.startsWith('http') ? '_blank' : '_self'}
                rel={
                  btn.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : ''
                }
                className={`font-mono text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 border transition-all duration-150 active:scale-95 cursor-pointer ${
                  isProjects
                    ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:bg-[#00ff9d]/25 hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] hover:-translate-y-1'
                    : 'bg-[#081518]/90 border-[#00ff9d]/30 text-[#00ff9d] hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 hover:text-white hover:-translate-y-1 shadow-sm'
                }`}
              >
                {renderIcon(btn.icon)}
                <span>{btn.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Request Resume Modal */}
      <RequestResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </section>
  );
};

export default Hero;