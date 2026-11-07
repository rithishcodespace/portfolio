import React, { useState, useRef, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import { assistantApi } from '../services/api';

const getTimestamp = () => {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
};

/**
 * Format terminal stdout with clean monospace indentation, headers, and subtle green accents
 */
const renderStdout = (text) => {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, lIdx) => {
    const trimmed = line.trim();

    // Subtle divider lines like ----- or ======
    if (/^[-=]{3,}$/.test(trimmed)) {
      return (
        <div key={lIdx} className="text-slate-600 select-none font-mono text-[11px] leading-3 py-0.5">
          {line}
        </div>
      );
    }

    // Bullet items
    const isBullet =
      trimmed.startsWith('* ') ||
      trimmed.startsWith('- ') ||
      trimmed.startsWith('• ');

    let lineContent = line;
    if (isBullet) {
      lineContent = line.replace(/^\s*(\*|-|•)\s*/, '  • ');
    }

    // Section headers ending with a colon (e.g. "Tech stack:", "Key features:")
    const isSectionHeader = /^[A-Za-z0-9\s/&]+:$/.test(trimmed);

    // Title line (e.g. "RAGForge", "AskDB", "Contact Information")
    const isMainTitle = lIdx === 0 && !isBullet && !isSectionHeader && trimmed.length > 0;

    // Parse inline bold markers
    const parts = lineContent.split(/(\*\*.*?\*\*)/g);

    return (
      <div
        key={lIdx}
        className={`min-h-[1.35em] ${
          isMainTitle
            ? 'text-[#00FF9C] font-bold'
            : isSectionHeader
            ? 'text-slate-200 font-semibold pt-1'
            : 'text-slate-100'
        }`}
      >
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <span key={pIdx} className="text-[#00FF9C] font-semibold">
                {part.slice(2, -2)}
              </span>
            );
          }
          // Highlight URLs
          if (part.includes('http://') || part.includes('https://')) {
            const urlTokens = part.split(/(https?:\/\/[^\s]+)/g);
            return (
              <span key={pIdx}>
                {urlTokens.map((tok, tIdx) => {
                  if (tok.startsWith('http://') || tok.startsWith('https://')) {
                    return (
                      <a
                        key={tIdx}
                        href={tok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00e5ff] hover:underline cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tok}
                      </a>
                    );
                  }
                  return tok;
                })}
              </span>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </div>
    );
  });
};

