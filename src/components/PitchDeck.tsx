import React from "react";
import { COMPETITOR_MATRIX } from "../data/mockData";
import { Presentation, Rocket, DollarSign, Target, CheckCircle2, ShieldCheck, Sparkles, Award, Cpu, ArrowUpRight, Send } from "lucide-react";

export const PitchDeck: React.FC = () => {
  const [targetCity, setTargetCity] = React.useState<string>("Seattle, WA");
  const [cityPop, setCityPop] = React.useState<string>("750,000");
  const [mainProblem, setMainProblem] = React.useState<string>("I-5 Downtown feeder weave and freight corridor gridlock");
  const [budget, setBudget] = React.useState<string>("$8,500,000");

  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [customPitch, setCustomPitch] = React.useState<any | null>(null);

  const generatePitch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-city-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityName: targetCity,
          population: cityPop,
          mainProblem,
          currentBudgetUSD: budget
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setCustomPitch(data.data);
      }
    } catch (err) {
      console.error("Pitch error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    generatePitch();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header - Bento Card */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              STARTUP GTM & INVESTOR DECK
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800/80">Seed / Series A Briefing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            NexFlow AI: The Operating System for Autonomous Urban Mobility
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            We replace $50,000 legacy inductive traffic controllers with a $1,200 Vision Edge adapter and cloud reinforcement learning.
          </p>
        </div>
      </div>

      {/* Top 3 Metric Cards - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-3 relative overflow-hidden border-t-4 border-t-emerald-500 transition-all hover:border-slate-700">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider font-semibold relative z-10">
            <span>Total Addressable Market</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight relative z-10">$45.8 Billion</div>
          <p className="text-xs text-slate-400 leading-relaxed relative z-10">
            Global Smart Cities & Connected V2X Infrastructure market growing at 18.4% CAGR through 2030.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-3 relative overflow-hidden border-t-4 border-t-cyan-500 transition-all hover:border-slate-700">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider font-semibold relative z-10">
            <span>Unit Economics</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400 tracking-tight relative z-10">8.4x LTV / CAC</div>
          <p className="text-xs text-slate-400 leading-relaxed relative z-10">
            $4,200/yr recurring SaaS per intersection with 5-year municipal contracts and <span className="text-white font-bold">&lt;2% annual churn</span>.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-3 relative overflow-hidden border-t-4 border-t-purple-500 transition-all hover:border-slate-700">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider font-semibold relative z-10">
            <span>Core Technical Moat</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400 tracking-tight relative z-10">Zero Civil Digging</div>
          <p className="text-xs text-slate-400 leading-relaxed relative z-10">
            Plug-and-play NTCIP adapter installs inside existing street signal cabinets in under 45 minutes without street excavation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive AI City Pitch Generator - Bento Card */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-5 relative overflow-hidden border-t-4 border-t-emerald-500">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-sm font-bold text-white font-sans flex items-center space-x-2 border-b border-slate-800/80 pb-3.5 relative z-10">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span>Generate Live Municipal RFP Strategy</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed relative z-10">
            Customize our go-to-market pitch points for a specific city council or DOT meeting.
          </p>

          <form onSubmit={generatePitch} className="space-y-3.5 text-xs font-mono relative z-10">
            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Target City / Metro Area</label>
              <input
                type="text"
                value={targetCity}
                onChange={e => setTargetCity(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-sans focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1.5">Population</label>
                <input
                  type="text"
                  value={cityPop}
                  onChange={e => setCityPop(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1.5">Annual Traffic Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Primary Municipal Bottleneck</label>
              <textarea
                rows={2}
                value={mainProblem}
                onChange={e => setMainProblem(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-sans focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-xl ${
                isGenerating
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/50 active:scale-95"
              }`}
            >
              {isGenerating ? <span>Tailoring Pitch Deck...</span> : <span>Generate Custom RFP Talk Track</span>}
            </button>
          </form>

          {/* Generated Output Card */}
          {customPitch && (
            <div className="bg-slate-950/90 border border-slate-800/80 p-5 rounded-2xl space-y-3.5 mt-4 text-xs font-sans relative z-10 shadow-inner">
              <div className="text-emerald-400 font-bold font-mono border-b border-slate-800/80 pb-2.5 text-sm">
                {customPitch.headline}
              </div>
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">Key Value Props:</span>
                {customPitch.keyValueProps?.map((prop: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{prop}</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 text-slate-300 font-mono text-xs leading-relaxed">
                <strong className="text-white block mb-1">Suggested Pilot:</strong> {customPitch.suggestedPilotScope}
              </div>
            </div>
          )}
        </div>

        {/* Right: Competitor Matrix & Technology Moat */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden border-l-4 border-l-cyan-500">
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10 border-b border-slate-800/80 pb-3.5">
              <h2 className="text-base font-bold text-white font-sans flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-cyan-400" />
                </div>
                <span>Competitive Differentiation Matrix</span>
              </h2>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 font-semibold">vs Legacy Actuators</span>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3.5 px-3">Dimension</th>
                    <th className="py-3.5 px-3 text-slate-500 font-normal">Legacy (Siemens/Econolite)</th>
                    <th className="py-3.5 px-3 text-emerald-400 font-bold bg-emerald-500/5 rounded-t-xl">NexFlow AI (Us)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {COMPETITOR_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white font-sans">{row.feature}</td>
                      <td className="py-3.5 px-3 text-slate-400">{row.legacySiemens}</td>
                      <td className="py-3.5 px-3 text-emerald-300 font-bold bg-emerald-500/5">{row.nexFlowAi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Go To Market Roadmap Banner - Bento Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden border-l-4 border-l-purple-500">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-sm font-bold text-white font-sans flex items-center space-x-2 relative z-10 border-b border-slate-800/80 pb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-purple-400" />
              </div>
              <span>3-Stage Municipal GTM Playbook</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono relative z-10">
              <div className="bg-slate-950/80 border border-slate-800/80 p-4.5 rounded-2xl space-y-1.5 shadow-inner">
                <span className="text-emerald-400 font-bold block text-sm">Stage 1: Free Digital Twin</span>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  We ingest city open-data camera feeds and run a 30-day simulated green-wave audit showing 20%+ lost throughput.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 p-4.5 rounded-2xl space-y-1.5 shadow-inner">
                <span className="text-cyan-400 font-bold block text-sm">Stage 2: 12-Intersection Pilot</span>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Deploy $1,200 edge vision adapters on 1 commercial arterial corridor with performance-guaranteed wait reduction.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 p-4.5 rounded-2xl space-y-1.5 shadow-inner">
                <span className="text-purple-400 font-bold block text-sm">Stage 3: City-Wide SaaS Rollout</span>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Expand to all 150+ signal cabinets under a 5-year SaaS contract ($350-$600/month per intersection).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
