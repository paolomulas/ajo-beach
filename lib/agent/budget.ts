import "server-only";

type CacheEntry<T> = { expiresAt: number; value: T };
type BudgetState = {
  day: string;
  runs: number;
  lastRunByKey: Map<string, number>;
  cache: Map<string, CacheEntry<unknown>>;
};

declare global {
  var ajoBudgetState: BudgetState | undefined;
}

function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
}

function state() {
  const day = today();
  if (!globalThis.ajoBudgetState || globalThis.ajoBudgetState.day !== day) {
    globalThis.ajoBudgetState = { day, runs: 0, lastRunByKey: new Map(), cache: new Map() };
  }
  return globalThis.ajoBudgetState;
}

export type BudgetDecision =
  | { allowed: true; remaining: number }
  | { allowed: false; reason: "daily-cap" | "cooldown"; remaining: number };

export function readCached<T>(key: string): T | undefined {
  const current = state();
  const entry = current.cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    current.cache.delete(key);
    return undefined;
  }
  return entry.value;
}

export function cacheResult<T>(key: string, value: T, ttlMs = 30 * 60 * 1000) {
  state().cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function reserveAgentRun(key: string): BudgetDecision {
  const current = state();
  const cap = Math.max(1, Number(process.env.AJO_DAILY_AGENT_RUNS || 8));
  const cooldownMs = Math.max(0, Number(process.env.AJO_AGENT_COOLDOWN_MS || 10 * 60 * 1000));
  const remaining = Math.max(0, cap - current.runs);

  if (current.runs >= cap) return { allowed: false, reason: "daily-cap", remaining: 0 };
  const lastRun = current.lastRunByKey.get(key);
  if (lastRun && Date.now() - lastRun < cooldownMs) {
    return { allowed: false, reason: "cooldown", remaining };
  }

  current.runs += 1;
  current.lastRunByKey.set(key, Date.now());
  return { allowed: true, remaining: Math.max(0, cap - current.runs) };
}

export function budgetSnapshot() {
  const current = state();
  const cap = Math.max(1, Number(process.env.AJO_DAILY_AGENT_RUNS || 8));
  return { day: current.day, runs: current.runs, cap, remaining: Math.max(0, cap - current.runs) };
}
