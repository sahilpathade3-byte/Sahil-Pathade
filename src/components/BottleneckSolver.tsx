import React from "react";
import { BottleneckAnalysisResponse } from "../types";
import { FAMOUS_BOTTLENECKS } from "../data/mockData";
import { Sparkles, Send, AlertTriangle, CheckCircle2, ShieldAlert, Cpu, ArrowRight, RefreshCw, Layers } from "lucide-react";

export const BottleneckSolver: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = React.useState<number | null>(0);
  const [location, setLocation] = React.useState<string>(FAMOUS_BOTTLENECKS[0].name);
  const [corridorType, setCorridorType] = React.useState<string>(FAMOUS_BOTTLENECKS[0].corridorType);
  const [currentWaitMinutes, setCurrentWaitMinutes] = React.useState<number>(FAMOUS_BOTTLENECKS[0].currentWaitMinutes);
  const [dailyVehicles, setDailyVehicles] = React.useState<number>(FAMOUS_BOTTLENECKS[0].dailyVehicles);
  const [description, setDescription] = React.useState<string>(FAMOUS_BOTTLENECKS[0].description);
  const [weatherOrEvent, setWeatherOrEvent] = React.useState<string>(FAMOUS_BOTTLENECKS[0].weatherOrEvent);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [analysis, setAnalysis] = React.useState<BottleneckAnalysisResponse | null>(null);
  const [isSimulatedResponse, setIsSimulatedResponse] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Auto-load first preset analysis on mount
  React.useEffect(() => {
    handleAnalyze();
  }, []);

  const handlePresetSelect = (index: number) => {
    const preset = FAMOUS_BOTTLENECKS[index];
    setSelectedPreset(index);
    setLocation(preset.name);
    setCorridorType(preset.corridorType);
    setCurrentWaitMinutes(preset.currentWaitMinutes);
    setDailyVehicles(preset.dailyVehicles);
    setDescription(preset.description);
    setWeatherOrEvent(preset.weatherOrEvent);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze-bottleneck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          corridorType,
          currentWaitMinutes,
          dailyVehicles,
          description,
          weatherOrEvent
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setAnalysis(data.data);
        setIsSimulatedResponse(data.isSimulated);
      } else {
        setError(data.error || "Failed to analyze bottleneck.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while calling AI engineering server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header - Bento Card */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>GEMINI 2.5 FLASH TRAFFIC CONSULTANT</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            GenAI Urban Bottleneck Engineering & Mitigation Solver
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Input a notorious city traffic bottleneck or select a world preset. Our AI engineer analyzes root weaving conflicts and prescribes an actuated V2X Green Wave plan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Presets & Custom Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Famous World Bottlenecks Selector - Bento Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden border-t-4 border-t-emerald-500">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2 relative z-10">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span>Select World Bottleneck Benchmark</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10">
              {FAMOUS_BOTTLENECKS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(idx)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    selectedPreset === idx
                      ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200 shadow-inner"
                  }`}
                >
                  <div className="text-xs font-bold font-sans truncate">{preset.name.split(" (")[0]}</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5">{preset.city}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Form - Bento Card */}
          <form onSubmit={handleAnalyze} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden border-t-4 border-t-cyan-500">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-sm font-bold text-white font-sans flex items-center justify-between border-b border-slate-800/80 pb-3 relative z-10">
              <span>Traffic Engineering Parameters</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 font-semibold">Custom Input</span>
            </h3>

            <div className="space-y-3.5 relative z-10">
              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold block mb-1">Intersection / Corridor Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => { setLocation(e.target.value); setSelectedPreset(null); }}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans shadow-inner transition-colors"
                  placeholder="e.g. Austin I-35 & 6th St downtown interchange"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 font-semibold block mb-1">Peak Wait Time (Min)</label>
                  <input
                    type="number"
                    value={currentWaitMinutes}
                    onChange={e => setCurrentWaitMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono shadow-inner transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 font-semibold block mb-1">Daily Vehicles</label>
                  <input
                    type="number"
                    value={dailyVehicles}
                    onChange={e => setDailyVehicles(Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono shadow-inner transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold block mb-1">Corridor Type</label>
                <input
                  type="text"
                  value={corridorType}
                  onChange={e => setCorridorType(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans shadow-inner transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold block mb-1">Observed Bottleneck Symptoms</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans shadow-inner transition-colors"
                  placeholder="Describe left turn queues, pedestrian conflicts, double parking..."
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 font-semibold block mb-1">Special Events / Weather</label>
                <input
                  type="text"
                  value={weatherOrEvent}
                  onChange={e => setWeatherOrEvent(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans shadow-inner transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-xl relative z-10 ${
                isLoading
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 active:scale-95"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Gemini Analyzing Bottleneck...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Generate AI Traffic Solution</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Gemini Analysis & Prescription */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="bg-rose-950/60 border border-rose-500/50 p-5 rounded-3xl text-rose-200 text-xs flex items-center space-x-3 shadow-lg">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Cpu className="w-7 h-7 text-emerald-400 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-white font-sans">Synthesizing Urban Traffic Engineering Model...</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-mono">
                Running reinforcement learning simulations across green wave velocities, calculating pedestrian scramble safety buffers, and estimating CO2 reductions...
              </p>
            </div>
          ) : analysis ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-6 relative overflow-hidden border-l-4 border-l-emerald-500">
              <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Title & Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      AI PRESCRIPTION
                    </span>
                    {isSimulatedResponse && (
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700">
                        SIMULATED FALLBACK
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white font-sans mt-2 tracking-tight">{analysis.title}</h2>
                </div>
                <div className="bg-slate-950/80 border border-slate-800/80 px-4 py-2.5 rounded-2xl text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end shadow-inner">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">AI Confidence</span>
                  <span className="text-xl font-extrabold font-mono text-emerald-400">{analysis.confidenceScore}%</span>
                </div>
              </div>

              {/* Executive Briefing Summary - Bento Card */}
              <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl space-y-2 relative z-10 shadow-inner">
                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Executive Briefing for City Council / DOT</span>
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-sans pt-1">{analysis.executiveSummary}</p>
              </div>

              {/* Root Causes */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Identified Engineering Root Causes
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {analysis.rootCauses.map((cause, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl flex items-start space-x-3 text-xs text-slate-300 shadow-sm">
                      <span className="w-6 h-6 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{cause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projected Economic & Environmental Impact Bento Grid */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Projected Annual Municipal ROI & Environmental Impact
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/40 p-4 rounded-2xl shadow-md">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Wait Reduction</span>
                    <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                      -{analysis.projectedImpact?.waitTimeReductionPct || 35}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Peak rush hours</span>
                  </div>

                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 p-4 rounded-2xl shadow-md">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">CO2 Eliminated</span>
                    <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
                      {analysis.projectedImpact?.co2TonsSavedAnnual || 1400} <span className="text-xs font-normal text-slate-400">tons</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Annual reduction</span>
                  </div>

                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/40 p-4 rounded-2xl shadow-md">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Speed Increase</span>
                    <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
                      +{analysis.projectedImpact?.averageSpeedIncreaseMph || 8.2} <span className="text-xs font-normal text-slate-400">MPH</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Green wave sync</span>
                  </div>

                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/40 p-4 rounded-2xl shadow-md">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Economic Value</span>
                    <div className="text-base font-extrabold font-sans text-purple-300 mt-1.5 leading-tight truncate">
                      {analysis.projectedImpact?.economicValueSavedUSD || "$4.2M/year"}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Time savings value</span>
                  </div>
                </div>
              </div>

              {/* Signal Optimization Plan - Bento Card */}
              <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl space-y-3.5 relative z-10 shadow-inner">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Recommended Actuated Signal Optimization Plan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                    <span className="text-slate-500 block">Cycle Length:</span>
                    <span className="text-white font-bold text-sm">{analysis.signalOptimizationPlan?.cycleLengthSeconds || 110} Seconds</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                    <span className="text-slate-500 block">Green Wave Velocity:</span>
                    <span className="text-emerald-400 font-bold text-sm">{analysis.signalOptimizationPlan?.greenWaveSpeedMph || 28} MPH Synchronized</span>
                  </div>
                  <div className="sm:col-span-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60">
                    <span className="text-slate-500 block mb-1">Split Phase Adjustments:</span>
                    <span className="text-slate-200 font-sans leading-relaxed">{analysis.signalOptimizationPlan?.splitPhaseAdjustments}</span>
                  </div>
                  <div className="sm:col-span-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60">
                    <span className="text-slate-500 block mb-1">Pedestrian Scramble Safety:</span>
                    <span className="text-slate-200 font-sans leading-relaxed">{analysis.signalOptimizationPlan?.pedestrianScrambleTime}</span>
                  </div>
                </div>
              </div>

              {/* Multi-Modal Interventions Timeline */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Phased Deployment Roadmap
                </h3>
                <div className="space-y-2.5">
                  {analysis.interventions.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <span className="text-sm font-bold text-white font-sans">{item.type}</span>
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                            {item.timeframe}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
