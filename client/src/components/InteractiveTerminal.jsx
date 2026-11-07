import React, { useState, useRef, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import { assistantApi } from '../services/api';

const getTimestamp = () => {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
};

/**
 * Format terminal stdout with clean monospace indentation, headers, and theme support
 */
const renderStdout = (text, isBright = true) => {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, lIdx) => {
    const trimmed = line.trim();

    // Subtle divider lines like ----- or ======
    if (/^[-=]{3,}$/.test(trimmed)) {
      return (
        <div
          key={lIdx}
          className={`select-none font-mono text-[11px] leading-3 py-0.5 ${
            isBright ? 'text-black/60 font-bold' : 'text-slate-600'
          }`}
        >
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
          isBright
            ? isMainTitle
              ? 'text-black font-black text-sm'
              : isSectionHeader
              ? 'text-black font-black pt-1'
              : 'text-black font-bold'
            : isMainTitle
            ? 'text-[#00FF9C] font-bold'
            : isSectionHeader
            ? 'text-slate-200 font-semibold pt-1'
            : 'text-slate-100'
        }`}
      >
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <span
                key={pIdx}
                className={isBright ? 'text-black font-black' : 'text-[#00FF9C] font-semibold'}
              >
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
                        className={
                          isBright
                            ? 'text-blue-950 font-black underline hover:text-black cursor-pointer'
                            : 'text-[#00e5ff] hover:underline cursor-pointer'
                        }
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

const PALETTES = {
  brightGreen: {
    id: 'brightGreen',
    name: 'Ubuntu Vibrant Green',
    screenBg: 'bg-[#1df808]',
    border: 'border-[#00ff9d]/30',
    promptClass: 'text-white font-bold',
    commandClass: 'text-black font-bold',
    cursorClass: 'bg-black',
    motdClass: 'text-black font-semibold border-black/20',
    loadingClass: 'text-black font-bold',
    isBright: true,
  },
  dark: {
    id: 'dark',
    name: 'Terminal Dark Green',
    screenBg: 'bg-[#081611]',
    border: 'border-[#00ff9d]/30',
    promptClass: 'text-[#00ff9d] font-bold',
    commandClass: 'text-white font-bold',
    cursorClass: 'bg-white',
    motdClass: 'text-slate-200 border-slate-800/60',
    loadingClass: 'text-[#00ff9d] font-bold',
    isBright: false,
  },
  ubuntu: {
    id: 'ubuntu',
    name: 'Ubuntu Aubergine',
    screenBg: 'bg-[#300a24]',
    border: 'border-[#e95420]/35',
    promptClass: 'text-[#4af626] font-bold',
    commandClass: 'text-white font-bold',
    cursorClass: 'bg-white',
    motdClass: 'text-slate-200 border-white/20',
    loadingClass: 'text-[#e95420] font-bold',
    isBright: false,
  },
};

const InteractiveTerminal = ({ onFlip }) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [themeKey, setThemeKey] = useState('brightGreen');

  const palette = PALETTES[themeKey] || PALETTES.brightGreen;

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

    if (lower === 'pwd') {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: '/home/rithish',
        },
      ]);
      return;
    }

    if (lower === 'ls' || lower === 'dir') {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: 'Desktop  Documents  Downloads  Music  Pictures  Projects  Videos',
        },
      ]);
      return;
    }

    if (lower === 'git --version' || lower === 'git -v') {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: 'git version 2.50.1',
        },
      ]);
      return;
    }

    if (lower === 'theme' || lower === 'palette' || lower === 'themes') {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmd,
          timestamp: timeStr,
          status: 'exit: 0',
          output: `Terminal Palettes:
------------------
Active: ${palette.name}

Available Palettes:
  • green   - Ubuntu Vibrant Green (default)
  • dark    - Terminal Dark Green
  • ubuntu  - Ubuntu Aubergine

Usage: type 'theme <name>' to switch (e.g. 'theme dark')`,
        },
      ]);
      return;
    }

    if (lower.startsWith('theme ') || lower.startsWith('palette ')) {
      const target = lower.split(/\s+/)[1];
      const key = target === 'green' ? 'brightGreen' : target;
      if (PALETTES[key]) {
        setThemeKey(key);
        setHistory((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            command: cmd,
            timestamp: timeStr,
            status: 'exit: 0',
            output: `[ OK ] Terminal palette switched to: ${PALETTES[key].name}`,
          },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            command: cmd,
            timestamp: timeStr,
            status: 'exit: 1',
            output: `Unknown palette '${target}'. Available: green, dark, ubuntu`,
            isError: true,
          },
        ]);
      }
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
  theme [name]  Display or switch palettes: green, dark, ubuntu
  flip          Toggle 3D card to inspect human.txt
  cat human.txt Same as 'flip'
  whoami        Display current terminal session identity
  history       List previously entered questions

Natural Language Queries:
  Type questions in natural language to query Rithish's background, projects, & skills.
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
      className="absolute inset-0 w-full h-full backface-hidden bg-[#080d0c] border border-[#00ff9d]/30 hover:border-[#00ff9d]/50 rounded-xl shadow-2xl flex flex-col font-mono select-text cursor-text transition-all duration-300 font-ubuntu"
      onClick={handleTerminalClick}
    >
      {/* Shell Window Titlebar (Matching Existing Image 2 Layout Style) */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#080d0c] border-b border-[#00ff9d]/20 select-none shrink-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
          <span className="ml-2 text-slate-300 font-mono text-[11px] sm:text-xs tracking-tight">
            rithish@portfolio: ~
          </span>
        </div>

        {/* Single clean top-right flip button matching user badge */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onFlip) onFlip();
          }}
          className="text-[10px] sm:text-xs text-[#00ff9d] font-mono flex items-center gap-1.5 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 px-2.5 py-1 rounded border border-[#00ff9d]/30 hover:border-[#00ff9d] transition-colors cursor-pointer active:scale-95"
          title="Inspect human.txt"
        >
          <RotateCw className="w-3 h-3 text-[#00ff9d]" />
          <span>TAP TO FLIP</span>
        </button>
      </div>

      {/* Terminal Screen (Vibrant Green Background matching Image 1) */}
      <div
        ref={terminalScrollRef}
        className={`flex-1 p-3.5 sm:p-4 overflow-y-auto overflow-x-hidden space-y-2.5 text-xs sm:text-[13px] leading-relaxed custom-terminal-scroll ${palette.screenBg}`}
      >
        {/* Ubuntu Terminal MOTD Box (Exact match to user screenshot) */}
        <div
          className={`border p-2 sm:p-2.5 my-1 font-mono select-none ${
            palette.isBright
              ? 'border-black text-black'
              : 'border-white/30 text-slate-100'
          }`}
        >
          <div className="font-bold text-xs sm:text-[13px] leading-tight">
            Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-generic x86_64)
          </div>
          <div className="font-medium text-xs sm:text-[13px] leading-tight mt-1">
            Ask questions in natural language to explore background,
          </div>
          <div className="font-medium text-xs sm:text-[13px] leading-tight">
            projects, &amp; skills.
          </div>
        </div>

        {/* Command History Execution Sequence */}
        {history.map((item) => (
          <div key={item.id} className="space-y-0.5 pt-0.5 break-words">
            {/* Shell Prompt + Executed Query */}
            <div className="flex items-baseline flex-wrap">
              <span className={`select-none shrink-0 font-mono text-xs sm:text-[13px] ${palette.promptClass}`}>
                <span>rithish@portfolio</span>
                <span>:~$</span>
                <span>&nbsp;</span>
              </span>
              <span className={`font-mono break-all text-xs sm:text-[13px] ${palette.commandClass}`}>
                {item.command}
              </span>
            </div>

            {/* Command stdout output (True Ubuntu Terminal Output) */}
            {item.command !== '' && item.output && (
              <div className="space-y-0.5 pt-0.5 pl-0 text-xs sm:text-[13px]">
                {renderStdout(item.output, palette.isBright)}
              </div>
            )}
          </div>
        ))}

        {/* Short loading text node (Natural query) with block cursor */}
        {isLoading && (
          <div className={`py-0.5 text-xs font-mono flex items-center gap-1 select-none ${palette.loadingClass}`}>
            <span>[thinking...]</span>
            <span className={`inline-block w-2 sm:w-2.5 h-[1.15em] ${palette.cursorClass} animate-pulse align-middle`} />
          </div>
        )}

        {/* Active Shell Prompt Line with authentic solid block cursor █ */}
        <div className="flex items-baseline flex-wrap pt-1 gap-y-1">
          <span className={`select-none shrink-0 font-mono text-xs sm:text-[13px] ${palette.promptClass}`}>
            <span>rithish@portfolio</span>
            <span>:~$</span>
            <span>&nbsp;</span>
          </span>

          <form onSubmit={handleSubmit} className="flex-1 min-w-[140px] inline-flex items-baseline relative">
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
              placeholder={input ? '' : 'Ask anything about Rithish...'}
              className={`w-full bg-transparent font-mono text-xs sm:text-[13px] focus:outline-none border-none p-0 m-0 caret-transparent ${palette.commandClass} ${palette.isBright ? 'placeholder:text-black/45' : 'placeholder:text-slate-600'}`}
            />
            {/* Authentic blinking solid block cursor █ following typed text */}
            <div className="absolute inset-0 pointer-events-none flex items-baseline select-none overflow-hidden text-xs sm:text-[13px] font-mono">
              <span className="text-transparent whitespace-pre">{input}</span>
              {!isLoading && (
                <span className={`inline-block w-2 sm:w-2.5 h-[1.15em] ${palette.cursorClass} animate-pulse align-middle ml-0.5`} />
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Terminal Status Bar (Minimal Ubuntu Shell Footer from Image 2) */}
      <div className="px-3.5 py-1.5 bg-[#080d0c] border-t border-[#00ff9d]/20 flex items-center justify-between text-[11px] text-slate-400 select-none rounded-b-xl shrink-0 font-mono">
        <span className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] inline-block animate-pulse" />
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
