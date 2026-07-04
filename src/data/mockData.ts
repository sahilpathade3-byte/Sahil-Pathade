import { GridScenario, Intersection } from "../types";

export const INITIAL_INTERSECTIONS: Intersection[] = [
  {
    id: "INT-1",
    name: "1st Ave & Market St (Financial District)",
    lat: 37.789,
    lng: -122.401,
    currentPhase: "GREEN_NS",
    phaseTimer: 32,
    nsQueue: 14,
    ewQueue: 28,
    nsSpeed: 24,
    ewSpeed: 6,
    pedestrianCount: 34,
    hasBusWaiting: true,
    hasEmergencyVehicle: false,
    co2RateKgHr: 48.5,
    aiConfidence: 96,
    status: "CONGESTED"
  },
  {
    id: "INT-2",
    name: "2nd Ave & Market St (Transit Hub)",
    lat: 37.790,
    lng: -122.403,
    currentPhase: "RED_ALL",
    phaseTimer: 2,
    nsQueue: 8,
    ewQueue: 32,
    nsSpeed: 18,
    ewSpeed: 4,
    pedestrianCount: 52,
    hasBusWaiting: true,
    hasEmergencyVehicle: false,
    co2RateKgHr: 62.0,
    aiConfidence: 94,
    status: "CRITICAL_BOTTLENECK"
  },
  {
    id: "INT-3",
    name: "1st Ave & Mission St (Tech Corridor)",
    lat: 37.787,
    lng: -122.399,
    currentPhase: "GREEN_EW",
    phaseTimer: 18,
    nsQueue: 22,
    ewQueue: 12,
    nsSpeed: 8,
    ewSpeed: 26,
    pedestrianCount: 19,
    hasBusWaiting: false,
    hasEmergencyVehicle: false,
    co2RateKgHr: 39.2,
    aiConfidence: 97,
    status: "OPTIMAL"
  },
  {
    id: "INT-4",
    name: "2nd Ave & Mission St (Highway Feeder)",
    lat: 37.788,
    lng: -122.401,
    currentPhase: "GREEN_NS",
    phaseTimer: 41,
    nsQueue: 35,
    ewQueue: 18,
    nsSpeed: 11,
    ewSpeed: 14,
    pedestrianCount: 12,
    hasBusWaiting: false,
    hasEmergencyVehicle: true, // Emergency vehicle approaching!
    co2RateKgHr: 74.8,
    aiConfidence: 91,
    status: "EMERGENCY_CLEARING"
  },
  {
    id: "INT-5",
    name: "3rd Ave & Market St (Retail Core)",
    lat: 37.791,
    lng: -122.405,
    currentPhase: "GREEN_EW",
    phaseTimer: 25,
    nsQueue: 16,
    ewQueue: 21,
    nsSpeed: 15,
    ewSpeed: 22,
    pedestrianCount: 41,
    hasBusWaiting: false,
    hasEmergencyVehicle: false,
    co2RateKgHr: 44.1,
    aiConfidence: 95,
    status: "OPTIMAL"
  },
  {
    id: "INT-6",
    name: "3rd Ave & Mission St (Convention Center)",
    lat: 37.789,
    lng: -122.403,
    currentPhase: "RED_ALL",
    phaseTimer: 3,
    nsQueue: 29,
    ewQueue: 27,
    nsSpeed: 9,
    ewSpeed: 11,
    pedestrianCount: 28,
    hasBusWaiting: true,
    hasEmergencyVehicle: false,
    co2RateKgHr: 58.4,
    aiConfidence: 93,
    status: "CONGESTED"
  }
];

export const CITY_GRID_SCENARIOS: GridScenario[] = [
  {
    id: "metro-core",
    name: "Downtown Metropolitan Core (Rush Hour Peak)",
    description: "High-density commercial grid with frequent pedestrian scrambles, heavy bus transit, and delivery vehicle double-parking.",
    city: "San Francisco / New York / Chicago style",
    intersections: INITIAL_INTERSECTIONS,
    averageSpeedMph: 14.2,
    totalVehiclesPerHour: 18500,
    co2TonsDaily: 142.5
  },
  {
    id: "highway-corridor",
    name: "Interstate Arterial Feeder & Ramp Interchange",
    description: "High-velocity corridor feeding onto Interstate on-ramps. Subject to severe cascading spillback when highway slows down.",
    city: "Austin I-35 / Los Angeles I-405 style",
    intersections: INITIAL_INTERSECTIONS.map(int => ({
      ...int,
      nsQueue: Math.round(int.nsQueue * 1.6),
      nsSpeed: Math.max(5, Math.round(int.nsSpeed * 0.7)),
      status: "CRITICAL_BOTTLENECK" as const
    })),
    averageSpeedMph: 9.8,
    totalVehiclesPerHour: 28400,
    co2TonsDaily: 248.0
  },
  {
    id: "stadium-surge",
    name: "Mega-Event Stadium Exit Surge (300% Volume Spike)",
    description: "Sudden massive vehicular egress following a major stadium concert or playoff game. Requires extreme green-wave flushing.",
    city: "Seattle Lumen Field / Madrid Bernabeu style",
    intersections: INITIAL_INTERSECTIONS.map((int, i) => ({
      ...int,
      ewQueue: Math.round(int.ewQueue * 2.5),
      currentPhase: i % 2 === 0 ? "GREEN_EW" : "YELLOW_EW",
      status: "CONGESTED" as const
    })),
    averageSpeedMph: 11.4,
    totalVehiclesPerHour: 34000,
    co2TonsDaily: 310.2
  }
];

