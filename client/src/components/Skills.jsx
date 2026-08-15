import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
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

  const renderIcon = (iconName, colorClass) => {
    const props = { className: `w-6 h-6 ${colorClass}` };
    switch (iconName) {
      case 'code':
        return <Code {...props} />;
      case 'cpu':
        return <Cpu {...props} />;
      case 'layers':
        return <Layers {...props} />;
      case 'database':
        return <Database {...props} />;
      case 'cloud':
        return <Cloud {...props} />;
      case 'network':
        return <Share2 {...props} />;
      case 'server':
        return <Server {...props} />;
      case 'book':
        return <BookOpen {...props} />;
      default:
        return <Code {...props} />;
    }
  };

  const getColorClasses = (colorStr, isHighlighted) => {
    switch (colorStr) {
      case 'emerald':
        return { text: 'text-[#00ff9d]', icon: 'text-[#00ff9d]' };
      case 'rose':
        return { text: 'text-rose-400', icon: 'text-rose-400' };
      case 'sky':
        return { text: 'text-sky-400', icon: 'text-sky-400' };
      case 'amber':
        return { text: 'text-amber-400', icon: 'text-amber-400' };
      case 'blue':
        return { text: 'text-blue-400', icon: 'text-blue-400' };
      case 'fuchsia':
        return { text: 'text-fuchsia-400', icon: 'text-fuchsia-400' };
      case 'orange':
        return { text: 'text-orange-400', icon: 'text-orange-400' };
      case 'teal':
        return { text: 'text-teal-400', icon: 'text-teal-400' };
      default:
        return { text: 'text-[#00ff9d]', icon: 'text-[#00ff9d]' };
    }
  };

  return (
    <section id="skills" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const colorClasses = getColorClasses(cat.color, cat.isHighlighted);
          const isHighlighted = cat.isHighlighted;

          return (
            <div
              key={idx}
              className={`bg-[#0c1618] rounded-xl p-5 font-mono transition-all duration-300 hover:-translate-y-1 ${
                isHighlighted
                  ? 'border border-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.2)] bg-[#0e1a1d]'
                  : 'border border-[#00ff9d]/15 hover:border-[#00ff9d]/40 hover:shadow-[0_0_15px_rgba(0,255,157,0.1)]'
              }`}
            >
              {/* Header dots & filename */}
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800/60 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
                <span className="ml-1 text-slate-400">{cat.fileName}</span>
              </div>

              {/* Icon & Title */}
              <div className="mb-3">
                <div className="mb-2">{renderIcon(cat.icon, colorClasses.icon)}</div>
                <h3 className={`text-base font-bold ${colorClasses.text}`}>
                  {cat.title}
                </h3>
              </div>

              {/* Items */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {cat.items}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
