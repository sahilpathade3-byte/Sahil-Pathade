import React from "react";
import { Intersection } from "../types";
import { X, Camera, ShieldCheck, Activity, Users, Car, Zap, RefreshCw } from "lucide-react";

interface IntersectionModalProps {
  intersection: Intersection | null;
  onClose: () => void;
  onOverridePhase: (id: string, newPhase: any) => void;
}

export const IntersectionModal: React.FC<IntersectionModalProps> = ({
  intersection,
  onClose,
  onOverridePhase
}) => {
  if (!intersection) return null;

  const getPhaseColor = (p: string) => {
    if (p.includes("GREEN")) return "bg-emerald-500 text-white";
    if (p.includes("YELLOW")) return "bg-amber-500 text-slate-900 font-bold";
    if (p === "RED_ALL") return "bg-rose-600 text-white";
    if (p === "TRANSIT_PRIORITY") return "bg-blue-600 text-white";
    if (p === "EMERGENCY_OVERRIDE") return "bg-purple-600 text-white animate-pulse";
    return "bg-slate-700 text-slate-200";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl backdrop-blur-xl relative">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="bg-slate-900/60 px-6 sm:px-8 py-5 border-b border-slate-800/80 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="text-lg font-bold text-white font-sans">{intersection.name}</h3>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-semibold">
                  {intersection.id}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">Edge Vision Controller #408 • NTCIP Compliant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10 max-h-[80vh] overflow-y-auto">
          {/* Simulated Edge Vision Camera Feed - Bento Card */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-800/80 aspect-video max-h-64 w-full flex items-center justify-center shadow-inner group">
            {/* Grid graphic simulation */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Crossroad animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-16 bg-slate-900/90 border-y border-slate-700/80 absolute flex items-center justify-between px-8 shadow-md">
                <div className="flex space-x-4">
                  {[...Array(Math.min(6, Math.max(1, Math.floor(intersection.ewQueue / 4))))].map((_, idx) => (
                    <div key={idx} className="w-6 h-3 bg-amber-400 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse" />
                  ))}
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">EAST-WEST ARTERIAL ({intersection.ewSpeed} MPH)</div>
              </div>
              <div className="h-full w-16 bg-slate-900/90 border-x border-slate-700/80 absolute flex flex-col items-center justify-between py-6 shadow-md">
                <div className="flex flex-col space-y-3">
                  {[...Array(Math.min(5, Math.max(1, Math.floor(intersection.nsQueue / 4))))].map((_, idx) => (
                    <div key={idx} className="w-3 h-5 bg-cyan-400 rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-pulse" />
                  ))}
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase -rotate-90">N-S ARTERIAL</div>
              </div>
              {/* Intersection Box */}
              <div className="w-16 h-16 bg-slate-800/90 border-2 border-dashed border-emerald-500/60 z-10 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span className="text-xs font-mono text-emerald-400 font-extrabold">{intersection.phaseTimer}s</span>
              </div>
            </div>

            {/* Overlay HUD */}
            <div className="absolute top-3 left-3 flex items-center space-x-2 bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800/80 text-xs font-mono text-emerald-400 shadow">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold">LIVE EDGE RADAR • 30 FPS • 0% LOSS</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 flex items-center space-x-3 shadow">
              <span>LAT: {intersection.lat}</span>
              <span>LNG: {intersection.lng}</span>
            </div>
          </div>

          {/* Telemetry Cards Grid - Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl shadow-inner transition-all hover:border-slate-700">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1.5">
                <span>North-South</span>
                <Car className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white tracking-tight">{intersection.nsQueue} <span className="text-xs text-slate-500 font-normal font-sans">veh</span></div>
              <div className="text-[11px] text-emerald-400 mt-1 font-mono">Avg: {intersection.nsSpeed} MPH</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl shadow-inner transition-all hover:border-slate-700">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1.5">
                <span>East-West</span>
                <Car className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white tracking-tight">{intersection.ewQueue} <span className="text-xs text-slate-500 font-normal font-sans">veh</span></div>
              <div className="text-[11px] text-amber-400 mt-1 font-mono">Avg: {intersection.ewSpeed} MPH</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl shadow-inner transition-all hover:border-slate-700">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1.5">
                <span>Pedestrian</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white tracking-tight">{intersection.pedestrianCount} <span className="text-xs text-slate-500 font-normal font-sans">wait</span></div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">Scramble: Safe</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl shadow-inner transition-all hover:border-slate-700">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1.5">
                <span>AI Confidence</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 tracking-tight">{intersection.aiConfidence}%</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">Q-Learning Optimal</div>
            </div>
          </div>

          {/* Manual Signal Override Section - Bento Tile */}
          <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-white font-sans">Actuated Phase Override & Manual Control</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold shadow ${getPhaseColor(intersection.currentPhase)}`}>
                CURRENT: {intersection.currentPhase} ({intersection.phaseTimer}s)
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
              Authorized municipal traffic engineers can temporarily override Reinforcement Learning signal splits.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => onOverridePhase(intersection.id, "GREEN_NS")}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 hover:border-emerald-500 transition-all flex items-center justify-center space-x-1.5 shadow active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Force Green N-S</span>
              </button>
              <button
                onClick={() => onOverridePhase(intersection.id, "GREEN_EW")}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-amber-600 hover:text-white text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 hover:border-amber-500 transition-all flex items-center justify-center space-x-1.5 shadow active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Force Green E-W</span>
              </button>
              <button
                onClick={() => onOverridePhase(intersection.id, "TRANSIT_PRIORITY")}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 hover:border-blue-500 transition-all flex items-center justify-center space-x-1.5 shadow active:scale-95"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Bus Preemption</span>
              </button>
              <button
                onClick={() => onOverridePhase(intersection.id, "RED_ALL")}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-rose-600 hover:text-white text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 hover:border-rose-500 transition-all flex items-center justify-center space-x-1.5 shadow active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>All-Red Scramble</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900/60 px-6 sm:px-8 py-4 border-t border-slate-800/80 flex justify-end relative z-10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all shadow-md active:scale-95"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
