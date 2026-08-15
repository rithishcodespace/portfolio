import React, { useState, useEffect } from 'react';
import { Share2, RefreshCw, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

export const DistributedInspectorContent = () => {
  // Node health states: true = HEALTHY, false = FAILED
  const [nodeStates, setNodeStates] = useState({
    node1: true,
    node2: true,
    node3: true,
  });

  // Dynamic log message
  const [logMessage, setLogMessage] = useState('ALL NODES HEALTHY • LOAD BALANCED (100% CAPACITY)');

  // Packet animation step index (0 to 100)
  const [packetProgress, setPacketProgress] = useState(0);

  // Animated packet loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketProgress((prev) => (prev + 2) % 100);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  // Update status log message when nodes change
  useEffect(() => {
    const failedNodes = [];
    if (!nodeStates.node1) failedNodes.push('NODE 01');
    if (!nodeStates.node2) failedNodes.push('NODE 02');
    if (!nodeStates.node3) failedNodes.push('NODE 03');

    if (failedNodes.length === 0) {
      setLogMessage('ALL NODES HEALTHY • LOAD BALANCED (100% CAPACITY)');
    } else if (failedNodes.length === 3) {
      setLogMessage('CRITICAL: ALL WORKER NODES OFFLINE • 503 SERVICE UNINTERRUPTIBLE');
    } else {
      const healthy = Object.keys(nodeStates).filter((k) => nodeStates[k]);
      const healthyNames = healthy
        .map((k) => (k === 'node1' ? 'NODE 01' : k === 'node2' ? 'NODE 02' : 'NODE 03'))
        .join(', ');
      setLogMessage(
        `FAILOVER ACTIVE: ${failedNodes.join(', ')} FAILED → TRAFFIC REROUTED TO ${healthyNames}`
      );
    }
  }, [nodeStates]);

  const toggleNode = (nodeKey) => {
    setNodeStates((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey],
    }));
  };

  const simulateFailure = () => {
    if (nodeStates.node2) {
      setNodeStates((prev) => ({ ...prev, node2: false }));
    } else if (nodeStates.node1) {
      setNodeStates((prev) => ({ ...prev, node1: false }));
    } else if (nodeStates.node3) {
      setNodeStates((prev) => ({ ...prev, node3: false }));
    } else {
      resetSystem();
    }
  };

  const resetSystem = () => {
    setNodeStates({ node1: true, node2: true, node3: true });
  };

  return (
    <div className="font-mono flex flex-col justify-between select-none">
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-fuchsia-400" />
            <span>DISTRIBUTED SYSTEM TOPOLOGY INSPECTOR</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate worker node failures & inspect real-time failover traffic rerouting.
          </p>
        </div>

        {/* System Status Banner */}
        <div
          className={`p-2.5 rounded-lg border text-xs font-mono mb-3 flex items-center justify-between gap-2 transition-colors ${
            !nodeStates.node1 && !nodeStates.node2 && !nodeStates.node3
              ? 'bg-[#180a0c] border-rose-500/50 text-rose-300'
              : !nodeStates.node1 || !nodeStates.node2 || !nodeStates.node3
              ? 'bg-[#161208] border-amber-500/40 text-amber-300'
              : 'bg-[#081518] border-[#00ff9d]/30 text-[#00ff9d]'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {!nodeStates.node1 && !nodeStates.node2 && !nodeStates.node3 ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : !nodeStates.node1 || !nodeStates.node2 || !nodeStates.node3 ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#00ff9d] shrink-0" />
            )}
            <span className="truncate font-semibold text-[11px] sm:text-xs">{logMessage}</span>
          </div>
          <span className="text-[10px] opacity-70 shrink-0">[LIVE_METRICS]</span>
        </div>

        {/* Interactive Topology Canvas */}
        <div className="relative bg-[#071113] border border-slate-800/80 rounded-xl p-4 font-mono text-xs overflow-hidden">
          {/* CLIENT Header Component */}
          <div className="flex justify-center mb-1">
            <div className="bg-[#0c1a1d] border border-[#00e5ff]/50 px-4 py-1 rounded-md text-[#00e5ff] font-bold text-xs shadow-[0_0_10px_rgba(0,229,255,0.15)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping"></span>
              <span>CLIENT</span>
            </div>
          </div>

          {/* Connection Line: Client -> API Gateway */}
          <div className="flex justify-center h-4 relative">
            <div className="w-0.5 h-full bg-[#00e5ff]/40"></div>
            <div
              className="absolute w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]"
              style={{ top: `${packetProgress}%`, left: 'calc(50% - 4px)' }}
            ></div>
          </div>

          {/* API GATEWAY (Central Load Balancer Node) */}
          <div className="flex justify-center mb-1 relative z-10">
            <div className="bg-[#08171a] border border-[#00ff9d]/60 px-5 py-1.5 rounded-md text-[#00ff9d] font-bold text-xs shadow-[0_0_12px_rgba(0,255,157,0.15)]">
              API GATEWAY / LOAD BALANCER
            </div>
          </div>

          {/* SVG Load Balancing Bus Tree */}
          <div className="w-full h-10 relative">
            <svg className="w-full h-full" viewBox="0 0 300 40" preserveAspectRatio="none">
              <line x1="150" y1="0" x2="150" y2="15" stroke="rgba(0, 255, 157, 0.4)" strokeWidth="2" />
              <line x1="50" y1="15" x2="250" y2="15" stroke="rgba(0, 255, 157, 0.4)" strokeWidth="2" />

              <line
                x1="50"
                y1="15"
                x2="50"
                y2="40"
                stroke={nodeStates.node1 ? 'rgba(0, 255, 157, 0.5)' : 'rgba(244, 63, 94, 0.3)'}
                strokeWidth="2"
                strokeDasharray={nodeStates.node1 ? 'none' : '3 3'}
              />
              <line
                x1="150"
                y1="15"
                x2="150"
                y2="40"
                stroke={nodeStates.node2 ? 'rgba(0, 255, 157, 0.5)' : 'rgba(244, 63, 94, 0.3)'}
                strokeWidth="2"
                strokeDasharray={nodeStates.node2 ? 'none' : '3 3'}
              />
              <line
                x1="250"
                y1="15"
                x2="250"
                y2="40"
                stroke={nodeStates.node3 ? 'rgba(0, 255, 157, 0.5)' : 'rgba(244, 63, 94, 0.3)'}
                strokeWidth="2"
                strokeDasharray={nodeStates.node3 ? 'none' : '3 3'}
              />

              {nodeStates.node1 && (
                <circle
                  cx={packetProgress <= 50 ? 150 - (100 * packetProgress) / 50 : 50}
                  cy={packetProgress <= 50 ? 15 : 15 + ((40 - 15) * (packetProgress - 50)) / 50}
                  r="3.5"
                  fill="#00ff9d"
                  filter="drop-shadow(0px 0px 4px #00ff9d)"
                />
              )}
              {nodeStates.node2 && (
                <circle
                  cx="150"
                  cy={15 + ((40 - 15) * packetProgress) / 100}
                  r="3.5"
                  fill="#00ff9d"
                  filter="drop-shadow(0px 0px 4px #00ff9d)"
                />
              )}
              {nodeStates.node3 && (
                <circle
                  cx={packetProgress <= 50 ? 150 + (100 * packetProgress) / 50 : 250}
                  cy={packetProgress <= 50 ? 15 : 15 + ((40 - 15) * (packetProgress - 50)) / 50}
                  r="3.5"
                  fill="#00ff9d"
                  filter="drop-shadow(0px 0px 4px #00ff9d)"
                />
              )}
            </svg>
          </div>

          {/* Node Grid Layer */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 my-1">
            {['node1', 'node2', 'node3'].map((nodeKey, idx) => {
              const name = `NODE 0${idx + 1}`;
              const isHealthy = nodeStates[nodeKey];
              return (
                <div
                  key={nodeKey}
                  onClick={() => toggleNode(nodeKey)}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all duration-200 ${
                    isHealthy
                      ? 'bg-[#081518] border-[#00ff9d]/50 hover:border-[#00ff9d] text-slate-100 shadow-[0_0_10px_rgba(0,255,157,0.1)]'
                      : 'bg-[#180a0c] border-rose-500/60 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] opacity-80'
                  }`}
                >
                  <div className="font-bold text-[11px] sm:text-xs">{name}</div>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isHealthy ? 'bg-[#00ff9d] animate-pulse' : 'bg-rose-500'
                      }`}
                    ></span>
                    <span
                      className={`text-[10px] font-semibold ${
                        isHealthy ? 'text-[#00ff9d]' : 'text-rose-400'
                      }`}
                    >
                      {isHealthy ? 'HEALTHY' : 'FAILED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG Lower Bus */}
          <div className="w-full h-8 relative">
            <svg className="w-full h-full" viewBox="0 0 300 30" preserveAspectRatio="none">
              <line
                x1="50"
                y1="0"
                x2="50"
                y2="15"
                stroke={nodeStates.node1 ? 'rgba(0, 255, 157, 0.4)' : 'transparent'}
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="0"
                x2="150"
                y2="15"
                stroke={nodeStates.node2 ? 'rgba(0, 255, 157, 0.4)' : 'transparent'}
                strokeWidth="2"
              />
              <line
                x1="250"
                y1="0"
                x2="250"
                y2="15"
                stroke={nodeStates.node3 ? 'rgba(0, 255, 157, 0.4)' : 'transparent'}
                strokeWidth="2"
              />

              <line x1="50" y1="15" x2="250" y2="15" stroke="rgba(0, 255, 157, 0.3)" strokeWidth="2" />
              <line x1="75" y1="15" x2="75" y2="30" stroke="rgba(0, 255, 157, 0.4)" strokeWidth="2" />
              <line x1="225" y1="15" x2="225" y2="30" stroke="rgba(0, 255, 157, 0.4)" strokeWidth="2" />

              {nodeStates.node1 && (
                <circle cx="50" cy={(15 * packetProgress) / 100} r="3" fill="#00ff9d" />
              )}
              {nodeStates.node2 && (
                <circle cx="150" cy={(15 * packetProgress) / 100} r="3" fill="#00ff9d" />
              )}
              {nodeStates.node3 && (
                <circle cx="250" cy={(15 * packetProgress) / 100} r="3" fill="#00ff9d" />
              )}
            </svg>
          </div>

          {/* Bottom Cache & DB Layer */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-1">
            <div className="bg-[#081316] border border-amber-500/40 p-1.5 rounded text-center">
              <span className="text-amber-400 font-bold text-xs">REDIS CACHE</span>
            </div>
            <div className="bg-[#081316] border border-purple-500/40 p-1.5 rounded text-center">
              <span className="text-purple-300 font-bold text-xs">DATABASE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons Footer */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={simulateFailure}
            className="bg-[#180a0c] border border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-black font-semibold text-[11px] px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SIMULATE FAILURE</span>
          </button>

          <button
            onClick={resetSystem}
            className="bg-[#081518] border border-[#00ff9d]/40 text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black font-semibold text-[11px] px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET SYSTEM</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-500 hidden sm:inline">
          [CLICK ANY NODE TO TOGGLE STATE]
        </span>
      </div>
    </div>
  );
};

const DistributedSystemCard = ({ cat, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="h-[340px] bg-[#0c1618] rounded-xl p-5 font-mono flex flex-col justify-between transition-all duration-300 border border-[#00ff9d] shadow-[0_0_22px_rgba(0,255,157,0.22)] bg-[#0e1a1d] hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(0,255,157,0.35)] active:scale-[0.98] cursor-pointer group select-none relative"
    >
      {/* Inspect System Pop-Up Badge */}
      <span className="absolute top-3 right-3 z-20 text-[10px] text-[#00ff9d] bg-[#040c0e] px-2 py-0.5 rounded-lg border border-[#00ff9d] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:scale-105 group-hover:bg-[#00ff9d] group-hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(0,255,157,0.4)] pointer-events-none">
        <span>INSPECT</span>
        <span className="text-xs">↗</span>
      </span>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Header dots & filename */}
        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-800/70 text-xs text-slate-400 overflow-hidden shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shrink-0"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shrink-0"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shrink-0"></span>
          <span className="ml-1 text-slate-300 font-medium text-xs tracking-tight truncate">
            {cat.fileName}
          </span>
        </div>

        {/* Category Icon & Title */}
        <div className="flex items-center gap-2.5 mb-2.5 shrink-0">
          <Share2 className="w-5 h-5 text-fuchsia-400 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight truncate">
            {cat.title}
          </h3>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 my-1">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            {cat.items}
          </p>
        </div>
      </div>

      {/* Status footer pill */}
      <div className="pt-2.5 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
        <span>[READY]</span>
        <span className="text-[#00ff9d] font-semibold">v1.0</span>
      </div>
    </div>
  );
};

export default DistributedSystemCard;
