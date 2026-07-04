import React from "react";
import { RoiInput, RoiOutput } from "../types";
import { TrendingUp, DollarSign, Clock, ShieldCheck, Fuel, Users, Award, Download, Building } from "lucide-react";

export const RoiCalculator: React.FC = () => {
  const [input, setInput] = React.useState<RoiInput>({
    cityName: "Metropolis City",
    population: 650000,
    signalizedIntersections: 120,
    dailyCommuters: 180000,
    fuelPricePerGallon: 3.65,
    saasTier: "MUNICIPAL_PRO"
  });

  // Calculate outputs
  const calculateRoi = (inp: RoiInput): RoiOutput => {
    // Hardware cost per intersection: $1,200 edge vision kit
    const hardwareCostUSD = inp.signalizedIntersections * 1200;

    // SaaS monthly per intersection based on tier
    let monthlyRate = 350;
    if (inp.saasTier === "MUNICIPAL_PRO") monthlyRate = 450;
    if (inp.saasTier === "METRO_ENTERPRISE") monthlyRate = 600;

    const annualSaaSUSD = inp.signalizedIntersections * monthlyRate * 12;
    const totalInitialInvestment = hardwareCostUSD + annualSaaSUSD;

    // Commuter hours saved: assume 25% wait time reduction = ~4.2 mins saved per commuter per day (250 work days)
    const annualCommuterHoursSaved = Math.round(inp.dailyCommuters * (4.2 / 60) * 250);

    // Fuel saved: ~0.15 gallons saved per commuter day due to less idling
    const annualFuelGallonsSaved = Math.round(inp.dailyCommuters * 0.15 * 250);

    // CO2 eliminated: ~8.887 kg CO2 per gallon of gasoline burnt -> tons
    const annualCo2TonsEliminated = Math.round((annualFuelGallonsSaved * 8.887) / 1000);

    // Economic productivity value: assume $28/hr average commuter value + fuel savings
    const valueFromTime = annualCommuterHoursSaved * 28;
    const valueFromFuel = annualFuelGallonsSaved * inp.fuelPricePerGallon;
    const annualEconomicValueUSD = Math.round(valueFromTime + valueFromFuel);

    // Payback period in months for municipal investment relative to direct fuel/time economic return
    const paybackPeriodMonths = Number(((totalInitialInvestment / annualEconomicValueUSD) * 12).toFixed(1));

    // 5-year municipal ROI percentage
    const fiveYearNetReturn = annualEconomicValueUSD * 5 - (hardwareCostUSD + annualSaaSUSD * 5);
    const roiFiveYearPct = Math.round((fiveYearNetReturn / (hardwareCostUSD + annualSaaSUSD * 5)) * 100);

    return {
      hardwareCostUSD,
      annualSaaSUSD,
      totalInitialInvestment,
      annualCommuterHoursSaved,
      annualFuelGallonsSaved,
      annualCo2TonsEliminated,
      annualEconomicValueUSD,
      paybackPeriodMonths: Math.max(0.5, paybackPeriodMonths),
      roiFiveYearPct
    };
  };

  const output = calculateRoi(input);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header - Bento Card */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              B2B GOV-TECH PRICING & ROI
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800/80">Smart City SaaS Pricing Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-3 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Municipal ROI & Carbon Reduction Financial Modeler
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Simulate the financial and environmental returns of upgrading a city's legacy traffic controllers to NexFlow AI Edge Vision & RL Green-Wave SaaS.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl text-xs font-bold border border-slate-700 transition-all flex items-center space-x-2.5 shadow-xl hover:border-slate-600 relative z-10 whitespace-nowrap active:scale-95"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Municipal Briefing</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: City Parameters - Bento Card */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 p-6 sm:p-7 rounded-3xl shadow-xl backdrop-blur-sm space-y-6 relative overflow-hidden border-t-4 border-t-emerald-500">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-sm font-bold text-white font-sans flex items-center space-x-2 border-b border-slate-800/80 pb-3.5 relative z-10">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Building className="w-4 h-4 text-emerald-400" />
            </div>
            <span>City Infrastructure Parameters</span>
          </h2>

          <div className="space-y-4 text-xs font-mono relative z-10">
            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">Municipality / Agency Name</label>
              <input
                type="text"
                value={input.cityName}
                onChange={e => setInput({ ...input, cityName: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-sans text-sm focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1.5">Signalized Intersections</label>
                <input
                  type="number"
                  value={input.signalizedIntersections}
                  onChange={e => setInput({ ...input, signalizedIntersections: Math.max(1, Number(e.target.value)) })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1.5">Daily Commuters</label>
                <input
                  type="number"
                  value={input.dailyCommuters}
                  onChange={e => setInput({ ...input, dailyCommuters: Math.max(1000, Number(e.target.value)) })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1.5">City Population</label>
                <input
                  type="number"
                  value={input.population}
                  onChange={e => setInput({ ...input, population: Number(e.target.value) })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1.5">Avg Fuel Price ($/gal)</label>
                <input
                  type="number"
                  step="0.05"
                  value={input.fuelPricePerGallon}
                  onChange={e => setInput({ ...input, fuelPricePerGallon: Number(e.target.value) })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
                />
              </div>
            </div>

            {/* SaaS Tier Selection */}
            <div className="space-y-2.5 pt-2">
              <label className="text-slate-400 font-semibold block uppercase tracking-wider text-[11px]">Select NexFlow SaaS Deployment Tier</label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: "STARTER", name: "Starter Tier ($350/mo per intersection)", desc: "Basic adaptive timing & cloud monitoring" },
                  { id: "MUNICIPAL_PRO", name: "Municipal Pro ($450/mo per intersection)", desc: "Reinforcement learning + transit bus priority" },
                  { id: "METRO_ENTERPRISE", name: "Metro Enterprise ($600/mo per intersection)", desc: "Full V2X emergency preemption + GenAI solver" }
                ].map(tier => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setInput({ ...input, saasTier: tier.id as any })}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                      input.saasTier === tier.id
                        ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 shadow-inner"
                    }`}
                  >
                    <div className="font-bold font-sans text-xs">{tier.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Financial & Environmental ROI Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Headline ROI numbers - Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden border-t-4 border-t-emerald-500 transition-all hover:border-slate-700">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-xs font-mono text-slate-400 font-semibold flex items-center justify-between relative z-10 uppercase tracking-wider">
                <span>5-Year ROI</span>
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-3 relative z-10 tracking-tight">
                +{output.roiFiveYearPct}%
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1 relative z-10">Net Economic Return</div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden border-t-4 border-t-cyan-500 transition-all hover:border-slate-700">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-xs font-mono text-slate-400 font-semibold flex items-center justify-between relative z-10 uppercase tracking-wider">
                <span>Payback</span>
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-3 relative z-10 tracking-tight">
                {output.paybackPeriodMonths} <span className="text-sm font-normal text-slate-400 font-mono">mo</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1 relative z-10">Self-funding from time/fuel</div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden border-t-4 border-t-purple-500 transition-all hover:border-slate-700">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-xs font-mono text-slate-400 font-semibold flex items-center justify-between relative z-10 uppercase tracking-wider">
                <span>Annual Value</span>
                <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300 mt-3 relative z-10 tracking-tight truncate">
                ${(output.annualEconomicValueUSD / 1000000).toFixed(1)}M
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1 relative z-10">Commuter hours + fuel saved</div>
            </div>
          </div>

          {/* Detailed Financial Breakdown Table - Bento Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-sm space-y-6 relative overflow-hidden border-l-4 border-l-purple-500">
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-3.5 relative z-10">
              <h3 className="text-sm font-bold text-white font-sans flex items-center space-x-2">
                <span>Financial Investment vs. Community Return ({input.cityName})</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">250 Work Days / Year</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono relative z-10">
              <div className="space-y-3.5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
                <span className="text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-800/80 pb-2">
                  1. Municipal SaaS Investment
                </span>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Edge Vision ({input.signalizedIntersections} units):</span>
                  <span className="text-white font-bold">${output.hardwareCostUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Annual SaaS Licensing:</span>
                  <span className="text-white font-bold">${output.annualSaaSUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-800/80 text-sm">
                  <span className="text-slate-300 font-bold">Total Year 1 Cost:</span>
                  <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">${output.totalInitialInvestment.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3.5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
                <span className="text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-800/80 pb-2">
                  2. Annual Community Benefits
                </span>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Commuter Hours Saved:</span>
                  <span className="text-cyan-400 font-bold">{output.annualCommuterHoursSaved.toLocaleString()} hrs</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Gasoline Burn Eliminated:</span>
                  <span className="text-amber-400 font-bold">{output.annualFuelGallonsSaved.toLocaleString()} gal</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">GHG Carbon Reduction:</span>
                  <span className="text-emerald-400 font-bold">{output.annualCo2TonsEliminated.toLocaleString()} tons CO2</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-800/80 text-sm">
                  <span className="text-slate-300 font-bold">Total Annual ROI Value:</span>
                  <span className="text-purple-400 font-extrabold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">${output.annualEconomicValueUSD.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bottom Summary Quote - Bento Tile */}
            <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-5 text-xs text-slate-300 font-sans leading-relaxed flex items-center space-x-4 relative z-10 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <strong className="text-white text-sm block mb-0.5">City Council Justification:</strong> By deploying NexFlow AI across {input.signalizedIntersections} intersections, {input.cityName} will generate <strong className="text-emerald-400 font-mono font-bold">${(output.annualEconomicValueUSD / 1000000).toFixed(2)} Million</strong> in commuter time savings and fuel economy annually while eliminating <strong className="text-cyan-400 font-mono font-bold">{output.annualCo2TonsEliminated.toLocaleString()} metric tons</strong> of CO2—all with zero civil street excavation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
