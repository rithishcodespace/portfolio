import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import DistributedSystemCard from './DistributedSystemCard';
import SkillInspectionModal from './SkillInspectionModal';
import {
  Code,
  Cpu,
  Layers,
  Database,
  Cloud,
  Share2,
  Server,
  BookOpen,
  RefreshCw,
  Brain,
  Network,
} from 'lucide-react';

const Skills = () => {
  const { headingCommand, categories } = portfolioData.skills;
  const [activeSkill, setActiveSkill] = useState(null);

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'code':
        return <Code className="w-6 h-6 text-[#00ff9d] shrink-0" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 text-rose-400 shrink-0" />;
      case 'layers':
        return <Layers className="w-6 h-6 text-[#00e5ff] shrink-0" />;
      case 'database':
        return <Database className="w-6 h-6 text-amber-400 shrink-0" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-blue-400 shrink-0" />;
      case 'network':
        return <Share2 className="w-6 h-6 text-fuchsia-400 shrink-0" />;
      case 'server':
        return <Server className="w-6 h-6 text-orange-400 shrink-0" />;
      case 'book':
        return <BookOpen className="w-6 h-6 text-teal-400 shrink-0" />;
      case 'system':
        return <Network className="w-6 h-6 text-[#00ff9d] shrink-0" />;
      case 'brain':
        return <Brain className="w-6 h-6 text-rose-400 shrink-0" />;
      default:
        return <Code className="w-6 h-6 text-[#00ff9d] shrink-0" />;
    }
  };

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5 items-stretch">
        {categories.map((cat, idx) => {
          // If this is the Distributed Systems card prototype, render the card shell with onClick handler
          if (cat.fileName === 'distributed.proto' || cat.title === 'Distributed Systems') {
            return (
              <DistributedSystemCard
                key={idx}
                cat={cat}
                onClick={() => setActiveSkill(cat)}
              />
            );
          }

          const isHighlighted = cat.isHighlighted;

          return (
            <div
              key={idx}
              onClick={() => setActiveSkill(cat)}
              className={`h-[340px] bg-[#0c1618] rounded-xl p-5 font-mono flex flex-col justify-between transition-all duration-300 relative cursor-pointer group hover:-translate-y-1.5 active:scale-[0.98] select-none ${
                isHighlighted
                  ? 'border border-[#00ff9d] shadow-[0_0_22px_rgba(0,255,157,0.22)] bg-[#0e1a1d] hover:shadow-[0_0_30px_rgba(0,255,157,0.35)]'
                  : 'border border-[#00ff9d]/20 hover:border-[#00ff9d] hover:shadow-[0_0_25px_rgba(0,255,157,0.25)]'
              }`}
            >
              {/* Prominent Hover Pop-up Click Badge */}
              <span className="absolute top-3 right-3 z-20 text-[10px] text-[#00ff9d] bg-[#040c0e] px-2 py-0.5 rounded-lg border border-[#00ff9d] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:scale-105 group-hover:bg-[#00ff9d] group-hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(0,255,157,0.4)] pointer-events-none">
                <span>INSPECT</span>
                <span className="text-xs">↗</span>
              </span>

              <div className="flex-1 flex flex-col min-h-0">
                {/* Header dots & filename */}
                <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-800/70 text-xs text-slate-400 overflow-hidden shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shrink-0"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shrink-0"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shrink-0"></span>
                  <span className="ml-1 text-slate-300 font-medium text-xs tracking-tight truncate">
                    {cat.fileName}
                  </span>
                </div>

                {/* Category Icon & Title */}
                <div className="flex items-center gap-2.5 mb-2.5 shrink-0">
                  {renderIcon(cat.icon)}
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight truncate">
                    {cat.title}
                  </h3>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto no-scrollbar pr-1 my-1">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {cat.items}
                  </p>
                </div>
              </div>

              {/* Status footer pill */}
              <div className="pt-2.5 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
                <span>[READY]</span>
                <span className="text-[#00ff9d] font-semibold">v1.0</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Centered Modal Popup */}
      <SkillInspectionModal
        activeSkill={activeSkill}
        onClose={() => setActiveSkill(null)}
      />
    </section>
  );
};

export default Skills;
