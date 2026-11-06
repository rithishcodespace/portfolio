import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';

const Experience = () => {
  const { headingCommand, logFile, role, company, period, bullets } =
    portfolioData.experience;

  return (
    <section id="exp" className="py-16 sm:py-24 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-[#0c1618] border border-[#00ff9d]/20 hover:border-[#00ff9d]/40 rounded-xl p-6 sm:p-9 font-mono shadow-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,157,0.12)]"
      >
        {/* Card Header dots */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/70 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
            <span className="ml-2 text-slate-300 font-medium">{logFile}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">[LOG_JOURNAL]</span>
        </div>

        {/* Role & Company Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7 pb-5 border-b border-slate-800/60">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#00ff9d] tracking-wide">
              {role}
            </h3>
            <p className="text-base sm:text-lg text-slate-200 font-medium">
              {company}
            </p>
          </div>
          <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] text-xs sm:text-sm font-semibold px-4 py-2 rounded-md w-fit transition-transform duration-200 hover:scale-105">
            {period}
          </div>
        </div>

        {/* Bullet Logs */}
        <ul className="space-y-4">
          {bullets.map((bullet, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
              className="flex items-start gap-3.5 text-sm sm:text-base text-slate-300 leading-relaxed group hover:text-slate-100 transition-colors"
            >
              <span className="text-[#00ff9d] font-extrabold text-sm mt-0.5 shrink-0 select-none group-hover:translate-x-1 transition-transform duration-200">
                ▶
              </span>
              <span>{bullet}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
};

export default Experience;
