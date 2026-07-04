export type TabType = "command" | "signallab" | "bottleneck" | "roi" | "pitch";

export type SignalPhase = "GREEN_NS" | "YELLOW_NS" | "RED_ALL" | "GREEN_EW" | "YELLOW_EW" | "TRANSIT_PRIORITY" | "EMERGENCY_OVERRIDE";

export interface Intersection {
  id: string;
  name: string;
  lat: number;
  lng: number;
  currentPhase: SignalPhase;
  phaseTimer: number; // seconds remaining in current phase
  nsQueue: number; // number of waiting cars North/South
  ewQueue: number; // number of waiting cars East/West
  nsSpeed: number; // MPH
  ewSpeed: number; // MPH
  pedestrianCount: number;
  hasBusWaiting: boolean;
  hasEmergencyVehicle: boolean;
  co2RateKgHr: number;
  aiConfidence: number; // percentage
  status: "OPTIMAL" | "CONGESTED" | "CRITICAL_BOTTLENECK" | "EMERGENCY_CLEARING";
}

export interface GridScenario {
  id: string;
  name: string;
  description: string;
  city: string;
  intersections: Intersection[];
  averageSpeedMph: number;
  totalVehiclesPerHour: number;
  co2TonsDaily: number;
}

export interface OptimizationResult {
  id: string;
  name: string;
  status: string;
  aiCycleLength: number;
  greenSplit: {
    northSouth: number;
    eastWest: number;
    yellow: number;
    allRed: number;
  };
  metrics: {
    throughputIncreasePct: number;
    delayReductionSeconds: number;
    estimatedCo2SavedKgDay: number;
    confidence: number;
  };
}

export interface BottleneckAnalysisResponse {
  title: string;
  confidenceScore: number;
  rootCauses: string[];
  signalOptimizationPlan: {
    cycleLengthSeconds: number;
    splitPhaseAdjustments: string;
    greenWaveSpeedMph: number;
    pedestrianScrambleTime: string;
  };
  interventions: Array<{
    type: string;
    description: string;
    timeframe: string;
  }>;
  projectedImpact: {
    waitTimeReductionPct: number;
    co2TonsSavedAnnual: number;
    averageSpeedIncreaseMph: number;
    economicValueSavedUSD: string;
  };
  executiveSummary: string;
}

export interface RoiInput {
  cityName: string;
  population: number;
  signalizedIntersections: number;
  dailyCommuters: number;
  fuelPricePerGallon: number;
  saasTier: "STARTER" | "MUNICIPAL_PRO" | "METRO_ENTERPRISE";
}

export interface RoiOutput {
  hardwareCostUSD: number;
  annualSaaSUSD: number;
  totalInitialInvestment: number;
  annualCommuterHoursSaved: number;
  annualFuelGallonsSaved: number;
  annualCo2TonsEliminated: number;
  annualEconomicValueUSD: number;
  paybackPeriodMonths: number;
  roiFiveYearPct: number;
}
