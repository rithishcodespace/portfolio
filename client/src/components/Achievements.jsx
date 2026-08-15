import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import { Trophy, Server, Share2 } from 'lucide-react';

const Achievements = () => {
  const { headingCommand, list } = portfolioData.achievements;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="w-8 h-8 text-[#eab308]" />;
      case 'server':
        return <Server className="w-8 h-8 text-[#00ff9d]" />;
      case 'network':
        return <Share2 className="w-8 h-8 text-[#00e5ff]" />;
      default:
        return <Trophy className="w-8 h-8 text-[#eab308]" />;
    }
  };

  return (
    <section id="achievements" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#0c1618] border border-[#00ff9d]/20 hover:border-[#00ff9d]/50 rounded-xl p-6 font-mono transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Header dot & filename */}
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/60 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
                <span className="ml-1 text-slate-400">{item.fileName}</span>
              </div>

              {/* Icon */}
              <div className="mb-4">{renderIcon(item.icon)}</div>

              {/* Value */}
              <h3
                className={`text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight ${
                  item.icon === 'network' ? 'text-[#00e5ff]' : 'text-[#00ff9d]'
                }`}
              >
                {item.value}
              </h3>

              {/* Label */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
