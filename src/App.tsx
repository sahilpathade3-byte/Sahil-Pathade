import React from "react";
import { TabType, Intersection } from "./types";
import { INITIAL_INTERSECTIONS } from "./data/mockData";
import { Navbar } from "./components/Navbar";
import { CommandCenter } from "./components/CommandCenter";
import { SignalLab } from "./components/SignalLab";
import { BottleneckSolver } from "./components/BottleneckSolver";
import { RoiCalculator } from "./components/RoiCalculator";
import { PitchDeck } from "./components/PitchDeck";
import { IntersectionModal } from "./components/IntersectionModal";
import { Activity, ShieldCheck, Cpu } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = React.useState<TabType>("command");
  const [isAiConnected, setIsAiConnected] = React.useState<boolean>(false);
  const [adaptiveMode, setAdaptiveMode] = React.useState<boolean>(true);
  const [emergencyOverride, setEmergencyOverride] = React.useState<boolean>(false);
  const [intersections, setIntersections] = React.useState<Intersection[]>(INITIAL_INTERSECTIONS);
  const [selectedIntersection, setSelectedIntersection] = React.useState<Intersection | null>(null);

  // Check backend health & Gemini status on load
  React.useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        if (data && data.status === "ok") {
          setIsAiConnected(true);
        }
      })
      .catch(err => {
        console.warn("Backend running in standalone or simulation mode:", err);
        setIsAiConnected(false);
      });
  }, []);

  // Handle manual phase override from modal
  const handleOverridePhase = (id: string, newPhase: any) => {
    setIntersections(prev =>
      prev.map(int => {
        if (int.id === id) {
          return {
            ...int,
            currentPhase: newPhase,
            phaseTimer: 35,
            status: newPhase === "EMERGENCY_OVERRIDE" ? "EMERGENCY_CLEARING" : int.status
          };
        }
        return int;
      })
    );
    if (selectedIntersection && selectedIntersection.id === id) {
      setSelectedIntersection(prev => prev ? { ...prev, currentPhase: newPhase, phaseTimer: 35 } : null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Ambient Glow & Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Header & Navigation */}
      <div className="relative z-20">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAiConnected={isAiConnected}
          adaptiveMode={adaptiveMode}
          setAdaptiveMode={setAdaptiveMode}
          emergencyOverride={emergencyOverride}
          setEmergencyOverride={setEmergencyOverride}
        />
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        {activeTab === "command" && (
          <CommandCenter
            adaptiveMode={adaptiveMode}
            emergencyOverride={emergencyOverride}
            onSelectIntersection={(int) => setSelectedIntersection(int)}
            intersections={intersections}
            setIntersections={setIntersections}
          />
        )}

        {activeTab === "signallab" && (
          <SignalLab
            intersections={intersections}
            adaptiveMode={adaptiveMode}
            setAdaptiveMode={setAdaptiveMode}
          />
        )}

        {activeTab === "bottleneck" && (
          <BottleneckSolver />
        )}

        {activeTab === "roi" && (
          <RoiCalculator />
        )}

        {activeTab === "pitch" && (
          <PitchDeck />
        )}
      </main>

      {/* Intersection Telemetry & Override Modal */}
      <IntersectionModal
        intersection={selectedIntersection}
        onClose={() => setSelectedIntersection(null)}
        onOverridePhase={handleOverridePhase}
      />

      {/* Footer - Bento Style */}
      <footer className="bg-slate-900/60 backdrop-blur-md border-t border-slate-800/80 py-8 mt-16 text-xs font-mono text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800/80 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-slate-300 font-bold font-sans tracking-tight">NexFlow AI Edge OS</span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 font-mono">NTCIP 1202 & DSRC V2X Compliant</span>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-3">
            <div className="bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800/60 flex items-center space-x-1.5">
              <span>Grid Latency:</span>
              <strong className="text-emerald-400 font-bold">4.2ms</strong>
            </div>
            <div className="bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800/60 flex items-center space-x-1.5">
              <span>Edge Nodes:</span>
              <strong className="text-cyan-400 font-bold">142 ACTIVE</strong>
            </div>
            <div className="bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800/60 flex items-center space-x-1.5">
              <span>GHG Avoided Today:</span>
              <strong className="text-amber-400 font-bold">1,840 kg</strong>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
