import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { portfolioData } from '../data/portfolioData';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { messagesApi } from '../services/api';

const Contact = () => {
  const { headingCommand, fileName, email, phone, location, github, linkedin } =
    portfolioData.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await messagesApi.postMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 max-w-6xl mx-auto relative z-10">
      <SectionHeader command={headingCommand} />

      <div className="max-w-2xl mx-auto bg-[#0c1618] border border-[#00ff9d]/30 rounded-xl p-6 sm:p-9 font-mono shadow-[0_0_25px_rgba(0,255,157,0.15)]">
        {/* Header dots */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/70 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
            <span className="ml-2 text-slate-300 font-medium">{fileName}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">[TERMINAL_SOCKET]</span>
        </div>

        {/* Contact Info Header */}
        <div className="space-y-3.5 mb-7 text-xs sm:text-sm text-slate-300">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
            <div className="flex items-center gap-2 max-w-full">
              <Mail className="w-4 h-4 text-[#00ff9d] shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-[#00ff9d] transition-colors truncate">
                {email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#00ff9d] shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-[#00ff9d] transition-colors">
                {phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00ff9d] shrink-0" />
              <span>{location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 pt-3 border-t border-slate-800/60 text-[#00e5ff]">
            <a
              href={`https://${github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline max-w-full"
            >
              <GithubIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">{github}</span>
            </a>
            <a
              href={`https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline max-w-full"
            >
              <LinkedinIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">{linkedin}</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <input
              type="text"
              required
              placeholder="$ NAME='your_name'"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#070e10] border border-slate-800 focus:border-[#00ff9d] focus:outline-none text-[#00ff9d] text-sm sm:text-base px-4.5 py-3.5 rounded-md placeholder-slate-500 font-mono transition-colors"
            />
          </div>

          <div>
            <input
              type="email"
              required
              placeholder="$ EMAIL='address@domain.com'"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#070e10] border border-slate-800 focus:border-[#00ff9d] focus:outline-none text-[#00ff9d] text-sm sm:text-base px-4.5 py-3.5 rounded-md placeholder-slate-500 font-mono transition-colors"
            />
          </div>

          <div>
            <input
              type="text"
              required
              placeholder="$ SUBJECT='project_inquiry'"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-[#070e10] border border-slate-800 focus:border-[#00ff9d] focus:outline-none text-[#00ff9d] text-sm sm:text-base px-4.5 py-3.5 rounded-md placeholder-slate-500 font-mono transition-colors"
            />
          </div>

          <div>
            <textarea
              required
              rows={4}
              placeholder="$ MESSAGE='Hi Rithish, I would like to discuss...'"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#070e10] border border-slate-800 focus:border-[#00ff9d] focus:outline-none text-[#00ff9d] text-sm sm:text-base px-4.5 py-3.5 rounded-md placeholder-slate-500 font-mono transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d] hover:bg-[#00ff9d] hover:text-black font-bold text-sm sm:text-base px-6 py-3 rounded-md flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_22px_rgba(0,255,157,0.45)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#00ff9d] border-t-transparent animate-spin" />
                  <span>TRANSMITTING...</span>
                </>
              ) : (
                <>
                  <Send className="w-4.5 h-4.5" />
                  <span>./SEND_MESSAGE.SH</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-950/40 border border-red-500 text-red-300 text-sm rounded-md font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>[ERROR] {errorMsg}</span>
            </div>
          )}

          {submitted && (
            <div className="p-3.5 bg-[#00ff9d]/10 border border-[#00ff9d] text-[#00ff9d] text-sm rounded-md font-mono">
              [SUCCESS] Message transmitted successfully to contact server!
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
