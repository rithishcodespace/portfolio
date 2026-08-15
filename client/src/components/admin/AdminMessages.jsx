import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { messagesApi, trackingApi } from '../../services/api';
import AdminMessageDetailModal from './AdminMessageDetailModal';
import {
  LogOut,
  Mail,
  RefreshCw,
  AlertTriangle,
  Clock,
  User,
  Inbox,
  Eye,
  EyeOff,
  Filter,
  Users
} from 'lucide-react';

const AdminMessages = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('unseen'); // 'unseen' | 'seen' | 'all'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // View counts state
  const [stats, setStats] = useState({
    uniqueVisitors: 0,
    totalViews: 0
  });

  // Fetch messages from backend according to filter
  const fetchMessages = async (currentFilter = filter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await messagesApi.getMessages(currentFilter);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unique view counts
  const fetchStats = async () => {
    try {
      const data = await trackingApi.getStats();
      if (data) {
        setStats({
          uniqueVisitors: data.uniqueVisitors || 0,
          totalViews: data.totalViews || 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch view stats:', err);
    }
  };

  const handleRefresh = () => {
    fetchMessages(filter);
    fetchStats();
  };

  useEffect(() => {
    fetchMessages(filter);
    fetchStats();
  }, [filter]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  const handleToggleSeen = async (id, targetSeen = true) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, seen: targetSeen } : m))
    );
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, seen: targetSeen } : null));
    }
    try {
      await messagesApi.markSeen(id, targetSeen);
    } catch (err) {
      fetchMessages(filter);
    }
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.id && !msg.seen) {
      handleToggleSeen(msg.id, true);
    }
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
  };

  const unseenCount = messages.filter((m) => !m.seen).length;
  const seenCount = messages.filter((m) => m.seen).length;

  return (
    <div className="min-h-screen bg-[#070e10] text-slate-200 font-mono flex flex-col selection:bg-[#00ff9d] selection:text-black">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-[#040c0e] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Branding & Page Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center text-[#00ff9d]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                Portfolio Admin Console
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                <span>Messages</span>
                <span className="text-xs font-normal text-slate-400">
                  ({messages.length})
                </span>
              </h1>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh data"
              className="p-2 rounded-lg bg-[#0a1619] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-[#00ff9d] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-800/40 hover:bg-red-900/50 text-red-400 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">

        {/* View Count Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Unique Visitors Card */}
          <div className="bg-[#0a181c] border border-[#00ff9d]/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(0,255,157,0.05)]">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#00ff9d]" />
                Unique Visitors
              </span>
              <div className="text-2xl font-black text-slate-100">
                {stats.uniqueVisitors}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/20 flex items-center justify-center text-[#00ff9d]">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Total Views Card */}
          <div className="bg-[#0a181c] border border-[#00e5ff]/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(0,229,255,0.05)]">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#00e5ff]" />
                Total Page Views
              </span>
              <div className="text-2xl font-black text-slate-100">
                {stats.totalViews}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff]">
              <Eye className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        {/* Toggle Filter Bar */}
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

        {/* LOADING STATE */}
        {isLoading && (
          <div className="py-20 text-center space-y-3 bg-[#0a1619] border border-slate-800/80 rounded-2xl p-8">
            <div className="w-8 h-8 rounded-full border-2 border-[#00ff9d] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-300 font-bold tracking-wider">
              Loading messages...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && error && (
          <div className="py-16 text-center space-y-4 bg-[#0a1619] border border-red-500/30 rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200">Unable to load messages</h3>
              <p className="text-xs text-slate-400">
                Please check your network connection or try again.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg bg-[#00ff9d] text-black font-bold text-xs hover:bg-[#00ff9d]/90 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !error && messages.length === 0 && (
          <div className="py-20 text-center space-y-3 bg-[#0a1619] border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#040c0e] border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-200">
              No {filter === 'all' ? '' : filter} messages
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {filter === 'unseen'
                ? 'All messages have been marked as seen.'
                : filter === 'seen'
                ? 'No messages marked as visited/seen yet.'
                : 'Messages submitted through your portfolio contact form will appear here.'}
            </p>
          </div>
        )}

        {/* MESSAGES LIST */}
        {!isLoading && !error && messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((msg, idx) => {
              const isSeen = Boolean(msg.seen);
              const name = msg.name || msg.sender_name || 'Anonymous';
              const email = msg.email || msg.sender_email || 'No email';
              const subject = msg.subject || 'No Subject';
              const snippet = msg.message || msg.content || msg.body || '';
              const dateText = msg.date || msg.createdAt || msg.created_at
                ? new Date(msg.date || msg.createdAt || msg.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <div
                  key={msg.id || idx}
                  onClick={() => handleOpenMessage(msg)}
                  className={`group relative rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:-translate-y-1 ${
                    isSeen
                      ? 'bg-[#061012] border-slate-800/80 hover:border-[#00ff9d]/60 hover:shadow-[0_0_15px_rgba(0,255,157,0.15)] opacity-85 hover:opacity-100'
                      : 'bg-[#0a181c] border-[#00ff9d]/50 hover:border-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.08)] hover:shadow-[0_0_25px_rgba(0,255,157,0.25)]'
                  }`}
                >
                  {/* Floating Hover Click Affordance Badge */}
                  <span className="absolute top-3.5 right-14 z-20 text-[10px] text-[#00ff9d] bg-[#040c0e] px-2 py-0.5 rounded border border-[#00ff9d]/50 font-bold opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200 pointer-events-none hidden sm:inline-flex items-center gap-1 shadow-md">
                    <span>CLICK TO READ</span>
                    <span className="text-[11px]">↗</span>
                  </span>

                  {!isSeen && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#00ff9d] rounded-r" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isSeen ? 'text-slate-300' : 'text-slate-100 font-extrabold'}`}>
                          {name}
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
                        <span>{email}</span>
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
                          handleToggleSeen(msg.id, !isSeen);
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

                  <div className="text-xs font-bold text-[#00e5ff] mb-1 group-hover:underline">
                    {subject}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    {snippet}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selectedMessage && (
        <AdminMessageDetailModal
          message={selectedMessage}
          onClose={handleCloseModal}
          onToggleSeen={handleToggleSeen}
        />
      )}
    </div>
  );
};

export default AdminMessages;
