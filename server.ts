import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for lazy initialization of Gemini
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "NexFlow AI Urban Traffic Engine", timestamp: new Date().toISOString() });
});

// Endpoint: Analyze Urban Traffic Bottleneck & Generate AI Solution
app.post("/api/analyze-bottleneck", async (req, res) => {
  try {
    const { location, corridorType, currentWaitMinutes, dailyVehicles, description, weatherOrEvent } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // High-fidelity fallback simulated analysis if API key is not set
      const simulatedResponse = {
        title: `NexFlow AI Strategy: ${location || "Metropolitan Arterial Corridor"}`,
        confidenceScore: 94,
        rootCauses: [
          "Severe signal phase desynchronization causing platoon stop-and-go cascades at cross-streets.",
          "Unmanaged left-turn queue overflow blocking straight-through lane throughput during peak hours.",
          "Lack of dynamic green-wave speed harmonization, resulting in hard braking and 28% excess fuel burn."
        ],
        signalOptimizationPlan: {
          cycleLengthSeconds: 110,
          splitPhaseAdjustments: "Increase arterial green duration by +18s during 07:30-09:15 AM; implement lagging left-turn phase.",
          greenWaveSpeedMph: 28,
          pedestrianScrambleTime: "14s dedicated scramble during off-peak intervals."
        },
        interventions: [
          {
            type: "Adaptive V2X Signal Actuation",
            description: "Deploy edge radar & vision sensors to trigger micro-phase adjustments (±5s) based on real-time vehicle arrival rates.",
            timeframe: "Immediate (Week 1)"
          },
          {
            type: "Transit & Emergency Preemption",
            description: "Grant conditional green-extension (+8s) to municipal buses carrying >30 passengers and unconditional override for emergency vehicles.",
            timeframe: "30 Days"
          },
          {
            type: "Dynamic Congestion Pricing & Lane Reversal",
            description: "Convert center median lane to reversible high-occupancy toll (HOT) lane during asymmetrical rush hour peaks.",
            timeframe: "90 Days"
          }
        ],
        projectedImpact: {
          waitTimeReductionPct: 34.5,
          co2TonsSavedAnnual: 1420,
          averageSpeedIncreaseMph: 8.4,
          economicValueSavedUSD: "$4.2M/year in recovered commuter productivity"
        },
        executiveSummary: `For ${location}, deploying NexFlow RL Signal Control will immediately eliminate the critical weaving bottleneck. By dynamically linking the 4 downstream intersections into a synchronized Green Wave corridor at 28 MPH, commuter travel times will drop by ~35% while cutting stop-cycle emissions significantly.`
      };
      return res.json({ success: true, isSimulated: true, data: simulatedResponse });
    }

    const prompt = `You are the Chief AI Traffic Engineer at NexFlow AI, a startup solving urban congestion with reinforcement learning and Edge AI.
Analyze the following urban traffic bottleneck and provide a structured JSON response:
Location: ${location || "Major Metropolitan Intersection"}
Corridor Type: ${corridorType || "Multi-lane Urban Arterial"}
Current Average Peak Wait Time: ${currentWaitMinutes || 12} minutes
Estimated Daily Vehicle Volume: ${dailyVehicles || 65000}
Description of Bottleneck: ${description || "Heavy rush hour congestion with frequent gridlock and pedestrian conflicts."}
Special Conditions: ${weatherOrEvent || "Normal weekdays with occasional stadium events."}

Return MUST be a valid JSON object strictly matching this schema (do NOT wrap in markdown codeblocks if possible, or we will parse it):
{
  "title": "String - clean strategy title",
  "confidenceScore": Number between 88 and 99,
  "rootCauses": ["Array of 3 distinct technical engineering causes of this congestion"],
  "signalOptimizationPlan": {
    "cycleLengthSeconds": Number (e.g. 90 to 140),
    "splitPhaseAdjustments": "String describing exact phase changes",
    "greenWaveSpeedMph": Number (recommended synchronized speed),
    "pedestrianScrambleTime": "String describing pedestrian safety phase"
  },
  "interventions": [
    {
      "type": "String (e.g., Adaptive Signal Actuation, Transit Preemption, etc.)",
      "description": "String detailing how this solves the problem",
      "timeframe": "String (e.g., Immediate, 30 Days, 90 Days)"
    }
  ],
  "projectedImpact": {
    "waitTimeReductionPct": Number (e.g. 25.5 to 45.0),
    "co2TonsSavedAnnual": Number (e.g. 800 to 3500),
    "averageSpeedIncreaseMph": Number (e.g. 5.0 to 12.0),
    "economicValueSavedUSD": "String (e.g. '$3.8M/year in commuter productivity')"
  },
  "executiveSummary": "String (2-3 sentences persuasive summary for the City Mayor or DOT Chief)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    });

    const text = response.text || "{}";
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Clean potential markdown tags if present
      const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(clean);
    }

    res.json({ success: true, isSimulated: false, data: parsed });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to analyze traffic bottleneck" });
  }
});

// Endpoint: Calculate Reinforcement Learning Signal Optimization for Corridor
app.post("/api/optimize-corridor", (req, res) => {
  const { intersections = [], aiAggressiveness = 75, priorityMode = "commuter" } = req.body;
  
  // Compute optimized signal split times using our simulated RL algorithm
  const optimizedIntersections = intersections.map((intersection: any, idx: number) => {
    const baseCycle = 100;
    let greenNorthSouth = 50;
    let greenEastWest = 40;
    const yellow = 4;
    const allRed = 2;

    const nsQueue = intersection.nsQueue || 15;
    const ewQueue = intersection.ewQueue || 10;
    const totalQueue = nsQueue + ewQueue || 1;
    
    // Dynamic ratio adjustment based on queue imbalance
    const nsRatio = nsQueue / totalQueue;
    const availableGreen = baseCycle - (yellow * 2) - (allRed * 2);
    
    if (priorityMode === "transit" && intersection.hasBusWaiting) {
      greenNorthSouth = Math.round(availableGreen * 0.7);
      greenEastWest = availableGreen - greenNorthSouth;
    } else if (priorityMode === "eco") {
      // Smooth green wave spacing
      greenNorthSouth = Math.round(availableGreen * 0.55);
      greenEastWest = availableGreen - greenNorthSouth;
    } else {
      greenNorthSouth = Math.max(18, Math.min(availableGreen - 18, Math.round(availableGreen * nsRatio)));
      greenEastWest = availableGreen - greenNorthSouth;
    }

    const throughputIncrease = Math.round(15 + (aiAggressiveness * 0.25) + (Math.random() * 6));
    const delayReductionSec = Math.round(12 + (aiAggressiveness * 0.3) + (Math.random() * 5));

    return {
      id: intersection.id || `INT-${idx + 1}`,
      name: intersection.name || `Intersection #${idx + 1}`,
      status: "OPTIMIZED",
      aiCycleLength: baseCycle,
      greenSplit: {
        northSouth: greenNorthSouth,
        eastWest: greenEastWest,
        yellow: yellow,
        allRed: allRed
      },
      metrics: {
        throughputIncreasePct: throughputIncrease,
        delayReductionSeconds: delayReductionSec,
        estimatedCo2SavedKgDay: Math.round(delayReductionSec * 14.5),
        confidence: Math.round(92 + (Math.random() * 7))
      }
    };
  });

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    priorityMode,
    systemEfficiencyScore: Math.round(88 + (aiAggressiveness * 0.1)),
    optimizations: optimizedIntersections
  });
});

