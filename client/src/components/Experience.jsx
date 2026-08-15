import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';

const Experience = () => {
  const { headingCommand, logFile, role, company, period, bullets } =
    portfolioData.experience;

  return (
    <section id="exp" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="bg-[#0c1618] border border-[#00ff9d]/20 rounded-xl p-6 sm:p-8 shadow-xl font-mono">
        {/* Top header dots */}
        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800/60 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
          <span className="ml-2 text-slate-400">{logFile}</span>
        </div>

        {/* Role Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#00ff9d] animate-pulse inline-block"></span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#00ff9d]">
              {role}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#00e5ff] font-medium pl-5">
            {company} <span className="text-slate-500 mx-1">•</span> {period}
          </p>
        </div>

        {/* Bullet List with green triangle markers */}
        <ul className="space-y-3 pl-2 sm:pl-4">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="text-[#00ff9d] text-xs mt-1 shrink-0">▶</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Experience;
