import "server-only";
import { Agent, generateTraceId, Runner, tool } from "@openai/agents";
import { z } from "zod";
import { buildDemoPlan, Conditions, Profile, rankSpots } from "@/lib/engine";
import { SPOTS } from "@/lib/spots";
import { AgentDecisionSchema } from "./schemas";

type Activity = {
  activity: string[];
  traceId: string;
  usage: { requests: number; inputTokens: number; outputTokens: number; totalTokens: number };
};

function usageValue(usage: unknown, key: string) {
  if (!usage || typeof usage !== "object") return 0;
  const value = (usage as Record<string, unknown>)[key];
  return typeof value === "number" ? value : 0;
}

export async function runCoastOrchestrator(
  profile: Profile,
  conditions?: Record<string, Conditions>,
  observation?: { context: string; penalizedSpotId?: string },
) {
  const demo = buildDemoPlan(profile);
  const ranked = rankSpots(profile, conditions)
    .map((spot) => spot.id === observation?.penalizedSpotId
      ? { ...spot, score: Math.max(9, spot.score - 42), reasons: [observation.context, ...spot.reasons].slice(0, 3) }
      : spot)
    .sort((a, b) => b.score - a.score);
  let toolCalled = false;

  const rankTool = tool({
    name: "rank_sardinian_spots",
    description: "Rank verified Sardinian spots using weather, coast exposure, travel, skill and accessibility constraints.",
    parameters: z.object({
      mission: z.enum(["relax", "life", "surf", "kite"]),
      maxResults: z.number().int().min(3).max(5),
    }),
    execute: async ({ maxResults }) => {
      toolCalled = true;
      return ranked.slice(0, maxResults).map((spot) => ({
        id: spot.id,
        name: spot.name,
        score: spot.score,
        reasons: spot.reasons,
        risk: spot.risk,
        windSpeed: spot.windSpeed,
        gusts: spot.gusts,
        waveHeight: spot.waveHeight,
        temperature: spot.temperature,
        drive: spot.drive,
      }));
    },
  });

  const agent = new Agent({
    name: "AJÒ Coast Orchestrator",
    instructions: [
      "You plan one safe Sardinian beach mission.",
      "Call rank_sardinian_spots exactly once, then decide only from its results.",
      "Do not invent weather, availability, parking or safety facts.",
      "Keep the explanation warm, decisive and concise.",
      "Surf and kitesurf are risk-bearing: retain the local verification warning.",
    ].join(" "),
    model: process.env.OPENAI_MODEL || "gpt-5.6-sol",
    tools: [rankTool],
    outputType: AgentDecisionSchema,
    modelSettings: {
      reasoning: { effort: "low" },
      text: { verbosity: "low" },
      maxTokens: 450,
      toolChoice: "required",
      parallelToolCalls: false,
      store: false,
    },
  });

  const traceId = generateTraceId();
  const runner = new Runner({
    traceId,
    workflowName: "AJÒ Mission Loop",
    traceIncludeSensitiveData: false,
  });
  const result = await runner.run(
    agent,
    `Profile: ${JSON.stringify(profile)}.${observation ? ` New observation: ${observation.context}. Replan conservatively.` : " Create the initial mission."}`,
    {
      maxTurns: 2,
    },
  );
  if (!result.finalOutput || !toolCalled) throw new Error("Agent stopped without a grounded decision");

  const parsed = AgentDecisionSchema.parse(result.finalOutput);
  const validIds = new Set(ranked.map((spot) => spot.id));
  const top = ranked.find((spot) => spot.id === parsed.topId) || ranked[0] || demo.top;
  const alternatives = parsed.alternativeIds
    .filter((id) => validIds.has(id) && id !== top.id)
    .map((id) => ranked.find((spot) => spot.id === id))
    .filter((spot): spot is NonNullable<typeof spot> => Boolean(spot))
    .slice(0, 2);
  const safeAlternatives = alternatives.length ? alternatives : ranked.filter((spot) => spot.id !== top.id).slice(0, 2);
  const usage = result.state.usage;

  const telemetry: Activity = {
    traceId,
    usage: {
      requests: usageValue(usage, "requests"),
      inputTokens: usageValue(usage, "inputTokens"),
      outputTokens: usageValue(usage, "outputTokens"),
      totalTokens: usageValue(usage, "totalTokens"),
    },
    activity: [
      `Observed ${profile.mission} mission and ${profile.maxDrive} min drive limit`,
      `Tool ranked ${SPOTS.length} spots from cached conditions`,
      `Selected ${top.name}; kept ${safeAlternatives.length} recoverable fallback${safeAlternatives.length === 1 ? "" : "s"}`,
      `Armed a bounded watch · trace ${traceId.slice(-8)}`,
    ],
  };

  return {
    ...demo,
    mode: "live-ai" as const,
    summary: parsed.summary,
    window: /\d{1,2}:\d{2}/.test(parsed.window) ? parsed.window : demo.window,
    departure: parsed.departure,
    top,
    alternatives: safeAlternatives,
    watch: { ...demo.watch, label: `Watching ${top.name}`, trigger: parsed.watchReason, fallback: safeAlternatives[0]?.name || demo.watch.fallback },
    ...telemetry,
  };
}
