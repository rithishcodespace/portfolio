import React, { useEffect } from 'react';
import { X, Mail, User, Calendar, MessageSquare, Reply } from 'lucide-react';

const AdminMessageDetailModal = ({ message, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!message) return null;

  const senderName = message.name || message.sender_name || 'Anonymous';
  const senderEmail = message.email || message.sender_email || 'No email provided';
  const subject = message.subject || 'No Subject';
  const messageBody = message.message || message.content || message.body || '';
  const dateFormatted = message.date || message.createdAt || message.created_at
    ? new Date(message.date || message.createdAt || message.created_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Unknown Date';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-mono animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0a1619] border border-[#00ff9d]/40 rounded-2xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,255,157,0.15)] text-slate-200 space-y-5 flex flex-col my-auto max-h-[90vh] overflow-y-auto"
      >
        {/* Window Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
            <span className="ml-1 font-bold text-slate-300">
              message_detail // {message.id || 'msg'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Metadata Grid */}
        <div className="bg-[#040c0e] border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#00ff9d] shrink-0" />
              <span className="font-bold text-slate-100 text-sm">{senderName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{dateFormatted}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a
                href={`mailto:${senderEmail}`}
                className="text-[#00ff9d] hover:underline font-semibold"
              >
                {senderEmail}
              </a>
            </div>
            <a
              href={`mailto:${senderEmail}?subject=Re: ${encodeURIComponent(subject)}`}
              className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 hover:bg-[#00ff9d] hover:text-black font-bold transition-all"
            >
              <Reply className="w-3 h-3" />
              <span>Reply Email</span>
            </a>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
            SUBJECT
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
            {subject}
          </h2>
        </div>

        {/* Full Message Body */}
        <div className="space-y-1.5 flex-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>FULL MESSAGE</span>
          </span>
          <div className="bg-[#040c0e] border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-[#00ff9d] selection:text-black">
            {messageBody}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Press ESC or click close to return
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMessageDetailModal;
