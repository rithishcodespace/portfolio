import { useState, useEffect } from 'react';
import { X, FileText, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { resumeApi } from '../services/api';

const RequestResumeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    reason: '',
    linkedin: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await resumeApi.requestResume(formData);
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        company: '',
        role: '',
        reason: '',
        linkedin: '',
      });
    } catch (err) {
      console.error('Failed to submit resume request:', err);
      setStatus('error');
      setErrorMessage(
        err.message || 'Something went wrong while sending the resume. Please try again.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#071317] border border-[#00ff9d]/30 rounded-xl shadow-[0_0_40px_rgba(0,255,157,0.15)] p-5 sm:p-6 font-mono text-slate-200 text-sm my-4 sm:my-8 max-h-[88vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2 text-[#00ff9d]">
          <FileText className="w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Request My Resume</h2>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Tell me a little about yourself and I&apos;ll send my resume directly to your email.
        </p>

        {status === 'success' ? (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/50 flex items-center justify-center text-[#00ff9d]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#00ff9d] mb-1">Resume Sent Successfully!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Thanks for reaching out. My resume has been sent to your email.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 rounded-lg bg-[#00ff9d]/20 border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d]/30 transition-all font-bold text-xs"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {status === 'error' && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Grid 2-column for Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-[#00ff9d]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#030a0d] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Work Email <span className="text-[#00ff9d]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@company.com"
                  className="w-full bg-[#030a0d] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
              </div>
            </div>

            {/* Grid 2-column for Company and Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company / Organization <span className="text-[#00ff9d]">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google, Microsoft"
                  className="w-full bg-[#030a0d] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Role / Position
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Recruiter, Engineer"
                  className="w-full bg-[#030a0d] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for requesting my resume
              </label>
              <textarea
                name="reason"
                rows={2}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Briefly tell me what you're looking for..."
                className="w-full bg-[#030a0d] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00ff9d] transition-colors resize-none"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-[#030a0d] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00ff9d] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-2.5 px-4 rounded-lg bg-[#00ff9d]/15 border border-[#00ff9d] text-[#00ff9d] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#00ff9d]/25 transition-all shadow-[0_0_15px_rgba(0,255,157,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Resume to My Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestResumeModal;
