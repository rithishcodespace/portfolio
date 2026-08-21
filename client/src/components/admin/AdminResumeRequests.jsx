import React, { useState, useEffect } from 'react';
import { resumeApi } from '../../services/api';
import {
  FileText,
  RefreshCw,
  AlertTriangle,
  Clock,
  User,
  Briefcase,
  Globe,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  Filter
} from 'lucide-react';

const AdminResumeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('unseen'); // 'unseen' | 'seen' | 'all'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async (currentFilter = filter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await resumeApi.getResumeRequests(currentFilter);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch resume requests:', err);
      setError('Unable to load resume requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(filter);
  }, [filter]);

  const handleRefresh = () => {
    fetchRequests(filter);
  };

  const handleToggleSeen = async (id, targetSeen = true) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, seen: targetSeen } : req))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, seen: targetSeen } : null));
    }
    try {
      await resumeApi.markSeen(id, targetSeen);
    } catch (err) {
      fetchRequests(filter);
    }
  };

  const handleOpenRequest = (req) => {
    setSelectedRequest(req);
    if (req.id && !req.seen) {
      handleToggleSeen(req.id, true);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Toggle Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Filter className="w-3.5 h-3.5 text-[#00ff9d]" />
          <span>Filter View:</span>
        </div>

        {/* Filter Pills Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-[#040c0e] border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setFilter('unseen')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'unseen'
                ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Unvisited / Unseen</span>
          </button>

          <button
            onClick={() => setFilter('seen')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'seen'
                ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visited / Seen</span>
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#00ff9d] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Messages
          </button>
        </div>
      </div>

      {/* Sub Header / Count & Refresh Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#00ff9d]" />
          <h2 className="text-xs font-bold text-slate-300">
            Resume Requests ({requests.length})
          </h2>
        </div>
        <button
          onClick={handleRefresh}
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
            onClick={handleRefresh}
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
          <h3 className="text-sm font-bold text-slate-200">
            No {filter === 'all' ? '' : filter} resume requests
          </h3>
          <p className="text-xs text-slate-400">
            {filter === 'unseen'
              ? 'All resume requests have been marked as seen.'
              : filter === 'seen'
              ? 'No resume requests marked as visited/seen yet.'
              : 'Recruiter and visitor resume requests submitted through your portfolio will appear here.'}
          </p>
        </div>
      )}

      {/* REQUESTS LIST */}
      {!isLoading && !error && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => {
            const isSeen = Boolean(req.seen);
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
                onClick={() => handleOpenRequest(req)}
                className={`group relative rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:-translate-y-1 ${
                  isSeen
                    ? 'bg-[#061012] border-slate-800/80 hover:border-[#00ff9d]/60 hover:shadow-[0_0_15px_rgba(0,255,157,0.15)] opacity-85 hover:opacity-100'
                    : 'bg-[#0a181c] border-[#00ff9d]/50 hover:border-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.08)] hover:shadow-[0_0_25px_rgba(0,255,157,0.25)]'
                }`}
              >
                <span className="absolute top-3.5 right-14 z-20 text-[10px] text-[#00ff9d] bg-[#040c0e] px-2 py-0.5 rounded border border-[#00ff9d]/50 font-bold opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200 pointer-events-none hidden sm:inline-flex items-center gap-1 shadow-md">
                  <span>CLICK TO DETAILS</span>
                  <span className="text-[11px]">↗</span>
                </span>

                {!isSeen && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#00ff9d] rounded-r" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isSeen ? 'text-slate-300' : 'text-slate-100 font-extrabold'}`}>
                        {req.full_name}
                      </span>
                      <span className="text-[10px] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                        {req.company}
                      </span>
                      {!isSeen ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                          UNSEEN
                        </span>
                      ) : (
                        <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                          SEEN
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{req.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{dateText}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSeen(req.id, !isSeen);
                      }}
                      title={isSeen ? 'Mark as Unseen' : 'Mark as Seen'}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isSeen
                          ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200'
                          : 'bg-[#00ff9d]/10 border-[#00ff9d]/30 hover:bg-[#00ff9d] hover:text-black text-[#00ff9d]'
                      }`}
                    >
                      {isSeen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
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
                      className="flex items-center gap-1 text-[#00ff9d] hover:underline font-bold"
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

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-[#00ff9d]">
                <FileText className="w-5 h-5" />
                <h3 className="text-base font-bold">Resume Request Details</h3>
              </div>
              <button
                onClick={() => handleToggleSeen(selectedRequest.id, !Boolean(selectedRequest.seen))}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 text-[11px] font-bold transition-colors"
              >
                {selectedRequest.seen ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{selectedRequest.seen ? 'Mark Unseen' : 'Mark Seen'}</span>
              </button>
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