const InteractiveTerminal = ({ onFlip }) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Command history for Up/Down arrow navigation
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempDraft, setTempDraft] = useState('');

  const terminalScrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll terminal buffer to bottom
  const scrollToBottom = () => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading, input]);

  // Focus input on load and when terminal body is clicked
  const handleTerminalClick = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    // Up arrow: navigate backwards in history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      if (historyIndex === -1) {
        setTempDraft(input);
        const nextIndex = commandHistory.length - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
      return;
    }

    // Down arrow: navigate forwards in history
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;

      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput(tempDraft);
      }
      return;
    }

    // Ctrl + L: clear screen shortcut
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setHistory([]);
      return;
    }
  };

  const executeCommand = async (rawCmd) => {
    const cmd = rawCmd.trim();
    const startTime = performance.now();
    const timeStr = getTimestamp();

    if (!cmd) {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: '',
          output: '',
          timestamp: timeStr,
          status: 'exit: 0',
        },
      ]);
      return;
    }

    // Update command history for Up/Down arrow navigation
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setTempDraft('');

    const lower = cmd.toLowerCase();

    // Built-in shell commands
    if (lower === 'clear') {
      setHistory([]);
      return;
    }

    if (lower === 'help') {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: `portfolio-sh v2.6.0
Built-in utilities:

  help          Display this help documentation
  clear         Clear the terminal screen (or Ctrl+L)
  flip          Toggle 3D card to inspect human.txt
  cat human.txt Same as 'flip'
  whoami        Display current terminal session identity
  history       List previously entered questions

Natural Language Queries:
  Type questions in natural language. Answers are generated by the assistant engine
  using verified profile records.
  Example: "What projects has Rithish built?"`,
        },
      ]);
      return;
    }

    if (lower === 'flip' || lower === 'cat human.txt' || lower === 'human.txt' || lower === 'human') {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: '[ OK ] Flipping viewport to human.txt view...',
        },
      ]);
      if (onFlip) {
        setTimeout(() => onFlip(), 180);
      }
      return;
    }

    if (lower === 'whoami') {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: 'visitor@portfolio.rithish.site [session: guest]',
        },
      ]);
      return;
    }

    if (lower === 'history') {
      const historyList = commandHistory
        .concat(cmd)
        .map((c, i) => `  ${String(i + 1).padStart(3, ' ')}  ${c}`)
        .join('\n');
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: historyList || '  (no questions in history)',
        },
      ]);
      return;
    }

    // Natural Language Query -> Backend Assistant API
    setIsLoading(true);

    // Prepare previous history for conversation context (last 4 items)
    const chatContext = history
      .filter((h) => h.command && h.output)
      .slice(-4)
      .flatMap((h) => [
        { role: 'user', content: h.command },
        { role: 'assistant', content: h.output },
      ]);

    try {
      const res = await assistantApi.chat(cmd, chatContext);
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      const answer = res?.answer || 'Execution finished with empty output.';

      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          output: answer,
          timestamp: timeStr,
          status: `exit: 0 | ${elapsed}s`,
          isError: false,
        },
      ]);
    } catch (err) {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      console.error('Terminal query error:', err);

      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          output: `[ ERROR ] Failed to connect to assistant engine. (exit 1)
Try asking:
- What projects has Rithish built?
- What is his backend experience?
- What technologies does he use?`,
          timestamp: timeStr,
          status: `exit: 1 | ${elapsed}s`,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    const toSend = input;
    setInput('');
    executeCommand(toSend);
  };

  return (
    <div
      className="absolute inset-0 w-full h-full backface-hidden bg-[#0c1412] border border-[#00FF9C]/25 hover:border-[#00FF9C]/40 rounded-xl shadow-2xl flex flex-col font-mono text-slate-100 select-text cursor-text transition-all duration-300"
      onClick={handleTerminalClick}
    >
      {/* Shell Window Titlebar (Ubuntu Style) */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#080d0c] border-b border-[#00FF9C]/15 select-none shrink-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
          <span className="ml-2 text-slate-300 font-mono text-[11px] sm:text-xs tracking-tight">
            rithish@portfolio: ~
          </span>
        </div>

        {/* Single clean top-right flip button matching user image */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onFlip) onFlip();
          }}
          className="text-[10px] sm:text-xs text-[#00ff9d] font-mono flex items-center gap-1.5 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 px-2.5 py-1 rounded border border-[#00ff9d]/30 hover:border-[#00ff9d] transition-colors cursor-pointer"
          title="Flip card"
        >
          <RotateCw className="w-3 h-3 text-[#00ff9d]" />
          <span>TAP TO FLIP</span>
        </button>
      </div>

      {/* Terminal Screen / STDOUT Buffer */}
      <div
        ref={terminalScrollRef}
        className="flex-1 p-3.5 sm:p-4 overflow-y-auto overflow-x-hidden space-y-3 text-xs sm:text-[13px] leading-relaxed custom-terminal-scroll"
      >
        {/* Ubuntu Terminal MOTD (Minimal & Authentic) */}
        <div className="text-xs sm:text-[13px] font-mono text-slate-300 pb-2 border-b border-slate-800/60 leading-relaxed select-none space-y-0.5">
          <div className="text-slate-200">
            Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-generic x86_64)
          </div>
          <div className="text-slate-400 text-xs">
            Ask questions in natural language to explore background, projects, &amp; skills.
          </div>
        </div>

        {/* Command History Execution Sequence */}
        {history.map((item) => (
          <div key={item.id} className="space-y-1 pt-1 break-words">
            {/* Shell Prompt + Executed Query */}
            <div className="flex items-baseline flex-wrap">
              <span className="font-bold select-none shrink-0 font-mono text-xs sm:text-[13px]">
                <span className="text-[#00FF9C]">rithish@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-[#38bdf8]">~</span>
                <span className="text-white">$</span>
                <span className="text-white">&nbsp;</span>
              </span>
              <span className="text-white font-mono break-all font-medium text-xs sm:text-[13px]">
                {item.command}
              </span>
            </div>

            {/* Command stdout output (True Ubuntu Terminal Output) */}
            {item.command !== '' && item.output && (
              <div className="space-y-0.5 pt-0.5 pl-1 text-xs sm:text-[13px]">
                {renderStdout(item.output)}
              </div>
            )}
          </div>
        ))}

        {/* Short loading text node (Natural query) */}
        {isLoading && (
          <div className="py-0.5 text-xs font-mono text-[#00FF9C] flex items-center gap-1.5 select-none">
            <span className="animate-pulse">[thinking...]</span>
          </div>
        )}

        {/* Active Shell Prompt Line with blinking cursor and placeholder */}
        <div className="flex items-baseline flex-wrap pt-1 gap-y-1">
          <span className="font-bold select-none shrink-0 font-mono text-xs sm:text-[13px]">
            <span className="text-[#00FF9C]">rithish@portfolio</span>
            <span className="text-white">:</span>
            <span className="text-[#38bdf8]">~</span>
            <span className="text-white">$</span>
            <span className="text-white">&nbsp;</span>
          </span>

          <form onSubmit={handleSubmit} className="flex-1 min-w-[140px] inline-flex items-baseline">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              spellCheck={false}
              autoComplete="off"
              autoFocus
              placeholder="Ask anything about Rithish..."
              className="w-full bg-transparent text-white font-mono text-xs sm:text-[13px] focus:outline-none border-none p-0 m-0 caret-[#00FF9C] placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs sm:placeholder:text-[13px]"
            />
          </form>
        </div>
      </div>

      {/* Terminal Status Bar (Minimal Ubuntu Shell Footer - No duplicate button) */}
      <div className="px-3.5 py-1.5 bg-[#080d0c] border-t border-[#00FF9C]/10 flex items-center justify-between text-[11px] text-slate-400 select-none rounded-b-xl shrink-0 font-mono">
        <span className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] inline-block animate-pulse" />
          <span>bash</span>
        </span>
        <span className="text-[10px] sm:text-[11px] text-slate-500">
          ENTER: submit &bull; &uarr;&darr;: history &bull; &apos;help&apos; for commands
        </span>
      </div>
    </div>
  );
};

export default InteractiveTerminal;
