import React, { useEffect } from 'react';
import { X, Mail, User, Calendar, MessageSquare, Reply, Eye, EyeOff } from 'lucide-react';

const AdminMessageDetailModal = ({ message, onClose, onToggleSeen }) => {
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
  const isSeen = Boolean(message.seen);
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
        className="w-full max-w-3xl sm:max-w-4xl bg-[#0a1619] border border-[#00ff9d]/40 rounded-2xl p-5 sm:p-8 shadow-[0_0_60px_rgba(0,255,157,0.15)] text-slate-200 space-y-6 flex flex-col my-auto max-h-[88vh]"
      >
        {/* Window Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
            <span className="ml-1 font-bold text-slate-300">
              message_detail // {message.id || 'msg'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onToggleSeen && (
              <button
                onClick={() => onToggleSeen(message.id, !isSeen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  isSeen
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    : 'bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/40 hover:bg-[#00ff9d] hover:text-black'
                }`}
              >
                {isSeen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isSeen ? 'Mark Unseen' : 'Mark Seen'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container for Modal Body */}
        <div className="space-y-6 overflow-y-auto pr-1 flex-1 custom-scrollbar">
          {/* Header Metadata Grid */}
          <div className="bg-[#040c0e] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#00ff9d] shrink-0" />
                <span className="font-bold text-slate-100 text-sm sm:text-base">{senderName}</span>
                {isSeen ? (
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded font-mono">
                    SEEN
                  </span>
                ) : (
                  <span className="text-[10px] text-[#00ff9d] bg-[#00ff9d]/10 border border-[#00ff9d]/30 px-2 py-0.5 rounded font-mono font-bold">
                    UNSEEN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{dateFormatted}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 break-all">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${senderEmail}`}
                  className="text-[#00ff9d] hover:underline font-semibold text-xs sm:text-sm"
                >
                  {senderEmail}
                </a>
              </div>
              <a
                href={`mailto:${senderEmail}?subject=Re: ${encodeURIComponent(subject)}`}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 hover:bg-[#00ff9d] hover:text-black font-bold transition-all"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply Email</span>
              </a>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              SUBJECT
            </span>
            <h2 className="text-base sm:text-xl font-bold text-slate-100 leading-snug break-words">
              {subject}
            </h2>
          </div>

          {/* Full Message Body */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>FULL MESSAGE CONTENT</span>
            </span>
            <div className="bg-[#040c0e] border border-slate-800 rounded-xl p-5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap break-words overflow-x-auto selection:bg-[#00ff9d] selection:text-black max-h-[50vh] overflow-y-auto">
              {messageBody}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            Press ESC or click close to return
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer ml-auto"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMessageDetailModal;
