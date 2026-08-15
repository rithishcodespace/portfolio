import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { messagesApi } from '../../services/api';
import AdminMessageDetailModal from './AdminMessageDetailModal';
import {
  LogOut,
  Mail,
  RefreshCw,
  MessageSquare,
  AlertTriangle,
  Clock,
  User,
  Inbox,
  CheckCircle,
} from 'lucide-react';

const AdminMessages = () => {
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [readIds, setReadIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await messagesApi.getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.id) {
      setReadIds((prev) => new Set([...prev, msg.id]));
      messagesApi.markRead(msg.id).catch(() => {});
    }
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
  };

  const isMessageRead = (msg) => {
    if (msg.is_read || msg.read) return true;
    if (msg.id && readIds.has(msg.id)) return true;
    return false;
  };

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

          {/* Right Header Controls: Refresh & Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMessages}
              disabled={isLoading}
              title="Refresh messages"
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
        
        {/* Subheader info bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-[#00ff9d]" />
            <span className="text-slate-200 font-bold">INBOX_RECEIVER</span>
            <span className="text-slate-500 font-mono text-[11px]">
              [ADMIN_MODE]
            </span>
          </div>

          {!isLoading && !error && messages.length > 0 && (
            <div className="text-[11px] text-slate-400">
              Click any message to open complete detail view
            </div>
          )}
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
              onClick={fetchMessages}
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
            <h3 className="text-base font-bold text-slate-200">No messages yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Messages submitted through your portfolio contact form will appear here.
            </p>
          </div>
        )}

        {/* MESSAGES LIST */}
        {!isLoading && !error && messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((msg, idx) => {
              const read = isMessageRead(msg);
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
                  className={`group relative rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
                    read
                      ? 'bg-[#061012] border-slate-800/80 hover:border-slate-700 opacity-90'
                      : 'bg-[#0a181c] border-[#00ff9d]/50 hover:border-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.08)]'
                  }`}
                >
                  {/* Subtle Unread Left Accent Bar */}
                  {!read && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#00ff9d] rounded-r" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${read ? 'text-slate-300' : 'text-slate-100 font-extrabold'}`}>
                          {name}
                        </span>
                        {!read && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30">
                            UNREAD
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{email}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{dateText}</span>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="text-xs font-bold text-[#00e5ff] mb-1 group-hover:underline">
                    {subject}
                  </div>

                  {/* Short Preview */}
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
        />
      )}
    </div>
  );
};

export default AdminMessages;