export const FAMOUS_BOTTLENECKS = [
  {
    name: "Manhattan Midtown Gridlock (42nd St & 8th Ave)",
    city: "New York City, USA",
    corridorType: "High-Density Urban Arterial",
    currentWaitMinutes: 18,
    dailyVehicles: 85000,
    description: "Constant pedestrian conflicts, turning lane spillbacks, and charter buses blocking straight-through traffic during rush hour.",
    weatherOrEvent: "Heavy rain & theater district evening rush."
  },
  {
    name: "Shibuya Crossing & Miyamasuzaka Arterial",
    city: "Tokyo, Japan",
    corridorType: "Mega-Pedestrian Transit Junction",
    currentWaitMinutes: 14,
    dailyVehicles: 92000,
    description: "World's busiest pedestrian crossing with 3,000 pedestrians crossing per green cycle, creating severe vehicle dwell times.",
    weatherOrEvent: "Friday 6 PM peak commuter exit."
  },
  {
    name: "I-35 & 6th Street Downtown Weave",
    city: "Austin, Texas, USA",
    corridorType: "Interstate Frontage & Urban Merge",
    currentWaitMinutes: 22,
    dailyVehicles: 140000,
    description: "Short highway weaving sections combined with rapid tech population growth causing multi-kilometer stop-and-go queues.",
    weatherOrEvent: "Standard weekday 5:00 PM evening commute."
  },
  {
    name: "Mumbai BKC & Western Express Highway Junction",
    city: "Mumbai, India",
    corridorType: "High-Volume Multi-Modal Arterial",
    currentWaitMinutes: 28,
    dailyVehicles: 165000,
    description: "Extreme volume density with mixed vehicle types (auto-rickshaws, buses, sedans, two-wheelers) and unregulated lane disciplines.",
    weatherOrEvent: "Monsoon season high-density evening traffic."
  }
];

export const COMPETITOR_MATRIX = [
  {
    feature: "Signal Adaptation Latency",
    legacySiemens: "Fixed Timer / 15-min Time-of-Day Plans",
    scatsScoot: "Cycle-by-cycle (3-5 min lag)",
    nexFlowAi: "Sub-second Real-Time Edge Vision Actuation"
  },
  {
    feature: "Hardware Retrofit Requirement",
    legacySiemens: "Expensive inductive loops buried in asphalt",
    scatsScoot: "Proprietary controllers ($40,000+ per intersection)",
    nexFlowAi: "Plug-and-play Edge AI Vision Adapter ($1,200 cabinet add-on)"
  },
  {
    feature: "Multi-Modal & Transit Prioritization",
    legacySiemens: "None or manual radio override",
    scatsScoot: "Basic transponder bus preemption",
    nexFlowAi: "Predictive V2X Green-Wave for Emergency, Bus, & Bikes"
  },
  {
    feature: "AI Reinforcement Learning",
    legacySiemens: "No AI / Static Historical Tables",
    scatsScoot: "Linear heuristics",
    nexFlowAi: "Deep Q-Learning trained on 50M+ simulated city hours"
  },
  {
    feature: "Carbon & Fuel Analytics",
    legacySiemens: "Not tracked",
    scatsScoot: "Estimated post-hoc models",
    nexFlowAi: "Real-time GHG emissions telemetry & municipal dashboard"
  }
];

export const PERFORMANCE_CHARTS_24H = [
  { time: "00:00", legacySpeed: 28, nexFlowSpeed: 32, legacyQueue: 4, nexFlowQueue: 1 },
  { time: "03:00", legacySpeed: 30, nexFlowSpeed: 34, legacyQueue: 2, nexFlowQueue: 0 },
  { time: "06:00", legacySpeed: 22, nexFlowSpeed: 28, legacyQueue: 14, nexFlowQueue: 5 },
  { time: "08:00", legacySpeed: 11, nexFlowSpeed: 21, legacyQueue: 38, nexFlowQueue: 14 },
  { time: "10:00", legacySpeed: 18, nexFlowSpeed: 25, legacyQueue: 22, nexFlowQueue: 8 },
  { time: "12:00", legacySpeed: 15, nexFlowSpeed: 23, legacyQueue: 26, nexFlowQueue: 10 },
  { time: "15:00", legacySpeed: 16, nexFlowSpeed: 24, legacyQueue: 25, nexFlowQueue: 9 },
  { time: "17:30", legacySpeed: 9, nexFlowSpeed: 19, legacyQueue: 45, nexFlowQueue: 16 },
  { time: "20:00", legacySpeed: 20, nexFlowSpeed: 27, legacyQueue: 16, nexFlowQueue: 5 },
  { time: "22:00", legacySpeed: 25, nexFlowSpeed: 31, legacyQueue: 8, nexFlowQueue: 2 }
];
