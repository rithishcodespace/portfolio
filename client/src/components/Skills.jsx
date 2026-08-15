import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import DistributedSystemCard from './DistributedSystemCard';
import {
  Code,
  Cpu,
  Layers,
  Database,
  Cloud,
  Share2,
  Server,
  BookOpen,
} from 'lucide-react';

const Skills = () => {
  const { headingCommand, categories } = portfolioData.skills;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'code':
        return <Code className="w-6 h-6 text-[#00ff9d]" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 text-rose-400" />;
      case 'layers':
        return <Layers className="w-6 h-6 text-[#00e5ff]" />;
      case 'database':
        return <Database className="w-6 h-6 text-amber-400" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-blue-400" />;
      case 'network':
        return <Share2 className="w-6 h-6 text-fuchsia-400" />;
      case 'server':
        return <Server className="w-6 h-6 text-orange-400" />;
      case 'book':
        return <BookOpen className="w-6 h-6 text-teal-400" />;
      default:
        return <Code className="w-6 h-6 text-[#00ff9d]" />;
    }
  };

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {categories.map((cat, idx) => {
          // If this is the Distributed Systems card prototype, render the interactive card
          if (cat.fileName === 'distributed.proto' || cat.title === 'Distributed Systems') {
            return <DistributedSystemCard key={idx} cat={cat} />;
          }

          const isHighlighted = cat.isHighlighted;
          return (
            <div
              key={idx}
              className={`bg-[#0c1618] rounded-xl p-6 font-mono flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                isHighlighted
                  ? 'border border-[#00ff9d] shadow-[0_0_22px_rgba(0,255,157,0.22)] bg-[#0e1a1d]'
                  : 'border border-[#00ff9d]/15 hover:border-[#00ff9d]/40 hover:shadow-[0_0_15px_rgba(0,255,157,0.1)]'
              }`}
            >
              <div>
                {/* Header dots & filename */}
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800/70 text-xs sm:text-sm text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
                  <span className="ml-1 text-slate-300 font-medium">{cat.fileName}</span>
                </div>

                {/* Category Icon & Title */}
                <div className="flex items-center gap-3 mb-3">
                  {renderIcon(cat.icon)}
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                    {cat.title}
                  </h3>
                </div>

                {/* Items List */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {cat.items}
                </p>
              </div>

              {/* Status footer pill */}
              <div className="pt-3 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>[READY]</span>
                <span className="text-[#00ff9d] font-semibold">v1.0</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
