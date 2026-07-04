import React from "react";
import { Intersection, OptimizationResult } from "../types";
import { PERFORMANCE_CHARTS_24H } from "../data/mockData";
import { Cpu, Zap, Activity, CheckCircle, Sliders, TrendingUp, BarChart2, ShieldAlert, Award } from "lucide-react";
import confetti from "canvas-confetti";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

interface SignalLabProps {
  intersections: Intersection[];
  adaptiveMode: boolean;
  setAdaptiveMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const SignalLab: React.FC<SignalLabProps> = ({ intersections, adaptiveMode, setAdaptiveMode }) => {
  const [aiAggressiveness, setAiAggressiveness] = React.useState<number>(85);
  const [priorityMode, setPriorityMode] = React.useState<string>("commuter");
  const [isOptimizing, setIsOptimizing] = React.useState<boolean>(false);
  const [optimizationResults, setOptimizationResults] = React.useState<OptimizationResult[] | null>(null);
  const [efficiencyScore, setEfficiencyScore] = React.useState<number>(82);

  const runOptimization = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch("/api/optimize-corridor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intersections,
          aiAggressiveness,
          priorityMode
        })
      });

      const data = await response.json();
      if (data && data.success) {
        setOptimizationResults(data.optimizations);
        setEfficiencyScore(data.systemEfficiencyScore || 95);
        if (!adaptiveMode) setAdaptiveMode(true);

        // Celebrate high efficiency!
        if (data.systemEfficiencyScore >= 90) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore if canvas-confetti fails in sandbox
          }
        }
      }
    } catch (err) {
      console.error("Optimization error:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner - Bento Card */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              RL SIMULATION LAB
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800/80">Deep Q-Learning Policy V2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            AI Reinforcement Learning Signal Actuation & Green Wave
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Tune objective weights for urban arterial corridors. Our reinforcement learning engine replaces legacy 15-minute time-of-day tables with cycle-by-cycle micro-adjustments.
          </p>
        </div>

        <button
          onClick={runOptimization}
          disabled={isOptimizing}
          className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center space-x-2.5 shadow-xl relative z-10 whitespace-nowrap ${
            isOptimizing
              ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 active:scale-95"
          }`}
        >
          {isOptimizing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span>Running 50,000 Sim Steps...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current text-emerald-200" />
              <span>Run RL Policy Optimization</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sliders & Settings - Bento Card */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-6 relative overflow-hidden border-t-4 border-t-emerald-500">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-base font-bold text-white font-sans flex items-center space-x-2 border-b border-slate-800/80 pb-3.5 relative z-10">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-emerald-400" />
            </div>
            <span>AI Objective Functions</span>
          </h2>

          {/* Priority Mode Selector */}
          <div className="space-y-2.5 relative z-10">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">Primary Traffic Objective</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "commuter", label: "Commuter Throughput", desc: "Max vehicles/hr" },
                { id: "transit", label: "Transit Priority", desc: "Bus green extension" },
                { id: "eco", label: "Eco-Harmonization", desc: "Min fuel/co2 burn" },
                { id: "pedestrian", label: "Pedestrian Safety", desc: "Max scramble buffer" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setPriorityMode(item.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    priorityMode === item.id
                      ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white shadow-inner"
                  }`}
                >
                  <div className="text-xs font-bold font-sans">{item.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Aggression Slider */}
          <div className="space-y-3 pt-2 relative z-10 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono uppercase tracking-wider text-slate-400 font-semibold">RL Adaptation Aggressiveness</span>
              <span className="font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">{aiAggressiveness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={aiAggressiveness}
              onChange={e => setAiAggressiveness(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Conservative (Smooth)</span>
              <span>Aggressive (Zero-Wait Flush)</span>
            </div>
          </div>

          {/* Live System Score Card */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 relative z-10 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">System Efficiency Score</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                GRADE A+
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">{efficiencyScore}</span>
              <span className="text-xs text-slate-400 font-mono">/ 100 max benchmark</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${efficiencyScore}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Based on simulated 4-intersection arterial sync. Outperforms standard actuated controllers by ~32%.
            </p>
          </div>
        </div>

        {/* Right Columns: Charts & Optimization Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section - Bento Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden border-l-4 border-l-cyan-500">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
              <div>
                <h3 className="text-base font-bold text-white font-sans flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span>24-Hour Corridor Velocity Benchmark (MPH)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Comparison between Legacy Siemens/Econolite static timers and NexFlow RL Actuated Control
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                +28.4% Average Speed
              </span>
            </div>

            <div className="h-64 w-full pt-4 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_CHARTS_24H} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNexFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorLegacy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" MPH" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem" }}
                    labelStyle={{ color: "#f8fafc", fontWeight: "bold" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Area
                    type="monotone"
                    name="NexFlow AI (RL Actuated)"
                    dataKey="nexFlowSpeed"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorNexFlow)"
                  />
                  <Area
                    type="monotone"
                    name="Legacy Static Timer"
                    dataKey="legacySpeed"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorLegacy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Optimization Results Table - Bento Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden border-l-4 border-l-purple-500">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
              <h3 className="text-base font-bold text-white font-sans flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <span>Optimized Intersection Split Matrix</span>
              </h3>
              {optimizationResults && (
                <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30">
                  ⚡ Generated at {new Date().toLocaleTimeString()}
                </span>
              )}
            </div>

            {optimizationResults ? (
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs">
                      <th className="py-3 px-3">Intersection</th>
                      <th className="py-3 px-3">N-S Green Split</th>
                      <th className="py-3 px-3">E-W Green Split</th>
                      <th className="py-3 px-3">Wait Reduction</th>
                      <th className="py-3 px-3">Daily CO2 Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                    {optimizationResults.map(opt => (
                      <tr key={opt.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white font-sans">{opt.name}</td>
                        <td className="py-3.5 px-3 text-emerald-400 font-bold bg-emerald-500/5 rounded-l-lg">{opt.greenSplit.northSouth}s</td>
                        <td className="py-3.5 px-3 text-amber-400 font-bold bg-amber-500/5">{opt.greenSplit.eastWest}s</td>
                        <td className="py-3.5 px-3 text-cyan-400 font-semibold">-{opt.metrics.delayReductionSeconds}s / vehicle</td>
                        <td className="py-3.5 px-3 text-slate-300">~{opt.metrics.estimatedCo2SavedKgDay} kg/day</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3 relative z-10 shadow-inner">
                <Cpu className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                <p className="text-sm font-semibold text-slate-300">No Custom Policy Generated Yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Adjust the AI objective sliders above and click <span className="text-emerald-400 font-mono">"Run RL Policy Optimization"</span> to calculate custom signal split tables.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
