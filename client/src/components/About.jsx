import React from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import { MapPin, Mail, Phone, Award } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

const About = () => {
  const { headingCommand, profile, summary } = portfolioData.about;

  return (
    <section id="about" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Avatar Profile Card */}
        <div className="lg:col-span-5 bg-[#0c1618] border border-[#00ff9d]/20 rounded-xl p-5 shadow-xl">
          {/* Card Header dots */}
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/60 font-mono text-xs text-slate-400">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
            <span className="ml-2 text-slate-400">{profile.fileName}</span>
          </div>

          {/* Avatar Image */}
          <div className="relative mb-5 mx-auto max-w-[280px] rounded-lg overflow-hidden border border-[#00ff9d]/30 shadow-[0_0_20px_rgba(0,255,157,0.15)] group">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-auto object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Profile Information */}
          <div className="text-center sm:text-left space-y-2.5 font-mono">
            <h3 className="text-xl font-bold text-[#00ff9d] tracking-wide text-center">
              {profile.name}
            </h3>
            <p className="text-xs text-slate-300 font-medium text-center mb-4">
              {profile.role}
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#00e5ff] shrink-0" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00e5ff] shrink-0" />
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-[#00ff9d] transition-colors"
                >
                  {profile.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00e5ff] shrink-0" />
                <a
                  href={`tel:${profile.phone}`}
                  className="hover:text-[#00ff9d] transition-colors"
                >
                  {profile.phone}
                </a>
              </div>
            </div>

            {/* Social Link Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-5 border-t border-slate-800/60">
              {profile.socials.map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#071113] border border-[#00ff9d]/30 text-[#00ff9d] text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[#00ff9d]/15 hover:border-[#00ff9d] hover:text-white transition-all"
                >
                  {soc.icon === 'github' && <GithubIcon className="w-3.5 h-3.5 text-[#00ff9d]" />}
                  {soc.icon === 'linkedin' && <LinkedinIcon className="w-3.5 h-3.5 text-[#00ff9d]" />}
                  {soc.icon === 'award' && <Award className="w-3.5 h-3.5 text-[#00ff9d]" />}
                  <span>{soc.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary Log Card */}
        <div className="lg:col-span-7 bg-[#0c1618] border border-[#00ff9d]/20 rounded-xl p-6 shadow-xl flex flex-col justify-between h-full">
          <div>
            {/* Card Header dots */}
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800/60 font-mono text-xs text-slate-400">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
              <span className="ml-2 text-slate-400">{summary.fileName}</span>
            </div>

            {/* Summary Text Log */}
            <div className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              <span className="text-[#00ff9d] font-bold mr-2">[INFO]</span>
              <span>Backend-focused Software Engineer specializing in </span>
              <span className="text-[#00ff9d] font-semibold">
                Java, Spring Boot, and distributed systems
              </span>
              <span>
                , with hands-on experience designing scalable RESTful services and ML pipelines. Strong in data structures, system design, database optimization, and cloud deployment, with proven ability to reduce latency, improve throughput, and deploy production-grade AI systems.
              </span>
            </div>
          </div>

          {/* Skill Tag Pills */}
          <div className="pt-4 border-t border-slate-800/60">
            <div className="flex flex-wrap gap-2">
              {summary.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-[#081316] border border-[#00ff9d]/25 text-[#00ff9d] text-xs font-mono px-3 py-1 rounded-full hover:border-[#00ff9d] hover:bg-[#00ff9d]/10 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
