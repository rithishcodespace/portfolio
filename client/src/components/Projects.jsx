import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import { ShoppingCart, Link, Film } from 'lucide-react';
import { GithubIcon } from './Icons';

const Projects = () => {
  const { headingCommand, list } = portfolioData.projects;

  const renderProjectIcon = (iconName, color) => {
    switch (iconName) {
      case 'shopping-cart':
        return <ShoppingCart className="w-7 h-7 text-[#00ff9d]" />;
      case 'link':
        return <Link className="w-7 h-7 text-[#00e5ff]" />;
      case 'film':
        return <Film className="w-7 h-7 text-purple-400" />;
      default:
        return <ShoppingCart className="w-7 h-7 text-[#00ff9d]" />;
    }
  };

  const getTitleColor = (color) => {
    switch (color) {
      case 'emerald':
        return 'text-[#00ff9d]';
      case 'sky':
        return 'text-[#00e5ff]';
      case 'fuchsia':
        return 'text-purple-400';
      default:
        return 'text-[#00ff9d]';
    }
  };

  return (
    <section id="projects" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {list.map((proj, idx) => {
          const isHighlighted = proj.isHighlighted;
          const titleColorClass = getTitleColor(proj.color);

          return (
            <div
              key={idx}
              className={`bg-[#0c1618] rounded-xl p-6 font-mono flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                isHighlighted
                  ? 'border border-[#00ff9d] shadow-[0_0_25px_rgba(0,255,157,0.2)] bg-[#0e1a1d]'
                  : 'border border-[#00ff9d]/15 hover:border-[#00ff9d]/40 hover:shadow-[0_0_15px_rgba(0,255,157,0.1)]'
              }`}
            >
              <div>
                {/* Header dots & filename */}
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/60 text-xs text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
                  <span className="ml-1 text-slate-400">{proj.fileName}</span>
                </div>

                {/* Project Icon */}
                <div className="mb-3">
                  {renderProjectIcon(proj.icon, proj.color)}
                </div>

                {/* Project Title */}
                <h3 className={`text-lg font-bold ${titleColorClass} mb-1 leading-snug`}>
                  {proj.title}
                </h3>

                {/* Period */}
                <p className="text-xs text-[#00e5ff]/80 font-medium mb-4">
                  {proj.period}
                </p>

                {/* Bullets */}
                <ul className="space-y-2.5 mb-6">
                  {proj.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <span className="text-[#00ff9d] text-xs mt-0.5 shrink-0">▶</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-4 border-t border-slate-800/60 mt-auto">
                <a
                  href={proj.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-fit font-mono text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-2 border transition-all duration-200 ${
                    isHighlighted
                      ? 'bg-[#00ff9d] text-black border-[#00ff9d] hover:bg-[#00ff9d]/90 shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                      : 'bg-[#071113] border-[#00ff9d]/30 text-[#00ff9d] hover:bg-[#00ff9d]/15 hover:border-[#00ff9d] hover:text-white'
                  }`}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>REPOSITORY</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
