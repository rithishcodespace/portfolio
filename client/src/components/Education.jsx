import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import { Building2 } from 'lucide-react';

const Education = () => {
  const { headingCommand, fileName, college, degree, period, cgpa, location } =
    portfolioData.education;

  return (
    <section id="edu" className="py-16 sm:py-24 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="max-w-2xl mx-auto bg-[#0c1618] border border-[#00ff9d]/20 hover:border-[#00ff9d]/40 rounded-xl p-7 sm:p-9 font-mono shadow-xl transition-all duration-300">
        {/* Card Header dots */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/70 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
            <span className="ml-2 text-slate-300 font-medium">{fileName}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">[ACADEMIC_RECORD]</span>
        </div>

        {/* Content */}
        <div className="flex items-start gap-5">
          <div className="p-3.5 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg text-[#00ff9d] shrink-0 shadow-sm">
            <Building2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-[#00ff9d] leading-snug">
              {college}
            </h3>
            <p className="text-base sm:text-lg font-semibold text-[#00e5ff]">
              {degree}
            </p>
            <p className="text-sm text-slate-300">
              {period} <span className="text-slate-500 mx-1.5">•</span> CGPA: {cgpa}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 pt-0.5">{location}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
