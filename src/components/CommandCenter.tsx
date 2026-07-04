import React from "react";
import { GridScenario, Intersection } from "../types";
import { CITY_GRID_SCENARIOS } from "../data/mockData";
import { Activity, Car, Cpu, Flame, Play, ShieldAlert, Sparkles, Zap, Navigation, Clock, CheckCircle2 } from "lucide-react";

interface CommandCenterProps {
  adaptiveMode: boolean;
  emergencyOverride: boolean;
  onSelectIntersection: (intersection: Intersection) => void;
  intersections: Intersection[];
  setIntersections: React.Dispatch<React.SetStateAction<Intersection[]>>;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  adaptiveMode,
  emergencyOverride,
  onSelectIntersection,
  intersections,
  setIntersections
}) => {
  const [selectedScenario, setSelectedScenario] = React.useState<GridScenario>(CITY_GRID_SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = React.useState<boolean>(true);
  const [stadiumSurgeActive, setStadiumSurgeActive] = React.useState<boolean>(false);

  // Handle scenario switch
  const handleScenarioChange = (scenario: GridScenario) => {
    setSelectedScenario(scenario);
    setIntersections(scenario.intersections);
    setStadiumSurgeActive(scenario.id === "stadium-surge");
  };

  // High-frequency simulation loop
  React.useEffect(() => {
    if (!isSimulating) return;

    const timer = setInterval(() => {
      setIntersections(prev =>
        prev.map((int, i) => {
          let timer = int.phaseTimer - 1;
          let phase = int.currentPhase;
          let nsQueue = int.nsQueue;
          let ewQueue = int.ewQueue;
          let nsSpeed = int.nsSpeed;
          let ewSpeed = int.ewSpeed;

          // Emergency Override takes priority
          if (emergencyOverride) {
            return {
              ...int,
              currentPhase: "EMERGENCY_OVERRIDE",
              phaseTimer: 30,
              nsQueue: Math.max(0, nsQueue - 3),
              ewQueue: Math.max(0, ewQueue - 3),
              nsSpeed: 38,
              ewSpeed: 35,
              status: "EMERGENCY_CLEARING"
            };
          }

          // When timer hits 0, rotate phase
          if (timer <= 0) {
            if (phase === "GREEN_NS") {
              phase = "YELLOW_NS";
              timer = 4;
            } else if (phase === "YELLOW_NS") {
              phase = "RED_ALL";
              timer = 2;
            } else if (phase === "RED_ALL") {
              phase = i % 2 === 0 ? "GREEN_EW" : "GREEN_NS";
              timer = adaptiveMode ? 42 : 30; // Adaptive green wave gives longer green time
            } else if (phase === "GREEN_EW") {
              phase = "YELLOW_EW";
              timer = 4;
            } else if (phase === "YELLOW_EW") {
              phase = "GREEN_NS";
              timer = adaptiveMode ? 38 : 28;
            } else {
              phase = "GREEN_NS";
              timer = 30;
            }
          }

          // Simulate vehicle arrival and clearing
          const arrivalRate = stadiumSurgeActive ? 3 : 1;
          if (phase === "GREEN_NS" || phase === "EMERGENCY_OVERRIDE") {
            nsQueue = Math.max(0, nsQueue - (adaptiveMode ? 4 : 2));
            ewQueue = ewQueue + Math.floor(Math.random() * 2 * arrivalRate);
            nsSpeed = Math.min(35, nsSpeed + 2);
          } else if (phase === "GREEN_EW") {
            ewQueue = Math.max(0, ewQueue - (adaptiveMode ? 4 : 2));
            nsQueue = nsQueue + Math.floor(Math.random() * 2 * arrivalRate);
            ewSpeed = Math.min(32, ewSpeed + 2);
          } else {
            nsQueue = nsQueue + Math.floor(Math.random() * 2 * arrivalRate);
            ewQueue = ewQueue + Math.floor(Math.random() * 2 * arrivalRate);
            nsSpeed = Math.max(4, nsSpeed - 2);
            ewSpeed = Math.max(4, ewSpeed - 2);
          }

          // Calculate AI confidence and status
          const totalQueue = nsQueue + ewQueue;
          let status = int.status;
          if (totalQueue > 50) status = "CRITICAL_BOTTLENECK";
          else if (totalQueue > 30) status = "CONGESTED";
          else status = "OPTIMAL";

          return {
            ...int,
            currentPhase: phase,
            phaseTimer: timer,
            nsQueue,
            ewQueue,
            nsSpeed,
            ewSpeed,
            status,
            aiConfidence: Math.min(99, Math.max(88, adaptiveMode ? int.aiConfidence + 1 : int.aiConfidence))
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [isSimulating, adaptiveMode, emergencyOverride, stadiumSurgeActive, setIntersections]);

  // Aggregate metrics
  const totalQueue = intersections.reduce((acc, int) => acc + int.nsQueue + int.ewQueue, 0);
  const avgSpeed = Math.round(
    intersections.reduce((acc, int) => acc + (int.nsSpeed + int.ewSpeed) / 2, 0) / (intersections.length || 1)
  );
  const totalCo2 = Math.round(
    intersections.reduce((acc, int) => acc + int.co2RateKgHr, 0) * (adaptiveMode ? 0.72 : 1.0)
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar - Bento Header Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 relative z-10">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider whitespace-nowrap">City Grid Scenario:</span>
          <div className="flex space-x-2">
            {CITY_GRID_SCENARIOS.map(scen => (
              <button
                key={scen.id}
                onClick={() => handleScenarioChange(scen)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm ${
                  selectedScenario.id === scen.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80 hover:border-slate-600 shadow-inner"
                }`}
              >
                {scen.name.split(" (")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end relative z-10">
          {/* Stadium Surge Button */}
          <button
            onClick={() => setStadiumSurgeActive(!stadiumSurgeActive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              stadiumSurgeActive
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-400"
                : "bg-slate-800/80 text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 shadow-inner"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{stadiumSurgeActive ? "SURGE ACTIVE (+300% VOL)" : "Trigger Stadium Surge"}</span>
          </button>

          {/* Pause/Play Simulation */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-inner"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
            <span>{isSimulating ? "Simulating Live" : "Paused"}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Telemetry Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] border-l-4 border-l-emerald-500">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-mono uppercase tracking-wider">Average Grid Velocity</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {avgSpeed} <span className="text-sm font-normal text-slate-400">MPH</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-3 flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800/80 px-2.5 py-1 rounded-xl w-fit">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{adaptiveMode ? "+28% speed vs static timer" : "Static Timer Baseline"}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] border-l-4 border-l-cyan-500">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-mono uppercase tracking-wider">Total Waiting Vehicles</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {totalQueue} <span className="text-sm font-normal text-slate-400">cars</span>
            </div>
            <div className={`text-[11px] mt-3 font-mono px-2.5 py-1 rounded-xl border w-fit ${
              totalQueue > 120 
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30" 
                : "bg-slate-950/60 text-cyan-400 border-slate-800/80"
            }`}>
              {totalQueue > 120 ? "⚠️ Heavy Spillback Risk" : "⚡ Flowing Smoothly"}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] border-l-4 border-l-amber-500">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-mono uppercase tracking-wider">Grid CO2 Emission Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {totalCo2} <span className="text-sm font-normal text-slate-400">kg/hr</span>
            </div>
            <div className="text-[11px] text-amber-400 mt-3 font-mono bg-slate-950/60 border border-slate-800/80 px-2.5 py-1 rounded-xl w-fit">
              {adaptiveMode ? "🌱 -28% GHG Avoided by AI" : "Unoptimized Idling Burn"}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] border-l-4 border-l-purple-500">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-mono uppercase tracking-wider">RL Engine Confidence</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-slate-200 bg-clip-text text-transparent">
              {adaptiveMode ? "97.4%" : "OFF"}
            </div>
            <div className="text-[11px] text-slate-400 mt-3 font-mono bg-slate-950/60 border border-slate-800/80 px-2.5 py-1 rounded-xl w-fit">
              {adaptiveMode ? "Deep Q-Learning Policy" : "Enable RL Green-Wave in Header"}
            </div>
          </div>
        </div>
      </div>

      {/* The Interactive Digital Twin 3x2 Bento Grid */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
                {selectedScenario.name}
              </h2>
              {stadiumSurgeActive && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold uppercase animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  Event Surge
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">{selectedScenario.description}</p>
          </div>
          <div className="text-xs font-mono text-cyan-300 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-2 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Click any intersection tile to view Live Edge Vision Radar & Override Actuation</span>
          </div>
        </div>

        {/* Bento Grid Map View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {intersections.map(int => {
            const isGreenNS = int.currentPhase === "GREEN_NS";
            const isGreenEW = int.currentPhase === "GREEN_EW";
            const isYellow = int.currentPhase.includes("YELLOW");
            const isEmergency = int.currentPhase === "EMERGENCY_OVERRIDE";
            const isCritical = int.status === "CRITICAL_BOTTLENECK";

            return (
              <div
                key={int.id}
                onClick={() => onSelectIntersection(int)}
                className={`bg-slate-900/80 border rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between group backdrop-blur-sm ${
                  isCritical
                    ? "border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.2)]"
                    : isEmergency
                    ? "border-purple-500/80 shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                    : "border-slate-800/80 hover:border-slate-700 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
                }`}
              >
                <div>
                  {/* Top Status line */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/80">{int.id}</span>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      {int.hasBusWaiting && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm">
                          BUS PRIORITY
                        </span>
                      )}
                      {int.hasEmergencyVehicle && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold animate-pulse flex items-center space-x-1 shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                          <ShieldAlert className="w-3 h-3" />
                          <span>AMBULANCE</span>
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider shadow-sm ${
                          isCritical
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                            : int.status === "CONGESTED"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        }`}
                      >
                        {int.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-sans mb-3 truncate group-hover:text-emerald-400 transition-colors">
                    {int.name}
                  </h3>

                  {/* Nested Bento Stat Sub-box */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-4 flex items-center justify-between relative overflow-hidden shadow-inner">
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono text-slate-300 flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isGreenNS ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-slate-600"}`} />
                        <span>N-S: <strong className="text-white">{int.nsQueue}</strong> cars ({int.nsSpeed} MPH)</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isGreenEW ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-slate-600"}`} />
                        <span>E-W: <strong className="text-white">{int.ewQueue}</strong> cars ({int.ewSpeed} MPH)</span>
                      </div>
                    </div>

                    {/* Signal Light Indicator Badge */}
                    <div className="flex flex-col items-center justify-center bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 shadow-sm min-w-[80px]">
                      <div
                        className={`text-[11px] font-mono font-bold tracking-tight text-center ${
                          isEmergency
                            ? "text-purple-400"
                            : isGreenNS || isGreenEW
                            ? "text-emerald-400"
                            : isYellow
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {int.currentPhase.replace("_", " ")}
                      </div>
                      <div className="text-sm font-extrabold text-white font-mono mt-0.5">{int.phaseTimer}s</div>
                    </div>
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">Pedestrians:</span>
                    <strong className="text-slate-300">{int.pedestrianCount}</strong>
                  </span>
                  <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    RL Conf: {int.aiConfidence}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
