import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import { Building2 } from 'lucide-react';

const Education = () => {
  const { headingCommand, fileName, college, degree, period, cgpa, location } =
    portfolioData.education;

  return (
    <section id="edu" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="max-w-xl mx-auto bg-[#0c1618] border border-[#00ff9d]/20 hover:border-[#00ff9d]/40 rounded-xl p-6 sm:p-8 font-mono shadow-xl transition-all">
        {/* Card Header dots */}
        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800/60 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
          <span className="ml-2 text-slate-400">{fileName}</span>
        </div>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg text-[#00ff9d] shrink-0">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-[#00ff9d] leading-snug">
              {college}
            </h3>
            <p className="text-sm sm:text-base font-semibold text-[#00e5ff]">
              {degree}
            </p>
            <p className="text-xs text-slate-400">
              {period} <span className="text-slate-600 mx-1.5">•</span> CGPA: {cgpa}
            </p>
            <p className="text-xs text-slate-500 pt-0.5">{location}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
