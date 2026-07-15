import { NextResponse } from "next/server";
import { z } from "zod";
import { buildDemoPlan, rankSpots } from "@/lib/engine";
import { getLiveConditions } from "@/lib/live";
import { budgetSnapshot, cacheResult, readCached, reserveAgentRun } from "@/lib/agent/budget";
import { runCoastOrchestrator } from "@/lib/agent/coast-orchestrator";
import { ChangeEventSchema, ProfileSchema } from "@/lib/agent/schemas";

const RequestSchema = z.object({
  profile: ProfileSchema,
  useAI: z.boolean().optional().default(false),
  event: ChangeEventSchema,
  missionId: z.string().min(8).max(80),
  version: z.number().int().min(1).max(50),
});

const observationLabels = {
  "wind-spike": "Wind and gust spread crossed the mission threshold",
  crowding: "Camera snapshot indicates high beach density",
  parking: "Verified community reports indicate parking saturation",
  posidonia: "Recent marine conditions indicate a possible Posidonia accumulation",
} as const;

function deterministicRecovery(profile: z.infer<typeof ProfileSchema>, spotId: string, context: string) {
  const base = buildDemoPlan(profile);
  const ranked = rankSpots(profile);
  const top = ranked.find((spot) => spot.id !== spotId) || base.alternatives[0] || base.top;
  const alternatives = ranked.filter((spot) => spot.id !== top.id && spot.id !== spotId).slice(0, 2);
  return {
    ...base,
    mode: "deterministic-replan" as const,
    summary: `${context}. AJÒ moved the mission to ${top.name} while preserving your drive and safety constraints.`,
    top,
    alternatives,
    watch: { ...base.watch, label: `Watching ${top.name}`, fallback: alternatives[0]?.name || base.watch.fallback },
    activity: [
      `Observed typed signal: ${context}`,
      `Invalidated ${spotId} for this mission window`,
      `Re-ranked ${ranked.length - 1} viable spots without a model call`,
      `Recovered the mission at ${top.name}`,
    ],
    traceId: "deterministic-replan",
    usage: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 },
  };
}

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid replan event" }, { status: 400 });

  const { profile, event, useAI, missionId, version } = parsed.data;
  const context = observationLabels[event.type];
  const fallback = deterministicRecovery(profile, event.spotId, context);
  const nextEnvelope = <T extends Record<string, unknown>>(plan: T) => ({
    ...plan,
    missionId,
    version: version + 1,
    generatedAt: new Date().toISOString(),
    changedBecause: context,
    budget: budgetSnapshot(),
  });

  if (!useAI || !process.env.OPENAI_API_KEY) return NextResponse.json(nextEnvelope(fallback));

  const cacheKey = `replan:${missionId}:${version}:${event.type}:${event.spotId}`;
  const cached = readCached<Record<string, unknown>>(cacheKey);
  if (cached) {
    const cachedActivity = Array.isArray(cached.activity) ? cached.activity as string[] : [];
    return NextResponse.json(nextEnvelope({
      ...cached,
      mode: "live-ai-cached",
      usage: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      activity: [...cachedActivity.slice(0, 3), "Served cached replan · 0 new tokens"],
    }));
  }

  const permit = reserveAgentRun(cacheKey);
  if (!permit.allowed) {
    return NextResponse.json(nextEnvelope({
      ...fallback,
      mode: "credit-saver-governor",
      activity: [...fallback.activity, `Governor blocked a duplicate model run (${permit.reason})`],
    }));
  }

  try {
    const conditions = await getLiveConditions().catch(() => undefined);
    const result = await runCoastOrchestrator(profile, conditions, { context, penalizedSpotId: event.spotId });
    cacheResult(cacheKey, result);
    return NextResponse.json(nextEnvelope(result));
  } catch (error) {
    console.error("AJÒ replan fallback", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(nextEnvelope(fallback));
  }
}
