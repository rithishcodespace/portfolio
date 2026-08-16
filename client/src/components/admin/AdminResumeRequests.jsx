import React, { useState, useEffect } from 'react';
import { resumeApi } from '../../services/api';
import {
  FileText,
  RefreshCw,
  AlertTriangle,
  Clock,
  User,
  Building,
  Briefcase,
  Globe,
  X,
  ExternalLink
} from 'lucide-react';

const AdminResumeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await resumeApi.getResumeRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch resume requests:', err);
      setError('Unable to load resume requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Header Bar for Resume Requests */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#00ff9d]" />
          <h2 className="text-sm font-bold text-slate-200">
            Resume Requests ({requests.length})
          </h2>
        </div>
        <button
          onClick={fetchRequests}
          disabled={isLoading}
          title="Refresh data"
          className="p-1.5 rounded-lg bg-[#0a1619] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-[#00ff9d] transition-colors cursor-pointer disabled:opacity-50 text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="py-16 text-center space-y-3 bg-[#0a1619] border border-slate-800/80 rounded-2xl p-8">
          <div className="w-8 h-8 rounded-full border-2 border-[#00ff9d] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-300 font-bold tracking-wider">
            Loading resume requests...
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {!isLoading && error && (
        <div className="py-12 text-center space-y-3 bg-[#0a1619] border border-red-500/30 rounded-2xl p-6 max-w-lg mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
          <p className="text-xs text-slate-300 font-bold">{error}</p>
          <button
            onClick={fetchRequests}
            className="px-3 py-1.5 rounded-lg bg-[#00ff9d] text-black font-bold text-xs hover:bg-[#00ff9d]/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !error && requests.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-[#0a1619] border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
          <FileText className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No resume requests yet</h3>
          <p className="text-xs text-slate-400">
            Recruiter and visitor resume requests submitted through your portfolio will appear here.
          </p>
        </div>
      )}

      {/* REQUESTS LIST */}
      {!isLoading && !error && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => {
            const dateText = req.created_at
              ? new Date(req.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className="group relative rounded-xl border border-slate-800 bg-[#0a181c] p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:border-[#00ff9d] hover:shadow-[0_0_20px_rgba(0,255,157,0.15)] hover:-translate-y-0.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-100 group-hover:text-[#00ff9d] transition-colors">
                        {req.full_name}
                      </span>
                      <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                        {req.company}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{req.email}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{dateText}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                  {req.role && (
                    <div className="flex items-center gap-1 text-slate-300">
                      <Briefcase className="w-3.5 h-3.5 text-[#00e5ff]" />
                      <span>{req.role}</span>
                    </div>
                  )}

                  {req.linkedin && (
                    <a
                      href={req.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[#00ff9d] hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {req.reason && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 font-sans italic bg-[#030a0d] p-2 rounded border border-slate-800/60">
                    &quot;{req.reason}&quot;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#071317] border border-[#00ff9d]/40 rounded-xl shadow-[0_0_30px_rgba(0,255,157,0.2)] p-6 font-mono text-slate-200 text-xs space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#00ff9d] border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5" />
              <h3 className="text-base font-bold">Resume Request Details</h3>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Full Name</span>
                <span className="text-sm font-extrabold text-slate-100">{selectedRequest.full_name}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Work Email</span>
                  <a href={`mailto:${selectedRequest.email}`} className="text-xs font-bold text-[#00e5ff] hover:underline">
                    {selectedRequest.email}
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Company / Organization</span>
                  <span className="text-xs font-bold text-[#00ff9d]">{selectedRequest.company}</span>
                </div>
              </div>

              {selectedRequest.role && (
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Role / Position</span>
                  <span className="text-xs text-slate-200">{selectedRequest.role}</span>
                </div>
              )}

              {selectedRequest.linkedin && (
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">LinkedIn Profile</span>
                  <a
                    href={selectedRequest.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00ff9d] underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{selectedRequest.linkedin}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {selectedRequest.reason && (
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] uppercase mb-1">Reason for Request</span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed bg-[#030a0d] p-3 rounded-lg border border-slate-800">
                    {selectedRequest.reason}
                  </p>
                </div>
              )}

              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Requested At</span>
                <span className="text-xs text-slate-400">
                  {selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResumeRequests;