// Endpoint: Generate Custom AI RFP / Pitch points for a target city
app.post("/api/generate-city-pitch", async (req, res) => {
  try {
    const { cityName, population, mainProblem, currentBudgetUSD } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        isSimulated: true,
        data: {
          headline: `NexFlow AI: Transforming ${cityName || "Your City"}'s Urban Mobility without Heavy Civil Construction`,
          keyValueProps: [
            `Zero-Excavation Deployment: Utilize existing signal cabinets and pole infrastructure in ${cityName || "the municipality"} with edge AI vision adapters installed in <45 minutes per intersection.`,
            `Immediate 28% Congestion Reduction: Our Reinforcement Learning engine learns ${cityName || "local"} traffic flow patterns within 72 hours, eliminating static timer inefficiencies.`,
            `Self-Funding ROI: Projected economic productivity savings of $14.2M annually will offset the municipal SaaS investment within 3.4 months.`
          ],
          rfpTalkingPoints: [
            "Meets all federal DOT Smart City Challenge interoperability standards (NTCIP & V2X DSRC/C-V2X compliant).",
            "Privacy-first edge processing: Video feeds are processed locally on device at 30 FPS; no personal license plate data is ever stored or transmitted to the cloud.",
            "Proven resilience: Auto-failsafe to localized actuated mode during network or power grid brownouts."
          ],
          suggestedPilotScope: `Phase 1 Pilot: Equip 12 critical intersections along the primary commercial corridor for a 90-day benchmark trial with guaranteed 20%+ wait time reduction.`
        }
      });
    }

    const prompt = `Generate a customized B2B Government SaaS sales pitch and RFP strategy for NexFlow AI targeting the city of ${cityName || "Metropolis"}.
City Population: ${population || "750,000"}
Key Congestion Challenge: ${mainProblem || "Arterial gridlock and transit bus delays"}
Annual Traffic Budget: ${currentBudgetUSD || "$5,000,000"}

Return valid JSON:
{
  "headline": "String - compelling customized headline",
  "keyValueProps": ["Array of 3 powerful value propositions specific to this city"],
  "rfpTalkingPoints": ["Array of 3 technical & compliance points for city council RFP"],
  "suggestedPilotScope": "String describing a concrete 90-day pilot recommendation"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.5 }
    });

    const parsed = JSON.parse((response.text || "{}").replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
    res.json({ success: true, isSimulated: false, data: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NexFlow AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
