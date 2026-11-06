
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { portfolioData } from '../data/portfolioData';
import { Zap, Terminal, FileText } from 'lucide-react';
import { GithubIcon } from './Icons';
import RequestResumeModal from './RequestResumeModal';

import portraitWebp from '../assets/portrait.webp';
import portraitPng from '../assets/portrait.png';

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
  const portraitRef = useRef(null);

  const heroNameText = 'Rithish S';

  // Track cursor position for the interactive background.
  useEffect(() => {
    const handleMouseMove = (e) => {
      const heroElem = heroRef.current;
      if (!heroElem) return;

      const rect = heroElem.getBoundingClientRect();

      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // GSAP entrance animations.
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      const animatedElements = [
        sessionBadgeRef.current,
        tagOpenRef.current,
        tagCloseRef.current,
        roleRef.current,
        taglineRef.current,
        buttonsRef.current,
        portraitRef.current,
      ].filter(Boolean);

      if (prefersReducedMotion) {
        gsap.set(animatedElements, {
          opacity: 1,
          y: 0,
          scale: 1,
        });

        gsap.set(nameCharsRef.current.filter(Boolean), {
          opacity: 1,
          y: 0,
        });

        if (buttonsRef.current) {
          gsap.set(buttonsRef.current.children, {
            opacity: 1,
            y: 0,
            scale: 1,
          });
        }

        return;
      }

      gsap.set(sessionBadgeRef.current, {
        opacity: 0,
        y: -12,
        scale: 0.96,
      });

      gsap.set(nameCharsRef.current.filter(Boolean), {
        opacity: 0,
        y: 8,
      });

      gsap.set([tagOpenRef.current, tagCloseRef.current], {
        opacity: 0,
        y: 8,
        scale: 0.85,
      });

      gsap.set([roleRef.current, taglineRef.current], {
        opacity: 0,
        y: 12,
      });

      gsap.set(portraitRef.current, {
        opacity: 0,
        y: 20,
      });

      const btnContainer = buttonsRef.current;

      if (btnContainer) {
        gsap.set(btnContainer.children, {
          opacity: 0,
          y: 12,
          scale: 0.96,
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      // 1. Terminal prompt.
      tl.to(sessionBadgeRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
      });

      // 2. Animated name.
      if (nameCharsRef.current.length > 0) {
        tl.to(
          nameCharsRef.current.filter(Boolean),
          {
            opacity: 1,
            y: 0,
            duration: 0.22,
            stagger: 0.05,
          },
          '-=0.1'
        );
      }

      // 3. Opening and closing code tags.
      tl.to(
        tagOpenRef.current,
        {
          opacity: 0.95,
          y: 0,
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
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.4)',
        },
        '-=0.15'
      );

      // 4. Portrait entrance.
      tl.to(
        portraitRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
        '-=0.3'
      );

      // 5. Professional role.
      tl.to(
        roleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        '-=0.45'
      );

      // 6. Description.
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        '-=0.2'
      );

      // 7. CTA buttons.
      if (btnContainer) {
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
        return <Zap className="h-4 w-4 text-[#00ff9d]" />;

      case 'terminal':
        return <Terminal className="h-4 w-4 text-[#00e5ff]" />;

      case 'fileText':
        return <FileText className="h-4 w-4 text-[#00ff9d]" />;

      case 'github':
        return <GithubIcon className="h-4 w-4 text-[#00ff9d]" />;

      default:
        return null;
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-0 pt-20 select-none sm:px-6 lg:px-8 xl:px-12"
    >
      {/* Interactive background grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20 transition-opacity duration-300"
        style={{
          backgroundImage:
            'radial-gradient(#00ff9d 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 157, 0.08), transparent 75%)`,
        }}
      />

      {/* Main responsive hero layout */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl grid-cols-1 items-center gap-6 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-12 lg:gap-4 xl:gap-6">

        {/* LEFT COLUMN: Introduction */}
        <div className="relative z-20 flex min-w-0 flex-col items-start justify-center space-y-4 py-4 text-left -translate-y-4 sm:space-y-5 sm:-translate-y-6 lg:col-span-7 lg:space-y-6 lg:py-6 lg:-translate-y-12 xl:-translate-y-14">

          {/* Terminal session badge */}
          <div
            ref={sessionBadgeRef}
            className="flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-[#00ff9d]/30 bg-[#071317]/90 px-3.5 py-1.5 font-mono text-xs text-slate-300 shadow-[0_0_15px_rgba(0,255,157,0.12)] backdrop-blur-md transition-colors duration-200 hover:border-[#00ff9d] sm:px-4 sm:text-sm"
          >
            <span className="shrink-0 font-bold text-[#00ff9d]">
              $
            </span>

            <span className="truncate font-medium tracking-wide text-[#00ff9d]">
              {command || './init_session.sh --user=rithish'}
            </span>
          </div>

          {/* Name */}
          <h1 className="inline-flex max-w-full flex-nowrap items-center whitespace-nowrap font-mono text-2xl font-extrabold leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            <span
              ref={tagOpenRef}
              className="mr-0.5 inline-block shrink-0 font-extrabold text-white opacity-95"
            >
              &lt;
            </span>

            <span className="inline-flex shrink-0 font-extrabold text-[#00ff9d] text-glow-green">
              {heroNameText.split('').map((char, index) => (
                <span
                  key={index}
                  ref={(el) => {
                    nameCharsRef.current[index] = el;
                  }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>

            <span
              ref={tagCloseRef}
              className="ml-1.5 inline-block shrink-0 font-extrabold text-white opacity-95"
            >
              /&gt;
            </span>
          </h1>

          {/* Professional role */}
          <p
            ref={roleRef}
            className="max-w-full font-mono text-sm font-semibold leading-relaxed tracking-wide text-[#00ff9d] sm:text-base md:text-lg xl:text-xl"
          >
            Backend Engineer | Distributed Systems | Cloud &amp; DevOps
          </p>

          {/* Description */}
          <p
            ref={taglineRef}
            className="max-w-xl font-mono text-left text-xs font-medium leading-relaxed text-slate-300 sm:text-sm md:text-base"
          >
            {tagline}
          </p>

          {/* CTA buttons */}
          <div
            ref={buttonsRef}
            className="flex w-full flex-wrap items-center gap-2.5 pt-2 sm:gap-3"
          >
            {buttons.map((btn, idx) => {
              const isProjects = btn.type === 'projects';
              const isResume = btn.type === 'resume';

              const buttonClass = `flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-xs font-bold transition-all duration-150 active:scale-95 sm:px-4 sm:py-2.5 sm:text-sm ${
                isProjects
                  ? 'border-[#00ff9d] bg-[#00ff9d]/15 text-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:-translate-y-0.5 hover:bg-[#00ff9d]/25 hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]'
                  : 'border-[#00ff9d]/30 bg-[#081518]/90 text-[#00ff9d] shadow-sm hover:-translate-y-0.5 hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 hover:text-white'
              }`;

              if (isResume) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className={`${buttonClass} cursor-pointer`}
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
                  onClick={(e) => {
                    if (btn.href.startsWith('#')) {
                      e.preventDefault();
                      const target = document.querySelector(btn.href);
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  target={
                    btn.href.startsWith('http') ? '_blank' : '_self'
                  }
                  rel={
                    btn.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className={`${buttonClass} cursor-pointer`}
                >
                  {renderIcon(btn.icon)}
                  <span>{btn.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Enlarged portrait */}
        <div
          ref={portraitRef}
          className="pointer-events-none relative z-10 flex w-full min-w-0 items-end justify-center self-end select-none lg:col-span-5 lg:h-[calc(100vh-5rem)] lg:justify-end"
        >
          {/* Green glow behind the portrait */}
          <div className="pointer-events-none absolute bottom-[5%] right-[-5%] h-[65%] w-full rounded-full bg-[#00ff9d]/15 blur-[100px]" />

          {/* Keep a normal portrait on mobile; enlarge and position it on desktop */}
          <picture className="relative z-10 flex w-full max-w-[370px] items-end justify-center sm:max-w-[450px] md:max-w-[530px] lg:absolute lg:bottom-0 lg:right-[-5.5rem] lg:w-[min(56vw,780px)] lg:max-w-none xl:right-[-6.5rem] xl:w-[min(59vw,870px)]">
            <source srcSet={portraitWebp} type="image/webp" />

            <img
              src={portraitPng}
              alt="Rithish S — engraved digital portrait"
              className="block h-auto w-full max-h-[56vh] object-contain object-bottom sm:max-h-[66vh] md:max-h-[73vh] lg:max-h-none lg:w-full select-none pointer-events-none"
              loading="eager"
              decoding="async"
              draggable="false"
            />
          </picture>
        </div>
      </div>

      {/* Resume request modal */}
      <RequestResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
