import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import {
  GraduationCap,
  Briefcase,
  Award,
  Target,
  Terminal,
} from 'lucide-react';

const Education = () => {
  const { headingCommand, school, college, career } = portfolioData.education;

  return (
    <section id="edu" className="py-16 sm:py-24 px-4 max-w-4xl mx-auto relative z-10 font-mono">
      <SectionHeader command={headingCommand} />

      {/* Trajectory Subheader Label (Direct on page, no giant parent card) */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-8 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00ff9d]" />
          <span className="text-slate-300 font-bold">/etc/career_trajectory.conf</span>
        </div>
        <span className="text-[#00ff9d] font-semibold text-[11px]">[TRAJECTORY_NODES: 3]</span>
      </div>

      {/* Main Continuous Trajectory Timeline Container */}
      <div className="relative pl-8 sm:pl-12 space-y-10">
        {/* Continuous Vertical Timeline Line Stem */}
        <div className="absolute left-[16px] sm:left-[24px] top-6 bottom-16 w-0.5 bg-gradient-to-b from-slate-600 via-[#00ff9d] to-[#00e5ff] z-0"></div>

        {/* ========================================================================= */}
        {/* STAGE 01: SCHOOL (FOUNDATION) */}
        {/* ========================================================================= */}
        <div className="relative z-10 pl-6 sm:pl-8">
          {/* Node Icon on Timeline (Centered on stem line) */}
          <div className="absolute left-[-24px] sm:left-[-32px] top-5 -translate-x-1/2 w-7 h-7 rounded-full bg-[#081518] border-2 border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-md">
            01
          </div>

          <div className="bg-[#0c1618] border border-slate-800 hover:border-slate-700 rounded-xl p-5 sm:p-6 transition-all duration-300 shadow-lg">
            {/* Header dots */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
                <span className="ml-1 text-slate-300 font-bold text-xs">school.conf</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                ● {school.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-wider">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{school.step} {school.tag}</span>
              </div>
              <div className="text-xs text-emerald-400 font-bold bg-[#081518] px-3 py-1 rounded border border-emerald-500/30 inline-self-start sm:inline-self-auto">
                {school.metricLabel}: <span className="text-slate-100 font-extrabold text-sm ml-1">{school.metricValue}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {school.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{school.location}</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 02: COLLEGE (CURRENT) — PROMINENTLY HIGHLIGHTED */}
        {/* ========================================================================= */}
        <div className="relative z-10 pl-6 sm:pl-8">
          {/* Node Icon on Timeline (Centered on stem line) */}
          <div className="absolute left-[-24px] sm:left-[-32px] top-6 -translate-x-1/2 w-7 h-7 rounded-full bg-[#081518] border-2 border-[#00ff9d] flex items-center justify-center text-[10px] font-bold text-[#00ff9d] shadow-[0_0_12px_rgba(0,255,157,0.5)]">
            02
          </div>

          <div className="bg-[#0e1a1d] border border-[#00ff9d] shadow-[0_0_25px_rgba(0,255,157,0.18)] rounded-xl p-6 sm:p-7 transition-all duration-300 relative group">
            {/* Header dots */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
                <span className="ml-1 text-[#00ff9d] font-bold text-xs">college.conf</span>
              </div>
              <span className="text-[11px] text-[#00ff9d] font-bold bg-[#00ff9d]/15 px-2.5 py-0.5 rounded border border-[#00ff9d]/40 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#00ff9d]"></span>
                <span>● {college.status}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#00ff9d] text-xs font-bold tracking-wider mb-2">
              <GraduationCap className="w-4 h-4 text-[#00ff9d] shrink-0" />
              <span>{college.step} {college.tag}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug mb-1">
              {college.name}
            </h3>

            <p className="text-sm font-semibold text-[#00e5ff] mb-3">
              {college.degree}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/70 text-xs text-slate-300">
              <div className="bg-[#081518] px-3 py-1.5 rounded border border-[#00ff9d]/30 text-[#00ff9d] font-bold">
                {college.metricLabel}: <span className="text-slate-100 text-sm font-extrabold ml-1">{college.metricValue}</span>
              </div>
              <span className="text-slate-400">{college.period}</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400">{college.location}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 03: CAREER / FUTURE (NEXT) */}
        {/* ========================================================================= */}
        <div className="relative z-10 pl-6 sm:pl-8">
          {/* Node Icon on Timeline */}
          <div className="absolute left-[-24px] sm:left-[-32px] top-6 -translate-x-1/2 w-7 h-7 rounded-full bg-[#081518] border-2 border-[#00e5ff] flex items-center justify-center text-[10px] font-bold text-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.5)]">
            03
          </div>

          <div className="bg-[#0a1619] border border-[#00e5ff]/50 hover:border-[#00e5ff] shadow-[0_0_22px_rgba(0,229,255,0.15)] rounded-xl p-6 sm:p-7 transition-all duration-300 space-y-4">
            {/* Header dots & Status */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
                <span className="ml-1 text-[#00e5ff] font-bold text-xs">career.conf</span>
              </div>
              <span className="text-[10px] text-[#00e5ff] font-bold bg-[#00e5ff]/15 px-2.5 py-0.5 rounded border border-[#00e5ff]/30">
                ● {career.status}
              </span>
            </div>

            {/* Step Badge & Title */}
            <div>
              <div className="flex items-center gap-2 text-[#00e5ff] text-xs font-bold tracking-wider mb-1">
                <Briefcase className="w-4 h-4 text-[#00e5ff] shrink-0" />
                <span>{career.step} / {career.tag}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {career.title}
              </h3>
            </div>

            {/* Two-Column Area: TARGET & INTERESTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* LEFT: TARGET */}
              <div className="bg-[#040c0e] border border-slate-800/90 p-3.5 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block mb-1.5 tracking-wider uppercase">
                  TARGET
                </span>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#00e5ff] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#00e5ff] shrink-0" />
                    <span>{career.targetPrimary}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-300 pl-5">
                    {career.targetSecondary}
                  </div>
                </div>
              </div>

              {/* RIGHT: INTERESTS */}
              <div className="bg-[#040c0e] border border-slate-800/90 p-3.5 rounded-lg">
                <span className="text-[10px] text-slate-500 font-bold block mb-1.5 tracking-wider uppercase">
                  INTERESTS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {career.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-[#0c1a1d] text-slate-200 border border-slate-700/80 px-2 py-0.5 rounded font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Objective */}
            <div className="bg-[#081518] border border-slate-800/90 rounded-lg p-3.5 text-xs">
              <div className="text-[10px] text-slate-500 font-bold mb-1 tracking-wider uppercase">
                CURRENT OBJECTIVE
              </div>
              <p className="text-slate-200 italic font-medium text-xs sm:text-sm">
                "{career.objective}"
              </p>
            </div>

            {/* LOOKING FOR Section */}
            <div className="bg-[#040c0e] border border-slate-800/90 rounded-lg p-3.5 text-xs space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                  LOOKING FOR
                </span>
                <span className="text-xs font-bold text-[#00e5ff]">
                  {career.lookingForRole}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                {career.lookingForBullets.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300 text-xs">
                    <span className="text-[#00ff9d] shrink-0 font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Footer: GATE / CSE PREPARATION */}
            <div className="pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                  ALSO PREPARING FOR:
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {career.gatePrep.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                {career.gatePrep.topics.join(' · ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
