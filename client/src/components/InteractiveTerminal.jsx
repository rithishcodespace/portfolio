import React, { useState, useRef, useEffect } from 'react';
import { assistantApi } from '../services/api';

const BOOT_LOGS = [
  '[  0.000000] Linux 6.8.0-49-generic (x86_64) #49-Ubuntu SMP',
  '[  0.001420] systemd[1]: Mounted Portfolio Shell Environment.',
  '[  0.002810] daemon[812]: groq-llm engine online (qwen-3.8 / gpt-120b)',
  '[  0.003940] profile: verified records loaded (/data/profile.json)',
  '[  0.004210] session: pts/1 established for rithish@portfolio',
  '',
  'Type any question in natural language (e.g. "What projects have you built?").',
  'Type "help" for options, "clear" to reset screen, or "flip" for human.txt.',
];

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const getTimestamp = () => {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
};

/**
 * Format terminal stdout: preserve whitespace, highlight bold text with subtle green accent
 */
const renderStdout = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lIdx) => {
    let lineContent = line;
    const isBullet =
      line.trim().startsWith('* ') ||
      line.trim().startsWith('- ') ||
      line.trim().startsWith('• ');

    if (isBullet) {
      lineContent = line.replace(/^\s*(\*|-|•)\s*/, '  • ');
    }

    const parts = lineContent.split(/(\*\*.*?\*\*)/g);

    return (
      <div key={lIdx} className="min-h-[1.25em]">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <span key={pIdx} className="text-[#00FF9C] font-semibold">
                {part.slice(2, -2)}
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
  // Terminal history entries: array of items { id, command, output, status, timestamp, isError }
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('executing query via daemon...');
  const [spinnerIndex, setSpinnerIndex] = useState(0);

  // Command history for Up/Down arrow navigation
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempDraft, setTempDraft] = useState('');

  const terminalScrollRef = useRef(null);
  const inputRef = useRef(null);

  // Spinner animation while LLM is generating
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, 80);
    return () => clearInterval(interval);
  }, [isLoading]);

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
  const handleTerminalClick = (e) => {
    // Only focus if the user is not selecting text
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
      // Empty enter: just print prompt line
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
          output: `portfolio-sh v2.6.0 (x86_64-pc-linux-gnu)
Built-in terminal utilities:

  help          Display this help documentation
  clear         Clear the terminal screen (or Ctrl+L)
  flip          Toggle 3D card to inspect human.txt
  cat human.txt Same as 'flip'
  whoami        Display current terminal session identity
  history       List previously entered queries
  uname -a      Display system kernel architecture

Natural Language Queries:
  Type any question naturally. Queries are streamed to Groq LLM
  grounded on /data/profile.json facts.
  Example: "What distributed systems projects have you built?"`,
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
          output: '[system] flipping viewport to human.txt view...',
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
          output: 'visitor@portfolio.rithish.site [session: guest | pts/1]',
        },
      ]);
      return;
    }

    if (lower === 'uname' || lower === 'uname -a') {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: 'Linux portfolio 6.8.0-49-generic #49-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
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
          output: historyList || '  (no commands in history)',
        },
      ]);
      return;
    }

    // Natural Language Query -> Groq LLM Backend
    setIsLoading(true);
    setLoadingText('querying groq-llm daemon...');

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
      const answer = res?.answer || 'Command execution finished with empty output.';

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
          output: `[error] query daemon unreachable.
Rithish is a Backend Engineer focusing on Node.js, TypeScript, and Distributed Systems.
Try asking about 'projects', 'skills', or 'contact'.`,
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
      className="absolute inset-0 w-full h-full backface-hidden bg-[#0B1110] border border-[#00FF9C]/20 hover:border-[#00FF9C]/40 rounded-xl shadow-2xl flex flex-col font-mono text-slate-300 select-text cursor-text transition-all duration-300"
      onClick={handleTerminalClick}
    >
      {/* Linux / Shell Window Titlebar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#080d0c] border-b border-[#00FF9C]/10 select-none shrink-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 inline-block" />
          <span className="ml-1.5 text-slate-400 font-mono text-[11px] sm:text-xs tracking-tight">
            bash &mdash; rithish@portfolio:~ (pts/1)
          </span>
        </div>

        {/* Minimal terminal-style flip trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onFlip) onFlip();
            }}
            className="text-[10px] font-mono text-slate-400 hover:text-[#00FF9C] bg-[#0c1614] hover:bg-[#00FF9C]/10 border border-slate-800 hover:border-[#00FF9C]/30 px-2 py-0.5 rounded transition-all cursor-pointer"
            title="Inspect human.txt"
          >
            [ cat human.txt ]
          </button>
        </div>
      </div>

      {/* Terminal Screen / STDOUT Buffer */}
      <div
        ref={terminalScrollRef}
        className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-2.5 text-xs sm:text-[13px] leading-relaxed custom-terminal-scroll"
      >
        {/* Startup Boot Log (Shown when terminal is loaded) */}
        <div className="space-y-0.5 text-slate-500 text-[11px] select-none font-mono pb-1 border-b border-slate-900">
          {BOOT_LOGS.map((line, idx) => (
            <div key={idx} className={idx < 5 ? 'text-slate-500' : 'text-[#00FF9C]/80 font-medium'}>
              {line}
            </div>
          ))}
        </div>

        {/* Command History Execution Sequence */}
        {history.map((item) => (
          <div key={item.id} className="space-y-1 pt-1">
            {/* Shell Prompt + Executed Query */}
            <div className="flex items-baseline flex-wrap">
              <span className="font-bold select-none shrink-0 font-mono">
                <span className="text-[#00FF9C]">rithish@portfolio</span>
                <span className="text-slate-500">:</span>
                <span className="text-[#00e5ff]">~</span>
                <span className="text-[#00FF9C]">$</span>
                <span className="text-slate-400">&nbsp;</span>
              </span>
              <span className="text-white font-mono break-all font-medium">
                {item.command}
              </span>
            </div>

            {/* Execution status & stdout */}
            {item.command !== '' && (
              <div className="space-y-1 pl-2 sm:pl-3">
                {item.status && (
                  <div className="text-[10px] text-slate-400 select-none">
                    [{item.status} &bull; {item.timestamp}]
                  </div>
                )}
                {item.output && (
                  <div
                    className={`font-mono leading-relaxed pl-2 border-l ${
                      item.isError
                        ? 'text-rose-400 border-rose-500/40'
                        : 'text-slate-200 border-[#00FF9C]/25'
                    }`}
                  >
                    {renderStdout(item.output)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Active Command Execution Loading State */}
        {isLoading && (
          <div className="space-y-1 pl-2 sm:pl-3 pt-1 text-xs text-[#00FF9C]">
            <span className="mr-2 text-slate-400 font-mono select-none">
              {SPINNER_FRAMES[spinnerIndex]}
            </span>
            <span className="text-slate-300 font-mono">{loadingText}</span>
            <span className="inline-block w-1.5 h-3 bg-[#00FF9C] ml-1.5 animate-terminal-cursor align-middle" />
          </div>
        )}

        {/* Active Shell Prompt Line */}
        <div className="flex items-baseline flex-wrap pt-1">
          <span className="font-bold select-none shrink-0 font-mono">
            <span className="text-[#00FF9C]">rithish@portfolio</span>
            <span className="text-slate-500">:</span>
            <span className="text-[#00e5ff]">~</span>
            <span className="text-[#00FF9C]">$</span>
            <span className="text-slate-400">&nbsp;</span>
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
              className="w-full bg-transparent text-white font-mono text-xs sm:text-[13px] focus:outline-none border-none p-0 m-0 caret-[#00FF9C]"
            />
          </form>
        </div>
      </div>

      {/* Terminal Status Bar (Minimal Footer) */}
      <div className="px-3.5 py-1.5 bg-[#080d0c] border-t border-[#00FF9C]/10 flex items-center justify-between text-[10px] text-slate-400 select-none rounded-b-xl">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] inline-block animate-pulse" />
          <span>PORTFOLIO_TTY</span>
        </span>
        <span className="hidden min-[380px]:inline text-slate-400">
          ENTER: submit &bull; &uarr;&darr;: history &bull; natural language
        </span>
      </div>
    </div>
  );
};

export default InteractiveTerminal;
