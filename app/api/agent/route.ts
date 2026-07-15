import { NextResponse } from "next/server";
import { z } from "zod";
import { buildDemoPlan } from "@/lib/engine";
import { getLiveConditions } from "@/lib/live";
import { budgetSnapshot, cacheResult, readCached, reserveAgentRun } from "@/lib/agent/budget";
import { runCoastOrchestrator } from "@/lib/agent/coast-orchestrator";
import { ProfileSchema } from "@/lib/agent/schemas";

const RequestSchema = z.object({ profile: ProfileSchema, useAI: z.boolean().optional().default(false) });

function envelope<T extends Record<string, unknown>>(plan: T, version = 1) {
  return {
    ...plan,
    missionId: crypto.randomUUID(),
    version,
    generatedAt: new Date().toISOString(),
    budget: budgetSnapshot(),
  };
}

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mission profile", details: parsed.error.flatten() }, { status: 400 });
  }

  const { profile, useAI } = parsed.data;
  const demo = buildDemoPlan(profile);
  if (!useAI || !process.env.OPENAI_API_KEY) {
    return NextResponse.json(envelope({
      ...demo,
      mode: process.env.OPENAI_API_KEY ? "credit-saver" : "demo-no-key",
      traceId: "deterministic",
      usage: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    }));
  }

  const cacheKey = `mission:${JSON.stringify(profile)}`;
  const cached = readCached<Record<string, unknown>>(cacheKey);
  if (cached) {
    const cachedActivity = Array.isArray(cached.activity) ? cached.activity as string[] : [];
    return NextResponse.json(envelope({
      ...cached,
      mode: "live-ai-cached",
      usage: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      activity: [...cachedActivity.slice(0, 3), "Served the grounded decision from the 30-minute cache · 0 new tokens"],
    }));
  }

  const permit = reserveAgentRun(cacheKey);
  if (!permit.allowed) {
    return NextResponse.json(envelope({
      ...demo,
      mode: "credit-saver-governor",
      traceId: "governor",
      usage: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      activity: [...demo.activity, `Budget governor used deterministic recovery (${permit.reason})`],
    }));
  }

  try {
    const conditions = await getLiveConditions().catch(() => undefined);
    const result = await runCoastOrchestrator(profile, conditions);
    cacheResult(cacheKey, result);
    return NextResponse.json(envelope(result));
  } catch (error) {
    console.error("AJÒ agent fallback", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(envelope({
      ...demo,
      mode: "demo-fallback",
      traceId: "fallback",
      usage: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      activity: [...demo.activity, "Agent failed safely; deterministic plan preserved the mission"],
    }));
  }
}
