import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

const Contact = () => {
  const { headingCommand, fileName, email, phone, location, github, linkedin } =
    portfolioData.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="max-w-2xl mx-auto bg-[#0c1618] border border-[#00ff9d]/30 rounded-xl p-6 sm:p-8 font-mono shadow-[0_0_25px_rgba(0,255,157,0.15)]">
        {/* Header dots */}
        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800/60 text-xs text-slate-400">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
          <span className="ml-2 text-slate-400">{fileName}</span>
        </div>

        {/* Contact Info Header */}
        <div className="space-y-3 mb-6 text-xs text-slate-300">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#00ff9d]" />
              <a href={`mailto:${email}`} className="hover:text-[#00ff9d] transition-colors">
                {email}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00ff9d]" />
              <a href={`tel:${phone}`} className="hover:text-[#00ff9d] transition-colors">
                {phone}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00ff9d]" />
              <span>{location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 border-t border-slate-800/60 text-[#00e5ff]">
            <a
              href={`https://${github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>{github}</span>
            </a>
            <a
              href={`https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>{linkedin}</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              placeholder="$ NAME='your_name'"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#070e10] border border-slate-800 focus:border-[#00ff9d] focus:outline-none text-[#00ff9d] text-xs sm:text-sm px-4 py-3 rounded-md placeholder-slate-500 font-mono transition-colors"
            />
          </div>

          <div>
            <input
              type="email"
              required
              placeholder="$ EMAIL='address@domain.com'"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#070e10] border border-slate-800 focus:border-[#00ff9d] focus:outline-none text-[#00ff9d] text-xs sm:text-sm px-4 py-3 rounded-md placeholder-slate-500 font-mono transition-colors"
            />
          </div>

          <div>
            <input
              type="text"
              required
              placeholder="$ SUBJECT='project_inquiry'"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-[#070e10] border border-slate-800 focus:border-[#00ff9d] focus:outline-none text-[#00ff9d] text-xs sm:text-sm px-4 py-3 rounded-md placeholder-slate-500 font-mono transition-colors"
            />
          </div>

          <div>
            <textarea
              required
              rows={4}
              placeholder="$ MESSAGE='Hi Rithish, I would like to discuss...'"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#070e10] border border-slate-800 focus:border-[#00ff9d] focus:outline-none text-[#00ff9d] text-xs sm:text-sm px-4 py-3 rounded-md placeholder-slate-500 font-mono transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d] hover:bg-[#00ff9d] hover:text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-md flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,157,0.2)]"
            >
              <Send className="w-4 h-4" />
              <span>./SEND_MESSAGE.SH</span>
            </button>
          </div>

          {submitted && (
            <div className="p-3 bg-[#00ff9d]/10 border border-[#00ff9d] text-[#00ff9d] text-xs rounded-md">
              [SUCCESS] Message transmitted successfully to contact server!
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
