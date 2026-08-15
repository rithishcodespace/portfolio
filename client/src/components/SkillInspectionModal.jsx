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
  Cloud,
  Wrench,
  BookOpen,
  RotateCcw,
  GitBranch,
  ShieldCheck,
  Activity,
  Bug,
  Terminal,
  Brain,
  Network,
} from 'lucide-react';
import { DistributedInspectorContent } from './DistributedSystemCard';

const SkillInspectionModal = ({ activeSkill, onClose }) => {
  // Lock body scroll ONLY while modal is active
  useEffect(() => {
    if (!activeSkill) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSkill, onClose]);

  if (!activeSkill) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0c1618] border border-[#00ff9d]/40 shadow-[0_0_35px_rgba(0,255,157,0.2)] rounded-xl max-w-2xl w-full font-mono text-slate-200 overflow-hidden flex flex-col my-auto relative animate-scaleUp max-h-[85vh] overflow-y-auto"
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
          {activeSkill.fileName === 'cloud.yml' && <CloudDevOpsInspector />}
          {activeSkill.fileName === 'distributed.proto' && <DistributedInspectorContent />}
          {activeSkill.fileName === 'developer.tools' && <DeveloperToolsInspector />}
          {activeSkill.fileName === 'cs-fundamentals.txt' && <CoreCSInspector />}
          {activeSkill.fileName === 'system-design.conf' && <SystemDesignInspector />}
          {activeSkill.fileName === 'ai-stack.conf' && <AIPipelineInspector />}
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
      codeSnippet: `interface User {\n  id: string;\n  role: 'admin' | 'dev';\n}\nconst authenticate = (u: User): boolean => u.role === 'admin';`,
    },
    Python: {
      role: 'AI / scripting / data processing',
      usedFor: ['AI applications', 'Automation', 'Data processing'],
      why: 'Fast prototyping, rich ML/AI ecosystem, expressive syntax.',
      codeSnippet: `import asyncio\nasync def process_embeddings(docs):\n    return await ai_engine.vectorize(docs)`,
    },
    'C++': {
      role: 'Problem solving / DSA',
      usedFor: ['Competitive programming', 'Algorithms', 'Performance-oriented code'],
      why: 'Uncompromising execution speed, explicit memory control, deep algorithmic foundation.',
      codeSnippet: `#include <vector>\nusing namespace std;\nint main() { vector<int> dp(100, 0); return 0; }`,
    },
    Java: {
      role: 'Backend / OOP',
      usedFor: ['Enterprise systems', 'Robust OOP design', 'Concurrent services'],
      why: 'Strict type safety, battle-tested JVM runtime, structured enterprise patterns.',
      codeSnippet: `@RestController\npublic class SystemController {\n  @GetMapping("/health")\n  public Status getStatus() { return Status.UP; }\n}`,
    },
    SQL: {
      role: 'Data persistence and querying',
      usedFor: ['Complex JOINs', 'Query optimization', 'Schema design & indexing'],
      why: 'Declarative data manipulation, ACID guarantees, relational consistency.',
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

      <div className="bg-[#071113] border border-slate-800 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((stage) => {
            const isSelected = activeStage === stage.id;
            const isAnimating = animatingStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[64px] relative ${
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

      <div className="bg-[#071113] border border-slate-800 p-3 rounded-lg mb-4 text-xs text-slate-300">
        <span className="text-fuchsia-400 font-bold mr-2">[{stage} STAGE]:</span>
        <span>{stagesInfo[stage]}</span>
      </div>

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
    setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
    }, 1000);
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

      <div className="bg-[#071113] border border-slate-800 p-3 rounded-lg mb-4 text-xs">
        <span className="text-amber-400 font-bold">{selectedDb}</span>
        <span className="text-slate-400 ml-2">({currentDb.type}) — {currentDb.note}</span>
      </div>

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

