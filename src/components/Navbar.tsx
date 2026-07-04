import React from "react";
import { TabType } from "../types";
import { Activity, Cpu, ShieldAlert, Sparkles, TrendingUp, Presentation, Radio, Clock } from "lucide-react";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAiConnected: boolean;
  adaptiveMode: boolean;
  setAdaptiveMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  emergencyOverride: boolean;
  setEmergencyOverride: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAiConnected,
  adaptiveMode,
  setAdaptiveMode,
  emergencyOverride,
  setEmergencyOverride
}) => {
  const [timeStr, setTimeStr] = React.useState<string>("");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: "command", label: "Digital Twin Grid", icon: <Radio className="w-4 h-4" /> },
    { id: "signallab", label: "RL Signal Lab", icon: <Cpu className="w-4 h-4" /> },
    { id: "bottleneck", label: "GenAI Bottleneck Solver", icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { id: "roi", label: "Municipal ROI & SaaS", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "pitch", label: "Startup GTM & Pitch", icon: <Presentation className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
      <header className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md flex flex-col gap-4 transition-all">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  NexFlow <span className="text-emerald-400">AI</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/30 text-[10px] font-semibold uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  v2.5-PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">Urban Congestion Control & V2X Edge OS</p>
            </div>
          </div>

          {/* Quick Controls & Status */}
          <div className="flex items-center flex-wrap gap-3">
            {/* Live UTC Clock */}
            <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl text-slate-300 text-xs font-mono shadow-inner">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>SIM TIME: {timeStr || "12:00:00"}</span>
            </div>

            {/* AI Engine Status */}
            <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl shadow-inner">
              <div className={`w-2 h-2 rounded-full ${isAiConnected ? "bg-emerald-400 animate-ping" : "bg-teal-500"}`} />
              <span className="text-xs font-mono text-slate-300">
                {isAiConnected ? "GEMINI 2.5 FLASH CONNECTED" : "EDGE RL SIM ENGINE ACTIVE"}
              </span>
            </div>

            {/* AI Adaptive Toggle */}
            <button
              onClick={() => setAdaptiveMode(p => !p)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                adaptiveMode
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 shadow-inner"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>RL Green-Wave: {adaptiveMode ? "ACTIVE" : "OFF"}</span>
            </button>

            {/* Emergency V2X Override */}
            <button
              onClick={() => setEmergencyOverride(!emergencyOverride)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                emergencyOverride
                  ? "bg-gradient-to-r from-rose-600 to-red-500 text-white animate-bounce shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-rose-500"
                  : "bg-slate-800 text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 shadow-inner"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{emergencyOverride ? "EMERGENCY V2X ACTIVE" : "EMERGENCY OVERRIDE"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 overflow-x-auto pt-3 border-t border-slate-800/80 scrollbar-none">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] font-semibold"
                    : "bg-slate-800/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700 shadow-inner"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>
    </div>
  );
};
