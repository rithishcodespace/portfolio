import React, { useState, useRef, useEffect } from 'react';
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

    // Parse inline bold markers
    const parts = lineContent.split(/(\*\*.*?\*\*)/g);

    return (
      <div
        key={lIdx}
        className={`min-h-[1.35em] ${
          isSectionHeader ? 'text-slate-200 font-semibold pt-1' : 'text-slate-300'
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
      className="absolute inset-0 w-full h-full backface-hidden bg-[#0B1110] border border-[#00FF9C]/20 hover:border-[#00FF9C]/40 rounded-xl shadow-2xl flex flex-col font-mono text-slate-300 select-text cursor-text transition-all duration-300"
      onClick={handleTerminalClick}
    >
      {/* Shell Window Titlebar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#080d0c] border-b border-[#00FF9C]/10 select-none shrink-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 inline-block" />
          <span className="ml-1.5 text-slate-400 font-mono text-[11px] sm:text-xs tracking-tight">
            portfolio-sh &mdash; rithish@portfolio:~
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
        className="flex-1 p-3.5 sm:p-4 overflow-y-auto overflow-x-hidden space-y-3 text-xs sm:text-[13px] leading-relaxed custom-terminal-scroll"
      >
        {/* Startup Output */}
        <div className="space-y-2.5 text-slate-300 text-xs sm:text-[13px] font-mono pb-2.5 border-b border-slate-800/60 leading-relaxed select-none">
          {/* Portfolio environment initialization status */}
          <div className="space-y-0.5 text-xs">
            <div>
              <span className="text-[#00FF9C] font-semibold">[ OK ]</span>{' '}
              <span className="text-slate-300">Portfolio environment initialized</span>
            </div>
            <div>
              <span className="text-[#00FF9C] font-semibold">[ OK ]</span>{' '}
              <span className="text-slate-300">Profile records loaded</span>
            </div>
            <div>
              <span className="text-[#00FF9C] font-semibold">[ OK ]</span>{' '}
              <span className="text-slate-300">Assistant engine ready</span>
            </div>
          </div>

          {/* Welcome message */}
          <div className="text-slate-300 pt-0.5">
            Welcome to Rithish&apos;s portfolio terminal.
            <br />
            Ask questions in natural language to explore his background, projects, skills, and experience.
          </div>

          {/* Plain-text discoverable examples */}
          <div className="space-y-0.5 pt-0.5 text-slate-400">
            <div className="text-slate-200 font-medium">Try asking:</div>
            <div className="pl-2">- What projects has Rithish built?</div>
            <div className="pl-2">- What is his backend experience?</div>
            <div className="pl-2">- What are his achievements?</div>
            <div className="pl-2">- What technologies does he use?</div>
          </div>
        </div>

        {/* Command History Execution Sequence */}
        {history.map((item) => (
          <div key={item.id} className="space-y-1 pt-1 break-words">
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
              <div className="space-y-1 pl-2 sm:pl-3 pt-0.5">
                {item.status && (
                  <div className="text-[10px] text-slate-500 select-none">
                    [{item.status} &bull; {item.timestamp}]
                  </div>
                )}
                {item.output && (
                  <div
                    className={`font-mono leading-relaxed pl-2.5 border-l ${
                      item.isError
                        ? 'text-rose-400 border-rose-500/40'
                        : 'border-[#00FF9C]/25'
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
          <div className="flex items-center gap-2 pl-2 sm:pl-3 pt-1 text-xs font-mono">
            <span className="text-[#00FF9C] font-semibold animate-pulse">[ RUNNING ]</span>
            <span className="text-slate-400">querying assistant engine...</span>
          </div>
        )}

        {/* Active Shell Prompt Line with blinking cursor and placeholder */}
        <div className="flex items-baseline flex-wrap pt-1.5">
          <span className="font-bold select-none shrink-0 font-mono">
            <span className="text-[#00FF9C]">rithish@portfolio</span>
            <span className="text-slate-500">:</span>
            <span className="text-[#00e5ff]">~</span>
            <span className="text-[#00FF9C]">$</span>
            <span className="text-slate-400">&nbsp;</span>
          </span>

          <form onSubmit={handleSubmit} className="flex-1 min-w-[200px] inline-flex items-baseline">
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
              placeholder="Type a question about Rithish..."
              className="w-full bg-transparent text-white font-mono text-xs sm:text-[13px] focus:outline-none border-none p-0 m-0 caret-[#00FF9C] placeholder:text-slate-600 placeholder:font-mono placeholder:text-xs sm:placeholder:text-[13px]"
            />
          </form>
        </div>
      </div>

      {/* Terminal Status Bar (Minimal Fixed Footer) */}
      <div className="px-3.5 py-1.5 bg-[#080d0c] border-t border-[#00FF9C]/10 flex items-center justify-between text-[10px] text-slate-400 select-none rounded-b-xl shrink-0">
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
