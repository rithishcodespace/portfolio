import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  CheckCircle,
  Database,
  Server,
  Layers,
  Code,
  ArrowRight,
  RefreshCw,
  Cpu,
  Terminal,
} from 'lucide-react';

const SkillInspectionModal = ({ activeSkill, onClose }) => {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!activeSkill) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0c1618] border border-[#00ff9d]/40 shadow-[0_0_35px_rgba(0,255,157,0.2)] rounded-xl max-w-2xl w-full font-mono text-slate-200 overflow-hidden flex flex-col my-auto relative animate-scaleUp"
      >
        {/* Modal Window Bar Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#081113]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
            <span className="ml-2 text-[#00ff9d] font-bold text-xs sm:text-sm">
              {activeSkill.fileName}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">
              [INSPECTOR MODE]
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#00ff9d] hover:bg-slate-800/60 p-1 rounded transition-colors cursor-pointer"
            aria-label="Close Inspection Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {activeSkill.fileName === 'languages.sh' && <LanguagesInspector />}
          {activeSkill.fileName === 'backend.service' && <BackendInspector />}
          {activeSkill.fileName === 'frontend.ui' && <FrontendInspector />}
          {activeSkill.fileName === 'databases.sql' && <DatabasesInspector />}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-[#081113] flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
            <span>INSPECTION ACTIVE • PRESS ESC TO EXIT</span>
          </span>
          <span className="text-[#00ff9d] font-semibold">v1.0</span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 1. LANGUAGES INSPECTOR (languages.sh)
// =========================================================================
const LanguagesInspector = () => {
  const [selectedLang, setSelectedLang] = useState('TypeScript');

  const langData = {
    TypeScript: {
      role: 'Primary application development',
      usedFor: ['Backend services', 'APIs', 'Full-stack applications'],
      why: 'Strong typing, maintainability and excellent developer tooling.',
      color: '#00ff9d',
      codeSnippet: `interface User {\n  id: string;\n  role: 'admin' | 'dev';\n}\nconst authenticate = (u: User): boolean => u.role === 'admin';`,
    },
    Python: {
      role: 'AI / scripting / data processing',
      usedFor: ['AI applications', 'Automation', 'Data processing'],
      why: 'Fast prototyping, rich ML/AI ecosystem, expressive syntax.',
      color: '#38bdf8',
      codeSnippet: `import asyncio\nasync def process_embeddings(docs):\n    return await ai_engine.vectorize(docs)`,
    },
    'C++': {
      role: 'Problem solving / DSA',
      usedFor: ['Competitive programming', 'Algorithms', 'Performance-oriented code'],
      why: 'Uncompromising execution speed, explicit memory control, deep algorithmic foundation.',
      color: '#f43f5e',
      codeSnippet: `#include <vector>\nusing namespace std;\nint main() { vector<int> dp(100, 0); return 0; }`,
    },
    Java: {
      role: 'Backend / OOP',
      usedFor: ['Enterprise systems', 'Robust OOP design', 'Concurrent services'],
      why: 'Strict type safety, battle-tested JVM runtime, structured enterprise patterns.',
      color: '#fbbf24',
      codeSnippet: `@RestController\npublic class SystemController {\n  @GetMapping("/health")\n  public Status getStatus() { return Status.UP; }\n}`,
    },
    SQL: {
      role: 'Data persistence and querying',
      usedFor: ['Complex JOINs', 'Query optimization', 'Schema design & indexing'],
      why: 'Declarative data manipulation, ACID guarantees, relational consistency.',
      color: '#c084fc',
      codeSnippet: `SELECT p.name, COUNT(t.id) as tasks\nFROM projects p\nJOIN tasks t ON p.id = t.project_id\nGROUP BY p.id;`,
    },
  };

  const current = langData[selectedLang];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Code className="w-5 h-5 text-[#00ff9d]" />
          <span>LANGUAGE USAGE EXPLORER</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select a programming language to inspect my core engineering focus & use-cases.
        </p>
      </div>

      {/* Language Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.keys(langData).map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              selectedLang === lang
                ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.2)]'
                : 'bg-[#071113] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            [ {lang} ]
          </button>
        ))}
      </div>

      {/* Detail Inspector Card */}
      <div className="bg-[#071113] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider block">ROLE</span>
          <span className="text-sm font-bold text-slate-100">{current.role}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider block mb-1.5">
            USED FOR
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {current.usedFor.map((item, i) => (
              <div
                key={i}
                className="bg-[#0c1a1d] border border-slate-800/80 p-2 rounded text-xs text-slate-300 flex items-center gap-1.5"
              >
                <span className="text-[#00ff9d]">→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider block mb-1">WHY</span>
          <p className="text-xs text-slate-300 leading-relaxed">{current.why}</p>
        </div>

        {/* Code Snippet Box */}
        <div className="bg-[#04090a] border border-slate-800/90 rounded-lg p-3 text-xs font-mono">
          <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-between">
            <span>SAMPLE_SNIPPET.ts</span>
            <span className="text-[#00ff9d]">{selectedLang}</span>
          </div>
          <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
            {current.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. BACKEND INSPECTOR (backend.service)
// =========================================================================
const BackendInspector = () => {
  const stages = [
    { id: 'CLIENT', name: 'CLIENT', desc: 'Initiates HTTP request with JSON payload & headers.' },
    { id: 'API', name: 'API GATEWAY', desc: 'Routes incoming request to specified service endpoint.' },
    { id: 'VALIDATION', name: 'VALIDATION', desc: 'Validate incoming data before it reaches business logic.' },
    { id: 'AUTH', name: 'AUTH', desc: 'Verify JWT token, session state & user permissions (RBAC).' },
    { id: 'SERVICE', name: 'SERVICE', desc: 'Business rules live here. Keep transport concerns separate.' },
    { id: 'CACHE_DB', name: 'CACHE / DB', desc: 'Frequently accessed data can bypass the primary database.' },
    { id: 'RESPONSE', name: 'RESPONSE', desc: 'Returns sanitized JSON response with appropriate status code.' },
  ];

  const [activeStage, setActiveStage] = useState('SERVICE');
  const [animatingStage, setAnimatingStage] = useState(null);

  const sendRequest = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < stages.length) {
        setAnimatingStage(stages[index].id);
        setActiveStage(stages[index].id);
        index++;
      } else {
        setAnimatingStage(null);
        clearInterval(interval);
      }
    }, 450);
  };

  const activeObj = stages.find((s) => s.id === activeStage);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-[#00e5ff]" />
            <span>REQUEST LIFECYCLE INSPECTOR</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any stage or send a live request packet through the backend pipeline.
          </p>
        </div>
        <button
          onClick={sendRequest}
          className="bg-[#00e5ff]/10 hover:bg-[#00e5ff] text-[#00e5ff] hover:text-black border border-[#00e5ff]/40 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>SEND REQUEST</span>
        </button>
      </div>

      {/* Interactive Pipeline Diagram */}
      <div className="bg-[#071113] border border-slate-800 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((stage) => {
            const isSelected = activeStage === stage.id;
            const isAnimating = animatingStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`p-2 rounded.lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[64px] relative ${
                  isAnimating
                    ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_#00e5ff]'
                    : isSelected
                    ? 'bg-[#0c1a1d] border-[#00e5ff]/80 text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                    : 'bg-[#040a0c] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {isAnimating && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00e5ff] rounded-full animate-ping"></span>
                )}
                <span className="text-[10px] font-bold tracking-tighter truncate w-full">
                  {stage.name}
                </span>
                <span
                  className={`text-[9px] mt-1 px-1 py-0.5 rounded font-mono ${
                    isSelected ? 'bg-[#00e5ff]/20 text-[#00e5ff]' : 'text-slate-500'
                  }`}
                >
                  {isSelected ? 'INSPECT' : 'STAGE'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Card */}
      <div className="bg-[#071113] border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <span className="text-xs font-bold text-[#00e5ff]">{activeObj.name} STAGE</span>
          <span className="text-[10px] text-slate-500 font-mono">[PIPELINE_NODE]</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">{activeObj.desc}</p>
      </div>
    </div>
  );
};

// =========================================================================
// 3. FRONTEND INSPECTOR (frontend.ui)
// =========================================================================
const FrontendInspector = () => {
  const [stage, setStage] = useState('UI');
  const [appState, setAppState] = useState({
    isLoading: false,
    statusText: 'Ready',
    projects: [],
  });

  const stagesInfo = {
    USER: 'Triggers user interaction (e.g., clicking "Load Projects").',
    UI: 'Renders the interface and captures user intent.',
    STATE: 'Controls what the interface currently knows.',
    API: 'Communicates with backend services via HTTP/REST.',
    RESPONSE: 'Updates application state and the resulting UI.',
  };

  const handleLoadProjects = () => {
    setStage('USER');
    setAppState({ isLoading: true, statusText: ' Capturing User Click...', projects: [] });

    setTimeout(() => {
      setStage('UI');
      setAppState({ isLoading: true, statusText: ' Dispatching UI Action...', projects: [] });
    }, 400);

    setTimeout(() => {
      setStage('STATE');
      setAppState({ isLoading: true, statusText: ' Setting isLoading: true...', projects: [] });
    }, 800);

    setTimeout(() => {
      setStage('API');
      setAppState({ isLoading: true, statusText: ' GET /api/projects (Fetching)...', projects: [] });
    }, 1200);

    setTimeout(() => {
      setStage('RESPONSE');
      setAppState({
        isLoading: false,
        statusText: ' Received 200 OK • State Updated!',
        projects: [
          { name: 'AssetFlow', desc: 'Asset Tracking Platform', status: 'ACTIVE' },
          { name: 'PatentIQ', desc: 'Prior-Art Analysis Tool', status: 'ACTIVE' },
          { name: 'DevTinder', desc: 'Developer Matchmaking', status: 'ACTIVE' },
        ],
      });
    }, 1800);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-fuchsia-400" />
          <span>UI → STATE → API → UI SIMULATOR</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Demonstrating reactive frontend state management & API lifecycle.
        </p>
      </div>

      {/* Pipeline Stages Flow */}
      <div className="flex flex-wrap items-center justify-between gap-1 bg-[#071113] border border-slate-800 p-3 rounded-xl mb-4 text-xs font-mono">
        {['USER', 'UI', 'STATE', 'API', 'RESPONSE'].map((st, i) => (
          <React.Fragment key={st}>
            <button
              onClick={() => setStage(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                stage === st
                  ? 'bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-300 shadow-[0_0_8px_rgba(217,70,239,0.3)]'
                  : 'bg-[#040a0c] border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
            {i < 4 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* Selected Stage Explanation */}
      <div className="bg-[#071113] border border-slate-800 p-3 rounded-lg mb-4 text-xs text-slate-300">
        <span className="text-fuchsia-400 font-bold mr-2">[{stage} STAGE]:</span>
        <span>{stagesInfo[stage]}</span>
      </div>

      {/* Interactive Mock UI Container */}
      <div className="bg-[#040a0c] border border-slate-800 rounded-xl p-4 font-mono">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="text-xs font-bold text-slate-200">MOCK PROJECTS WORKSTATION</span>
          </div>
          <span className="text-[10px] text-fuchsia-400 font-semibold">
            Status: {appState.statusText}
          </span>
        </div>

        <button
          onClick={handleLoadProjects}
          disabled={appState.isLoading}
          className="w-full bg-[#0c1a1d] hover:bg-fuchsia-500 hover:text-black text-fuchsia-400 border border-fuchsia-500/50 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mb-3"
        >
          {appState.isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>EXECUTING FRONTEND PIPELINE...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>[ Load Projects ]</span>
            </>
          )}
        </button>

        {/* Dynamic Project Rows */}
        <div className="space-y-2">
          {appState.projects.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
              [Click "Load Projects" to trigger UI → STATE → API data flow]
            </div>
          ) : (
            appState.projects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-[#081518] border border-slate-800/80 p-2.5 rounded-lg flex items-center justify-between text-xs animate-fadeIn"
              >
                <div>
                  <div className="font-bold text-slate-100">{proj.name}</div>
                  <div className="text-[10px] text-slate-400">{proj.desc}</div>
                </div>
                <span className="text-[10px] text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded border border-[#00ff9d]/30 font-semibold">
                  {proj.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. DATABASES INSPECTOR (databases.sql)
// =========================================================================
const DatabasesInspector = () => {
  const [selectedDb, setSelectedDb] = useState('PostgreSQL');
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [activeStage, setActiveStage] = useState('DATABASE');

  const dbInfo = {
    PostgreSQL: {
      type: 'Relational / Structured Data',
      query: `SELECT * FROM projects WHERE status = 'active';`,
      note: 'Strict schemas, ACID compliance, complex JOINs & JSONB support.',
    },
    MySQL: {
      type: 'Relational / High-Performance Reads',
      query: `SELECT id, name, status FROM projects WHERE status = 'active';`,
      note: 'Optimized read pipelines, index acceleration, InnoDB storage.',
    },
    MongoDB: {
      type: 'Document-Oriented Data',
      query: `db.projects.find({ status: "active" });`,
      note: 'Flexible BSON documents, dynamic schema scaling & aggregation pipelines.',
    },
  };

  const currentDb = dbInfo[selectedDb];

  const handleExecuteQuery = () => {
    setIsExecuting(true);
    setActiveStage('ORM');

    setTimeout(() => {
      setActiveStage('DATABASE');
    }, 400);

    setTimeout(() => {
      setActiveStage('RESULT');
    }, 800);

    setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
    }, 1200);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <span>DATA FLOW & QUERY INSPECTOR</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect database engine behavior & query execution flow.
        </p>
      </div>

      {/* Database Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['PostgreSQL', 'MySQL', 'MongoDB'].map((db) => (
          <button
            key={db}
            onClick={() => {
              setSelectedDb(db);
              setHasExecuted(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              selectedDb === db
                ? 'bg-amber-400/15 border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                : 'bg-[#071113] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            [ {db} ]
          </button>
        ))}
      </div>

      {/* Engine Architecture Note */}
      <div className="bg-[#071113] border border-slate-800 p-3 rounded-lg mb-4 text-xs">
        <span className="text-amber-400 font-bold">{selectedDb}</span>
        <span className="text-slate-400 ml-2">({currentDb.type}) — {currentDb.note}</span>
      </div>

      {/* Query Console Box */}
      <div className="bg-[#04090a] border border-slate-800 rounded-xl p-4 font-mono mb-4">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <span className="text-[10px] text-slate-500 font-semibold">[QUERY_CONSOLE]</span>
          <button
            onClick={handleExecuteQuery}
            disabled={isExecuting}
            className="bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-black border border-amber-400/40 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
          >
            {isExecuting ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
            <span>EXECUTE QUERY</span>
          </button>
        </div>
        <pre className="text-amber-300 text-xs font-mono">{currentDb.query}</pre>
      </div>

      {/* Result Table */}
      {hasExecuted ? (
        <div className="bg-[#071113] border border-slate-800 rounded-xl p-3 font-mono text-xs animate-fadeIn">
          <div className="text-[10px] text-slate-500 mb-2 font-bold">[EXECUTION_RESULT — 3 ROWS RETURNED]</div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-1.5">ID</th>
                <th className="pb-1.5">NAME</th>
                <th className="pb-1.5">STATUS</th>
                <th className="pb-1.5">ENGINE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="py-1.5 font-mono text-amber-400">01</td>
                <td className="py-1.5 font-bold">AssetFlow</td>
                <td className="py-1.5 text-[#00ff9d]">active</td>
                <td className="py-1.5 text-slate-400">{selectedDb}</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-amber-400">02</td>
                <td className="py-1.5 font-bold">PatentIQ</td>
                <td className="py-1.5 text-[#00ff9d]">active</td>
                <td className="py-1.5 text-slate-400">{selectedDb}</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-amber-400">03</td>
                <td className="py-1.5 font-bold">DevTinder</td>
                <td className="py-1.5 text-[#00ff9d]">active</td>
                <td className="py-1.5 text-slate-400">{selectedDb}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl font-mono">
          [Click "EXECUTE QUERY" to inspect data flow through the storage layer]
        </div>
      )}
    </div>
  );
};

export default SkillInspectionModal;
