import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import {
  MapPin,
  Mail,
  RotateCw,
  Code2,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  Terminal,
  Calendar,
  Zap,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

const About = () => {
  const { headingCommand, profile, summary } = portfolioData.about;
  const [isLeftFlipped, setIsLeftFlipped] = useState(false);
  const [isRightFlipped, setIsRightFlipped] = useState(false);

  const human = profile.humanTxt || {};
  const activity = summary.activityLog || {};

  return (
    <section id="about" className="py-16 sm:py-24 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* ========================================================================= */}
        {/* Left Column: Avatar Profile Card (Flip 3D) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 perspective-1000 min-h-[520px] min-[400px]:min-h-[560px] sm:min-h-[620px] group">
          <div
            className={`w-full h-full relative transform-style-3d transition-transform duration-700 ease-in-out cursor-pointer ${
              isLeftFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsLeftFlipped(!isLeftFlipped)}
          >
            {/* FRONT SIDE: Profile Card */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-[#0c1618] border border-[#00ff9d]/25 hover:border-[#00ff9d] rounded-xl p-5 sm:p-7 shadow-xl hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between select-none">
              <div>
                {/* Header controls */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-slate-800/70 font-mono text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block"></span>
                    <span className="ml-1 sm:ml-2 text-slate-300 font-medium text-xs sm:text-sm">{profile.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs text-[#00ff9d] font-mono flex items-center gap-1 bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/20">
                      <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>TAP TO FLIP</span>
                    </span>
                  </div>
                </div>

                {/* Avatar Image */}
                <div className="relative mb-4 sm:mb-5 mx-auto max-w-[200px] min-[400px]:max-w-[240px] sm:max-w-[260px] rounded-lg overflow-hidden border border-[#00ff9d]/30 shadow-[0_0_20px_rgba(0,255,157,0.15)] group-hover:scale-[1.02] transition-transform">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>

                {/* Profile Information */}
                <div className="space-y-2 font-mono">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#00ff9d] tracking-wide text-center">
                    {profile.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium text-center mb-2 sm:mb-3">
                    {profile.role}
                  </p>

                  <div className="space-y-1.5 sm:space-y-2 pt-1 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00e5ff] shrink-0" />
                      <span className="text-slate-300">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00e5ff] shrink-0" />
                      <a
                        href={`mailto:${profile.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#00ff9d] transition-colors truncate"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Link Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-800/70">
                {profile.socials.map((soc, idx) => (
                  <a
                    key={idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#071113] border border-[#00ff9d]/30 text-[#00ff9d] text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[#00ff9d]/15 hover:border-[#00ff9d] hover:text-white transition-all duration-200"
                  >
                    {soc.icon === 'github' && <GithubIcon className="w-3.5 h-3.5 text-[#00ff9d]" />}
                    {soc.icon === 'linkedin' && <LinkedinIcon className="w-3.5 h-3.5 text-[#00ff9d]" />}
                    {soc.icon === 'code' && <Code2 className="w-3.5 h-3.5 text-[#00ff9d]" />}
                    <span>{soc.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* BACK SIDE: human.txt Formatted UI */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#0e1a1d] border border-[#00ff9d] rounded-xl p-5 sm:p-7 shadow-[0_0_25px_rgba(0,255,157,0.2)] flex flex-col justify-between select-none">
              <div>
                {/* Header controls */}
                <div className="flex items-center justify-between pb-3 mb-3 sm:mb-4 border-b border-slate-800/70 font-mono text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block"></span>
                    <span className="ml-1 sm:ml-2 text-[#00ff9d] font-bold text-xs sm:text-sm">
                      {human.fileName || 'human.txt'}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-[#00e5ff] font-mono flex items-center gap-1">
                    <RotateCw className="w-3 h-3" />
                    <span>FRONT</span>
                  </span>
                </div>

                {/* LIKES Section */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" />
                    <h4 className="font-bold text-[#00ff9d] text-[11px] sm:text-xs uppercase tracking-wider">
                      LIKES
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {human.likes?.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-[#071113] border border-[#00ff9d]/40 text-[#00ff9d] text-[11px] sm:text-xs font-mono px-2.5 py-0.5 sm:py-1 rounded-md flex items-center gap-1 shadow-sm"
                      >
                        <span className="text-[#00ff9d] font-bold">+</span>
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* DISLIKES Section */}
                <div className="mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2 font-mono">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <h4 className="font-bold text-rose-400 text-[11px] sm:text-xs uppercase tracking-wider">
                      DISLIKES
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {human.dislikes?.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-[#12080a] border border-rose-500/30 text-rose-300 text-[11px] sm:text-xs font-mono px-2.5 py-0.5 sm:py-1 rounded-md flex items-center gap-1 shadow-sm"
                      >
                        <span className="text-rose-400 font-bold">-</span>
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* DEFAULT MODE Banner */}
                <div className="bg-[#071113] p-3 sm:p-3.5 rounded-lg border border-[#00ff9d]/30 font-mono">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <h4 className="font-bold text-[#00e5ff] text-[11px] sm:text-xs uppercase tracking-wider">
                      DEFAULT MODE
                    </h4>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-1 text-xs font-bold font-mono">
                    {human.defaultMode?.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px]">
                          {step}
                        </span>
                        {idx < human.defaultMode.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom return prompt */}
              <div className="pt-2 sm:pt-3 border-t border-slate-800/70 text-center font-mono text-[11px] sm:text-xs text-[#00ff9d]">
                [TAP TO FLIP BACK TO PROFILE]
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Column: Summary Log Card (Flip 3D) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 perspective-1000 min-h-[520px] min-[400px]:min-h-[560px] sm:min-h-[620px] group">
          <div
            className={`w-full h-full relative transform-style-3d transition-transform duration-700 ease-in-out cursor-pointer ${
              isRightFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => setIsRightFlipped(!isRightFlipped)}
          >
            {/* FRONT SIDE: Summary Log */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-[#0c1618] border border-[#00ff9d]/25 hover:border-[#00ff9d] rounded-xl p-5 sm:p-8 shadow-xl hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between select-none">
              <div>
                {/* Card Header dots */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-slate-800/70 font-mono text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block"></span>
                    <span className="ml-1 sm:ml-2 text-slate-300 font-medium text-xs sm:text-sm">{summary.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs text-[#00ff9d] font-mono flex items-center gap-1 bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/20">
                      <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>TAP TO FLIP</span>
                    </span>
                  </div>
                </div>

                {/* Summary Text Log */}
                <div className="font-mono text-xs sm:text-base text-slate-300 leading-relaxed mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-[#00ff9d] font-bold text-[10px] sm:text-sm bg-[#00ff9d]/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#00ff9d]/20">
                      [INFO]
                    </span>
                    <span className="text-slate-400 text-[10px] sm:text-sm">SYSTEM_SUMMARY_V1.0</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed text-xs sm:text-base">
                    Backend-focused software engineer and Computer Science student specializing in{' '}
                    <span className="text-[#00ff9d] font-bold">
                      Node.js, TypeScript, REST APIs, distributed systems
                    </span>
                    , and cloud-native development. Experienced in building production-ready backend services, developer tools, scalable architectures, and full-stack applications using Docker, Kubernetes, Redis, PostgreSQL, AWS, and CI/CD.
                  </p>
                </div>
              </div>

              {/* Skill Tag Pills */}
              <div className="pt-4 sm:pt-5 border-t border-slate-800/70 mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm font-mono text-slate-400 mb-2 sm:mb-3 flex items-center gap-1.5">
                  <span className="text-[#00ff9d] font-bold">$</span>
                  <span>KEYWORDS & TECH_STACK:</span>
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {summary.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-[#081316] border border-[#00ff9d]/25 text-[#00ff9d] text-[11px] sm:text-sm font-mono px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full hover:border-[#00ff9d] hover:bg-[#00ff9d]/15 hover:text-white transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* BACK SIDE: activity.log Execution Timeline Formatted UI */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#0e1a1d] border border-[#00ff9d] rounded-xl p-5 sm:p-7 shadow-[0_0_25px_rgba(0,255,157,0.2)] flex flex-col justify-between select-none">
              <div>
                {/* Card Header dots */}
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-slate-800/70 font-mono text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block"></span>
                    <span className="ml-1 sm:ml-2 text-[#00ff9d] font-bold text-xs sm:text-sm">
                      {activity.fileName || 'activity.log'}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-[#00e5ff] font-mono flex items-center gap-1">
                    <RotateCw className="w-3 h-3" />
                    <span>FRONT</span>
                  </span>
                </div>

                {/* Subtitle Banner */}
                <div className="flex items-center gap-2 mb-2 sm:mb-3 font-mono text-xs font-bold text-[#00e5ff] bg-[#071113] p-1.5 sm:p-2 rounded border border-[#00e5ff]/30">
                  <Calendar className="w-3.5 h-3.5 text-[#00ff9d]" />
                  <span>{activity.title || 'RECENT ACTIVITY'}</span>
                </div>

                {/* Timeline Tree View */}
                <div className="space-y-2.5 font-mono text-[11px] sm:text-xs max-h-[190px] min-[400px]:max-h-[220px] sm:max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
                  {activity.timeline?.map((t, tIdx) => (
                    <div key={tIdx} className="bg-[#071113] p-2 sm:p-2.5 rounded border border-slate-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#00ff9d] font-extrabold bg-[#00ff9d]/15 border border-[#00ff9d]/30 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px]">
                          {t.year}
                        </span>
                      </div>
                      <div className="space-y-1 pl-1 text-slate-300">
                        {t.items?.map((it, iIdx) => {
                          const isLast = iIdx === t.items.length - 1;
                          return (
                            <div key={iIdx} className="flex items-start gap-1.5">
                              <span className="text-slate-500 shrink-0">
                                {isLast ? '└─' : '├─'}
                              </span>
                              <div>
                                <span className="text-slate-200">{it.label}</span>
                                {it.sub && (
                                  <div className="text-[10px] sm:text-[11px] text-[#00e5ff] pl-2 sm:pl-3">
                                    └─ {it.sub}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CURRENT STATE Progress Bars Section */}
                <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-3 border-t border-slate-800/80 font-mono text-[10px] sm:text-xs space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] sm:text-[11px]">
                    <Zap className="w-3.5 h-3.5 text-[#00ff9d]" />
                    <span>CURRENT STATE</span>
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    {activity.currentState?.map((cs, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between text-[10px] sm:text-[11px] gap-1.5 sm:gap-2">
                        <span className="text-slate-300 font-semibold w-16 sm:w-20 shrink-0 truncate">{cs.label}</span>
                        <span className="text-[#00ff9d] font-mono tracking-widest text-[10px] sm:text-xs truncate">
                          {cs.bar}
                        </span>
                        <span className="text-slate-400 font-semibold">{cs.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom return prompt */}
              <div className="pt-2 border-t border-slate-800/70 text-center font-mono text-[11px] sm:text-xs text-[#00ff9d]">
                [TAP TO FLIP BACK TO SUMMARY]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