// =========================================================================
// 5. CLOUD & DEVOPS INSPECTOR (cloud.yml)
// =========================================================================
const CloudDevOpsInspector = () => {
  const pipelineStages = [
    { id: 'CODE', label: 'CODE' },
    { id: 'GIT', label: 'GIT PUSH' },
    { id: 'CICD', label: 'CI / CD' },
    { id: 'BUILD', label: 'BUILD' },
    { id: 'DOCKER', label: 'DOCKER' },
    { id: 'DEPLOY', label: 'DEPLOYMENT' },
    { id: 'RUNNING', label: 'RUNNING APP' },
    { id: 'MONITOR', label: 'MONITORING' },
  ];

  const [currentStep, setCurrentStep] = useState(7); // default 7 = healthy
  const [isDeploying, setIsDeploying] = useState(false);
  const [statusLog, setStatusLog] = useState('ALL SYSTEMS HEALTHY • PRODUCTION v2.4 ACTIVE');

  const handleDeploy = () => {
    setIsDeploying(true);
    setCurrentStep(0);
    setStatusLog('DEPLOYMENT STARTED: INITIATING GIT PUSH...');

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);

      if (step === 1) setStatusLog('GIT PUSH: SYNCING COMMITS TO MAIN...');
      if (step === 2) setStatusLog('CI/CD PIPELINE: RUNNING INTEGRATION SUITE...');
      if (step === 3) setStatusLog('BUILD: COMPILING BUNDLES & ASSETS...');
      if (step === 4) setStatusLog('DOCKER: BUILDING MULTI-STAGE IMAGE...');
      if (step === 5) setStatusLog('DEPLOYMENT: KUBERNETES ROLLING UPDATE IN PROGRESS...');
      if (step === 6) setStatusLog('RUNNING APP: HEALTH CHECKS PASSED (200 OK)...');
      if (step === 7) {
        setStatusLog('ALL SYSTEMS HEALTHY • PRODUCTION DEPLOYMENT COMPLETE');
        setIsDeploying(false);
        clearInterval(interval);
      }
    }, 500);
  };

  const handleRollback = () => {
    setIsDeploying(false);
    setCurrentStep(7);
    setStatusLog('ROLLBACK COMPLETED: REVERTED TO LAST STABLE REVISION (v2.3.9)');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-400" />
            <span>CI/CD & DEPLOYMENT PIPELINE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate live container build, deployment, and status rollback.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="bg-blue-500/15 hover:bg-blue-500 text-blue-400 hover:text-black border border-blue-500/40 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeploying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>DEPLOY</span>
          </button>
          <button
            onClick={handleRollback}
            disabled={isDeploying}
            className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black border border-rose-500/40 px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ROLLBACK</span>
          </button>
        </div>
      </div>

      {/* Pipeline Status Banner */}
      <div className="bg-[#071113] border border-blue-500/30 p-2.5 rounded-lg mb-4 text-xs font-mono flex items-center justify-between text-blue-300">
        <span className="truncate">{statusLog}</span>
        <span className="text-[10px] text-slate-500 shrink-0 font-semibold">[PIPELINE_STATUS]</span>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="bg-[#040a0c] border border-slate-800 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {pipelineStages.map((stg, i) => {
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep && isDeploying;

            return (
              <div
                key={stg.id}
                className={`p-2.5 rounded-lg border text-center font-mono transition-all relative ${
                  isCurrent
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)] animate-pulse'
                    : isActive
                    ? 'bg-[#081518] border-[#00ff9d]/40 text-[#00ff9d]'
                    : 'bg-[#040708] border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-bold mb-1">{stg.label}</div>
                <div className="text-[9px] font-semibold">
                  {isActive ? (isCurrent ? 'IN PROGRESS' : '[✓] PASSED') : '[PENDING]'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pipeline Status Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
        <div className="bg-[#071113] border border-slate-800 p-2 rounded text-center text-slate-300">
          <span className="text-[#00ff9d] font-bold">[✓]</span> SOURCE
        </div>
        <div className="bg-[#071113] border border-slate-800 p-2 rounded text-center text-slate-300">
          <span className="text-[#00ff9d] font-bold">[✓]</span> BUILD
        </div>
        <div className="bg-[#071113] border border-slate-800 p-2 rounded text-center text-slate-300">
          <span className="text-[#00ff9d] font-bold">[✓]</span> CONTAINER
        </div>
        <div className="bg-[#071113] border border-slate-800 p-2 rounded text-center text-slate-300">
          <span className="text-[#00ff9d] font-bold">[✓]</span> DEPLOY
        </div>
        <div className="bg-[#071113] border border-slate-800 p-2 rounded text-center text-[#00ff9d] font-bold">
          [●] HEALTHY
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 7. DEVELOPER TOOLS WORKFLOW INSPECTOR (developer.tools)
// =========================================================================
const DeveloperToolsInspector = () => {
  const [selectedStage, setSelectedStage] = useState('DEBUG');

  const workflowData = {
    PLAN: {
      title: 'REQUIREMENTS & SYSTEM ARCHITECTURE',
      steps: ['01 REQUIREMENTS', '02 ARCHITECTURE', '03 API SPEC', '04 TASK BREAKDOWN'],
      note: 'Defining clean interfaces, database schemas, and clear milestone tasks before writing code.',
    },
    CODE: {
      title: 'MODULAR & TYPE-SAFE DEVELOPMENT',
      steps: ['01 CLEAN APIS', '02 MODULAR DESIGN', '03 TYPE-SAFETY', '04 PR REVIEW'],
      note: 'Writing self-documenting code with TypeScript strict mode, clean abstractions, and peer review.',
    },
    TEST: {
      title: 'AUTOMATED TESTING & QUALITY ASSURANCE',
      steps: ['01 UNIT TESTS', '02 INTEGRATION', '03 API TESTS', '04 EDGE CASES'],
      note: 'Comprehensive test suites ensuring reliability across happy paths and boundary edge cases.',
    },
    DEBUG: {
      title: 'ROOT CAUSE ANALYSIS & DIAGNOSTICS',
      steps: ['01 REPRODUCE', '02 TRACE', '03 ISOLATE', '04 UNDERSTAND', '05 FIX', '06 VERIFY'],
      note: 'Systematic debugging workflow: reproducing state, analyzing stack traces, isolating variables, and verifying resolution.',
    },
    COMMIT: {
      title: 'VERSION CONTROL & REVISION LOGS',
      steps: ['01 STAGE CHANGES', '02 PEER REVIEW', '03 COMMIT MSG', '04 PUSH TO MAIN'],
      note: 'Atomic git commits with clear semantic messages (conventional commits specification).',
    },
    BUILD: {
      title: 'OPTIMIZATION & BUNDLING',
      steps: ['01 TREE SHAKING', '02 MINIFICATION', '03 CHUNK SPLIT', '04 ASSET OPTIM'],
      note: 'Building production assets with zero redundant dependencies and optimal load times.',
    },
    DEPLOY: {
      title: 'CONTINUOUS INTEGRATION & RELEASE',
      steps: ['01 CONTAINERIZE', '02 CI PIPELINE', '03 HEALTH CHECK', '04 RELEASE LIVE'],
      note: 'Automated container releases monitored via continuous health metrics.',
    },
  };

  const current = workflowData[selectedStage];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-400" />
          <span>ENGINEERING WORKFLOW EXPLORER</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select a lifecycle stage to inspect my actual engineering workflow & principles.
        </p>
      </div>

      {/* Stage Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {Object.keys(workflowData).map((stg) => (
          <button
            key={stg}
            onClick={() => setSelectedStage(stg)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              selectedStage === stg
                ? 'bg-orange-400/15 border-orange-400 text-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.2)]'
                : 'bg-[#071113] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            [ {stg} ]
          </button>
        ))}
      </div>

      {/* Stage Detail Visualizer */}
      <div className="bg-[#071113] border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="text-xs font-bold text-orange-400 mb-1">{current.title}</div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">{current.note}</p>

        {/* Step Flow Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {current.steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#040a0c] border border-slate-800 p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 text-slate-200"
            >
              <span className="text-orange-400 font-bold">→</span>
              <span className="truncate">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 8. CORE CS CONCEPT EXPLORER (cs-fundamentals.txt)
// =========================================================================
const CoreCSInspector = () => {
  const [selectedConcept, setSelectedConcept] = useState('MEMORY');

  const concepts = {
    MEMORY: {
      diagram: 'PROGRAM  →  VIRTUAL ADDRESS  →  MMU  →  PHYSICAL ADDRESS  →  RAM',
      title: 'VIRTUAL MEMORY & PAGED ADDRESS SPACE',
      explain:
        'Translates virtual memory addresses into physical RAM pages via the Memory Management Unit (MMU) & page tables, isolating process memory spaces and preventing memory corruption.',
    },
    PROCESS: {
      diagram: 'PROGRAM  →  PROCESS  (PID • MEMORY • FILE DESCRIPTORS • CPU STATE)',
      title: 'PROCESS ISOLATION & CPU SCHEDULING',
      explain:
        'Operating system execution abstraction containing isolated virtual memory, file descriptor tables, context registers, and threads scheduled by the kernel scheduler.',
    },
    DATABASE: {
      diagram: 'APPLICATION  →  QUERY  →  TRANSACTION LOG  →  STORAGE ENGINE  →  RESULT',
      title: 'ACID TRANSACTIONS & STORAGE ENGINES',
      explain:
        'Guarantees Atomicity, Consistency, Isolation, and Durability across write transactions while leveraging B-Trees & WAL (Write-Ahead Logging) for index fast lookup.',
    },
    NETWORK: {
      diagram: 'CLIENT  →  DNS RESOLVER  →  TCP 3-WAY HANDSHAKE  →  TLS / HTTP  →  SERVER',
      title: 'SOCKET NETWORKING & PROTOCOL STACK',
      explain:
        'Resolves domain names via DNS, negotiates SYN-ACK TCP handshakes, establishes TLS socket encryption, and transmits application HTTP layer frames.',
    },
    ALGORITHM: {
      diagram: 'INPUT DATA  →  ALGORITHM (BIG-O EVALUATION)  →  OPTIMIZED OUTPUT',
      title: 'TIME & SPACE COMPLEXITY OPTIMIZATION',
      explain:
        'Step-by-step computational procedures evaluated by asymptotic time complexity O(N log N) and space bounds to guarantee efficient memory & execution scaling.',
    },
    SYSTEM: {
      diagram: 'CLIENT  →  LOAD BALANCER  →  STATELESS SERVICE  →  CACHE  →  DATABASE',
      title: 'DISTRIBUTED SYSTEM ARCHITECTURE',
      explain:
        'Architectural design prioritizing horizontal elasticity, load balancing, caching strategies (Redis), and failover redundancy for 99.99% system availability.',
    },
  };

  const current = concepts[selectedConcept];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <span>CORE CS CONCEPT EXPLORER</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select a fundamental computer science concept to inspect its underlying mechanism.
        </p>
      </div>

      {/* Concept Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(concepts).map((concept) => (
          <button
            key={concept}
            onClick={() => setSelectedConcept(concept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              selectedConcept === concept
                ? 'bg-teal-400/15 border-teal-400 text-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                : 'bg-[#071113] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            [ {concept} ]
          </button>
        ))}
      </div>

      {/* Visual Diagram & Concept Card */}
      <div className="bg-[#071113] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="text-xs font-bold text-teal-400">{current.title}</div>

        {/* Visual Flow Diagram */}
        <div className="bg-[#040a0c] border border-teal-500/30 rounded-lg p-3 text-xs font-mono text-teal-300 overflow-x-auto">
          <span className="text-[10px] text-slate-500 block mb-1 font-semibold">[MECHANISM_FLOW]</span>
          <pre className="whitespace-pre-wrap leading-relaxed">{current.diagram}</pre>
        </div>

        {/* Explanation */}
        <div>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider block mb-1">
            CORE PRINCIPLE
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">{current.explain}</p>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 9. SYSTEM DESIGN INSPECTOR (system-design.conf)
// =========================================================================
const SystemDesignInspector = () => {
  const [viewMode, setViewMode] = useState('HLD');
  const [selectedNode, setSelectedNode] = useState('CACHE');
  const [selectedLldConcept, setSelectedLldConcept] = useState('SOLID');

  const hldNodes = {
    CLIENT: {
      title: 'CLIENT LAYER',
      explain: 'Web browsers, mobile apps, or external API consumers initiating request payloads.',
    },
    LOAD_BALANCER: {
      title: 'LOAD BALANCER',
      explain: 'Distributes incoming network traffic across multiple backend instances for high availability and fault tolerance.',
    },
    SERVICES: {
      title: 'STATELESS SERVICES',
      explain: 'Stateless backend microservices processing business logic independently.',
    },
    CACHE: {
      title: 'MEMORY CACHE (REDIS)',
      explain: 'Reduce repeated database reads for frequently accessed data.',
    },
    DATABASE: {
      title: 'PERSISTENT DATABASE',
      explain: 'Persistent application state and transactional records.',
    },
    QUEUE: {
      title: 'MESSAGE QUEUE (BULLMQ)',
      explain: 'Decouple asynchronous work from request processing.',
    },
  };

  const lldConcepts = {
    INTERFACES: {
      title: 'INTERFACES & CONTRACTS',
      desc: 'Decouple contracts from implementations for testability, flexibility, and easy dependency injection.',
    },
    CLASSES: {
      title: 'CLASSES & ENCAPSULATION',
      desc: 'Encapsulate state and behavior within clear single-responsibility boundaries.',
    },
    SOLID: {
      title: 'SOLID PRINCIPLES',
      desc: 'Single responsibility, Open-closed, Liskov substitution, Interface segregation, and Dependency inversion.',
    },
    PATTERNS: {
      title: 'DESIGN PATTERNS',
      desc: 'Factory, Singleton, Repository, Strategy, and Observer patterns for structured code architecture.',
    },
    CONCERNS: {
      title: 'SEPARATION OF CONCERNS',
      desc: 'Keep routing, business logic, data access, and storage completely decoupled into clean layers.',
    },
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Network className="w-5 h-5 text-[#00ff9d]" />
          <span>SYSTEM DESIGN & ARCHITECTURE</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore High-Level System Architecture (HLD) vs Low-Level Component Design (LLD).
        </p>
      </div>

      {/* HLD / LLD Selector Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('HLD')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            viewMode === 'HLD'
              ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.2)]'
              : 'bg-[#071113] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          [ HLD — HIGH LEVEL ]
        </button>
        <button
          onClick={() => setViewMode('LLD')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            viewMode === 'LLD'
              ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.2)]'
              : 'bg-[#071113] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          [ LLD — LOW LEVEL ]
        </button>
      </div>

      {viewMode === 'HLD' ? (
        <div className="space-y-3">
          {/* HLD Architecture Diagram */}
          <div className="bg-[#040a0c] border border-slate-800 rounded-xl p-3.5 font-mono text-xs">
            <div className="text-[10px] text-slate-500 font-bold mb-2 flex items-center justify-between">
              <span>HIGH-LEVEL DISTRIBUTED ARCHITECTURE</span>
              <span className="text-[#00ff9d]">[CLICK COMPONENT]</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5 text-center">
              <button
                onClick={() => setSelectedNode('CLIENT')}
                className={`px-4 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                  selectedNode === 'CLIENT'
                    ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                    : 'bg-[#071113] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                CLIENT
              </button>
              <div className="text-slate-600 text-[10px]">↓</div>
              <button
                onClick={() => setSelectedNode('LOAD_BALANCER')}
                className={`px-4 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                  selectedNode === 'LOAD_BALANCER'
                    ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                    : 'bg-[#071113] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                LOAD BALANCER
              </button>
              <div className="text-slate-600 text-[10px]">↓</div>
              <button
                onClick={() => setSelectedNode('SERVICES')}
                className={`px-5 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                  selectedNode === 'SERVICES'
                    ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                    : 'bg-[#071113] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                SERVICE A &nbsp;&nbsp;|&nbsp;&nbsp; SERVICE B
              </button>
              <div className="text-slate-600 text-[10px]">↓</div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                <button
                  onClick={() => setSelectedNode('CACHE')}
                  className={`py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                    selectedNode === 'CACHE'
                      ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                      : 'bg-[#071113] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  CACHE
                </button>
                <button
                  onClick={() => setSelectedNode('DATABASE')}
                  className={`py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                    selectedNode === 'DATABASE'
                      ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                      : 'bg-[#071113] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  DATABASE
                </button>
              </div>
              <div className="text-slate-600 text-[10px]">↓</div>
              <button
                onClick={() => setSelectedNode('QUEUE')}
                className={`px-6 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                  selectedNode === 'QUEUE'
                    ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                    : 'bg-[#071113] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                QUEUE
              </button>
            </div>
          </div>

          {/* Node Explanation Box */}
          <div className="bg-[#071113] border border-slate-800 rounded-xl p-3.5">
            <div className="text-xs font-bold text-[#00ff9d] mb-1">
              {hldNodes[selectedNode].title}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "{hldNodes[selectedNode].explain}"
            </p>
          </div>
        </div>
      ) : (
        /* LLD View */
        <div className="space-y-3">
          <div className="bg-[#040a0c] border border-slate-800 rounded-xl p-3.5 font-mono text-xs">
            <div className="text-[10px] text-slate-500 font-bold mb-2.5 flex items-center justify-between">
              <span>COMPONENT LAYERING & FLOW</span>
              <span className="text-[#00ff9d]">[OBJECT ARCHITECTURE]</span>
            </div>

            {/* Compact Horizontal Component Chain */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-center text-xs">
              <span className="bg-[#071113] border border-slate-700 px-2.5 py-1 rounded text-slate-200 font-bold">
                Controller
              </span>
              <span className="text-slate-600 font-bold">→</span>
              <span className="bg-[#071113] border border-slate-700 px-2.5 py-1 rounded text-slate-200 font-bold">
                Service
              </span>
              <span className="text-slate-600 font-bold">→</span>
              <span className="bg-[#071113] border border-slate-700 px-2.5 py-1 rounded text-slate-200 font-bold">
                Repository
              </span>
              <span className="text-slate-600 font-bold">→</span>
              <span className="bg-[#071113] border border-slate-700 px-2.5 py-1 rounded text-slate-200 font-bold">
                Database
              </span>
            </div>
          </div>

          <div className="bg-[#071113] border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="text-xs font-bold text-[#00ff9d] flex items-center justify-between">
              <span>[LOW-LEVEL DESIGN CONCEPTS]</span>
              <span className="text-[10px] text-slate-500 font-normal">[CLICK CONCEPT]</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {Object.keys(lldConcepts).map((key) => {
                const isSelected = selectedLldConcept === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedLldConcept(key)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.2)]'
                        : 'bg-[#040a0c] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#040a0c] border border-slate-800 p-3 rounded-lg text-xs">
              <div className="font-bold text-[#00ff9d] mb-1">
                {lldConcepts[selectedLldConcept].title}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "{lldConcepts[selectedLldConcept].desc}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 10. AI PIPELINE INSPECTOR (ai-stack.conf)
// =========================================================================
const AIPipelineInspector = () => {
  const [selectedNode, setSelectedNode] = useState('RAG');

  const nodeInfo = {
    USER: {
      title: 'USER PROMPT',
      desc: 'User submits a question or context query to the application.',
    },
    APP: {
      title: 'APPLICATION LAYER',
      desc: 'Orchestrates LLM requests, manages rate limits and token windows.',
    },
    LLM: {
      title: 'LARGE LANGUAGE MODEL (LLM)',
      desc: 'Process context-augmented prompts and generate structured, natural language output.',
    },
    RAG: {
      title: 'RETRIEVAL-AUGMENTED GENERATION (RAG)',
      desc: 'Retrieve relevant information first, then provide it as context to the model.',
    },
    KNOWLEDGE: {
      title: 'KNOWLEDGE BASE',
      desc: 'Store unstructured domain documents and reference text data.',
    },
    EMBEDDINGS: {
      title: 'EMBEDDINGS',
      desc: 'Represent text as vectors so semantic similarity can be measured.',
    },
    VECTOR_SEARCH: {
      title: 'VECTOR SEARCH',
      desc: 'Find semantically similar information using embeddings.',
    },
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Brain className="w-5 h-5 text-rose-400" />
          <span>AI & LLM APPLICATION PIPELINE</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Interactive workflow showing how modern RAG & Vector Search applications execute.
        </p>
      </div>

      <div className="bg-[#040a0c] border border-slate-800 rounded-xl p-4 font-mono text-xs mb-4">
        <div className="text-[10px] text-slate-500 font-bold mb-3 flex items-center justify-between">
          <span>AI PIPELINE ARCHITECTURE</span>
          <span className="text-rose-400">[CLICK PIPELINE STAGE]</span>
        </div>

        <div className="flex flex-col items-center space-y-2 text-center max-w-sm mx-auto">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setSelectedNode('USER')}
              className={`px-3 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                selectedNode === 'USER'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-[#071113] border-slate-800 text-slate-300'
              }`}
            >
              USER
            </button>
            <span className="text-slate-600">→</span>
            <button
              onClick={() => setSelectedNode('APP')}
              className={`px-3 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                selectedNode === 'APP'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-[#071113] border-slate-800 text-slate-300'
              }`}
            >
              APPLICATION
            </button>
          </div>

          <div className="text-slate-600 text-xs">↓</div>

          <button
            onClick={() => setSelectedNode('LLM')}
            className={`px-6 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
              selectedNode === 'LLM'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-[#071113] border-slate-800 text-slate-300'
            }`}
          >
            LLM ENGINE
          </button>

          <div className="text-slate-600 text-xs">↓</div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={() => setSelectedNode('RAG')}
              className={`py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                selectedNode === 'RAG'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-[#071113] border-slate-800 text-slate-300'
              }`}
            >
              RAG
            </button>
            <button
              onClick={() => setSelectedNode('KNOWLEDGE')}
              className={`py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                selectedNode === 'KNOWLEDGE'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-[#071113] border-slate-800 text-slate-300'
              }`}
            >
              KNOWLEDGE BASE
            </button>
          </div>

          <div className="text-slate-600 text-xs">↓</div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={() => setSelectedNode('EMBEDDINGS')}
              className={`py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                selectedNode === 'EMBEDDINGS'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-[#071113] border-slate-800 text-slate-300'
              }`}
            >
              EMBEDDINGS
            </button>
            <button
              onClick={() => setSelectedNode('VECTOR_SEARCH')}
              className={`py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                selectedNode === 'VECTOR_SEARCH'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-[#071113] border-slate-800 text-slate-300'
              }`}
            >
              VECTOR SEARCH
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#071113] border border-slate-800 rounded-xl p-4">
        <div className="text-xs font-bold text-rose-400 mb-1">
          {nodeInfo[selectedNode].title}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          "{nodeInfo[selectedNode].desc}"
        </p>
      </div>
    </div>
  );
};

export default SkillInspectionModal;
