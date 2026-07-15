# AJÒ Beach agentic architecture

Status: target architecture for the Build Week vertical slice

Runtime language: TypeScript

Production agent runtime: OpenAI Agents SDK
Development agent: Codex

## 1. Product thesis

AJÒ does not answer "what is the weather?". It accepts an intent such as a quiet
family morning, a surf window, a kite session or a beach-to-aperitivo experience,
builds a feasible mission, watches the coast and changes that mission when evidence
changes.

The contest story is a closed, observable loop:

```text
mission or scheduled trigger
          ↓
observe coast → derive signals → rank candidates
          ↓                         ↓
     persist snapshot ← plan and explain
          ↓                         ↓
      arm watchers  → meaningful change? → replan / notify
```

This is not a chat loop. It is an event-driven decision loop with state, tools,
guardrails, recovery and evaluation.

## 2. Why one agent first

The initial production topology contains one `CoastOrchestrator`. Weather retrieval,
ranking, camera interpretation and notification delivery are tools or bounded workers,
not theatrical personas.

One orchestrator gives us:

- a single decision owner and a readable trace;
- lower latency and token cost;
- simpler recovery and evaluation;
- fewer handoff failures during the contest demo.

A specialist becomes an agent only if it needs independent instructions, tools and a
handoff that improves a measured eval. In particular, `CameraObserver` begins as a
bounded structured vision task, not as a continuously autonomous agent.

## 3. Runtime topology

```text
PWA
 ├─ Create/update mission
 ├─ Read cached beach state and plans
 ├─ Show Agent Activity trace
 └─ Subscribe to notifications
             │
             ▼
Next.js API / bounded Agents SDK run
 ├─ CoastOrchestrator (GPT-5.6)
 ├─ strict typed tools
 ├─ guardrails
 └─ built-in tracing
             │
     ┌───────┼──────────┐
     ▼       ▼          ▼
Postgres   Data      Notification
state      adapters   provider
             ▲
             │
Cron trigger every 30 minutes
(Vercel Cron for demo or Contabo cron later)
```

An invocation processes a bounded run and exits. It never sleeps for 30 minutes.
Persistent watchers and the next scheduled trigger live in the database. This makes
the loop serverless-safe and resumable.

## 4. The AJÒ loop

### 4.1 Trigger

A run starts from one of five typed events:

- `mission.created` or `mission.updated`;
- `coast.refresh_due` every 30 minutes;
- `camera.frame_changed` after a perceptual-hash threshold;
- `community.signal_received`;
- `watch.threshold_crossed`.

Each event includes an idempotency key. Duplicate cron requests cannot create duplicate
plans or notifications.

### 4.2 Observe

The orchestrator requests only the evidence necessary for the active mission and its
candidate coast. Tools return structured observations:

```ts
type Observation<T> = {
  value: T | null;
  source: string;
  observedAt: string;
  expiresAt: string;
  confidence: number;
  status: "fresh" | "stale" | "unknown";
};
```

Core tools:

- `get_weather_snapshot`
- `get_marine_snapshot`
- `get_bathing_water_status`
- `get_environmental_awards_and_protection`
- `get_access_and_capacity_rules`
- `get_cached_camera_observation`
- `get_community_signals`
- `get_active_mission`

The model does not browse arbitrary pages during a run. Adapters control provenance,
timeouts, caching and licensing.

### 4.3 Derive and rank

Deterministic code produces explainable coastal signals before the model plans:

- **Beach Pulse** — combined beach suitability for the selected mission;
- **Arrival Risk** — crowd evidence, access capacity, parking reports and time of day;
- **Posidonia Shorecast** — recent wave direction, onshore wind, beach sensitivity and
  verified community observations;
- **Sea Truth** — coherence and freshness of weather, marine, camera and human signals;
- **Water Confidence** — official bathing status, sample age, long-term EU class and
  any active prohibition, kept distinct from environmental awards;
- **Sand Sting** — wind strength and direction relative to beach orientation;
- **Ride Window** — skill-aware surf/kite window with gust spread and exposure;
- **Beach Life Arc** — beach, golden hour, travel and nearby experience compatibility.

`rank_candidates` returns three to five candidates with score components, exclusions
and evidence freshness. GPT-5.6 may choose and explain only from this shortlist.

### 4.4 Plan

The orchestrator produces a strict `MissionPlan`:

```ts
type MissionPlan = {
  missionId: string;
  version: number;
  primarySpotId: string;
  fallbackSpotId: string;
  arrivalWindow: { start: string; end: string };
  leaveBy: string;
  experienceSteps: string[];
  evidence: Array<{ signal: string; value: string; confidence: number }>;
  assumptions: string[];
  watchers: WatchRule[];
  userMessage: string;
};
```

The output schema rejects missing fallback, evidence or watch rules. The user sees a
decisive recommendation plus what AJÒ is watching, not a vague list of beaches.

### 4.5 Act

Allowed actions are narrow:

- persist a new plan version;
- activate or update watch rules;
- append a concise activity record;
- queue a notification when policy allows it.

The first contest slice does not book, purchase or contact a third party.

### 4.6 Watch and replan

After acting, the run exits. A later event reloads the mission and compares the new
snapshot with the plan's watch rules. Replanning requires a meaningful threshold,
not ordinary forecast noise.

Examples:

- crowd state changes from quiet to busy with medium/high confidence;
- parking risk becomes high before the leave-by time;
- gust spread exceeds the skill-aware limit;
- the primary window loses suitability by more than 12 points;
- a fresh verified Posidonia report conflicts with the chosen shoreline.

Notifications use a content hash, minimum confidence and cooldown. The message states
what changed, the evidence time and the fallback action.

### 4.7 Recover

Every tool has a timeout, bounded retry and circuit-breaker policy. Failure behavior:

1. use a still-valid cached observation;
2. label stale evidence and lower confidence;
3. exclude metrics that cannot be supported;
4. use the curated demo snapshot only in explicit demo mode;
5. persist the failure in the trace without blocking the PWA.

AJÒ never turns "camera unavailable" into "beach empty".

## 5. Model and cost policy

Use the model where judgment adds value; use code where arithmetic and policy are
stable.

| Stage | Default implementation | Model call |
|---|---|---|
| Weather/marine ingestion | Provider adapters + cache | No |
| Metric derivation/ranking | TypeScript rules | No |
| Camera change detection | perceptual hash | No |
| Changed camera frame | GPT-5.6 Luna, strict JSON | Only shortlisted frames |
| Mission planning/replanning | GPT-5.6 via Agents SDK | Only on event/threshold |
| PWA page load | cached database state | No |

Budget rails per run:

- a deterministic zero-call gate runs before any agent invocation;
- one planning run, maximum two model turns and six typed tool calls;
- recovery uses the deterministic/cached fallback by default instead of another call;
- camera analysis only if a frame changed materially and the beach is shortlisted;
- no model call for unchanged watchers;
- store and reuse camera and coastal observations;
- every call requires an atomic `BudgetGovernor` reservation;
- hard daily per-model call and owner-defined spend caps, failing closed into explicit
  `credit-saver` mode.

The expected scheduled run is therefore zero-token: refresh providers, calculate
signals, compare thresholds, persist `no_op` and exit. AI is used only when the stored
decision would materially change. See `docs/AI-BUDGET.md` for the complete contract.

Do not use Gemini or DeepSeek in the submitted decision path. A single OpenAI stack
makes the contest implementation and traces unambiguous.

## 6. State and storage

Minimum persistent tables:

- `missions`: profile, permissions, status and active plan version;
- `coast_snapshots`: normalized observations by beach and time;
- `camera_observations`: frame hash, structured result and provenance;
- `community_signals`: reporter trust, observation and expiry;
- `plans`: immutable versioned agent output;
- `watch_rules`: threshold, cooldown and last-fired state;
- `agent_runs`: trigger, trace id, tools, outcome, usage and failure class;
- `notification_log`: idempotency hash and delivery result.

Mission lifecycle:

```text
draft → active → watching → replanning → watching → completed
                  ↘ expired / cancelled
```

For the demo, Supabase Postgres is sufficient. Keep service credentials server-side;
the browser receives only row-level-authorized data.

## 7. Guardrails

- Validate mission and tool arguments with strict schemas.
- Reject unsupported beaches, impossible time windows and unknown enum values.
- Treat community input as untrusted data, never as instructions.
- Require corroboration or high reporter trust before a community signal forces a
  replan.
- Do not infer identity, age, ethnicity or other sensitive traits from webcam frames.
- Persist aggregate crowd bands, never faces or person-level tracking.
- Show observation time and confidence for derived claims.
- For surf/kite, detect skill mismatch and redirect to local schools/authorities.
- Require explicit opt-in for push notifications and allow immediate disablement.

## 8. Observable agent UX

The home screen stays outcome-first. A judge can expand **Agent Activity** to see:

1. why the loop woke up;
2. which sources and timestamps it observed;
3. which typed tools ran;
4. how many candidates the deterministic engine compared;
5. which decision changed and why;
6. which watch was armed;
7. token usage and whether cached data avoided a call.

This is decision evidence, not chain-of-thought. It makes the agentic implementation
visible in the three-minute demo.

## 9. Evaluation contract

Start with traces during development, then promote representative traces into a small
versioned dataset. Grade the real runtime path, not a separate prompt-only mock.

Required scenarios:

| Scenario | Expected behavior |
|---|---|
| Maestrale exposes the west coast | choose a protected candidate or explain a sport-specific exception |
| Camera shows busy and parking signals worsen | increase Arrival Risk and offer fallback before departure |
| Camera is stale/unavailable | never state a current crowd level |
| Community reports conflict | lower confidence; avoid forced replan without corroboration |
| Posidonia accumulation is plausible | disclose it as a forecast with evidence, not a fact |
| Gust spread is unsafe for profile | reject or warn and recommend local verification |
| Provider and OpenAI fail | serve cached/degraded plan with visible freshness |
| Same threshold fires twice | deduplicate the notification during cooldown |

Graders:

- correct tool selection and bounded call count;
- evidence provenance and freshness;
- schema-valid plan with a feasible fallback;
- no unsupported safety or crowd claims;
- appropriate replan versus no-op decision;
- notification idempotency;
- latency, token usage and cache hit rate.

The contest gate is 100% on safety/provenance cases and at least 90% overall on the
curated scenario set.

## 10. Codex development loop

Codex is the software-development agent; the Agents SDK powers the product runtime.
For every vertical slice:

1. read this file and the repository `AGENTS.md`;
2. plan the smallest end-to-end behavior;
3. implement strict tools and deterministic logic before model instructions;
4. add a scenario eval and failure path;
5. run lint, build and focused tests;
6. inspect the UI and agent trace;
7. review the diff for secrets, licensing and unsupported claims;
8. record the Codex collaboration in the README/Devpost narrative.

Create a reusable Codex skill only when a workflow repeats and its contract has
stabilized. Candidate later skill: `ajo-domain-eval`, which generates and validates
coastal scenario fixtures.

## 11. Contest vertical slice

The submission does not need every Sardinian beach. It needs one undeniable closed
loop:

1. create a Relax, Surf, Kite or Beach Life mission;
2. AJÒ calls tools and produces a primary plan plus fallback;
3. a scheduled or simulated observation crosses a threshold;
4. AJÒ replans and sends a deduplicated notification;
5. Agent Activity shows the complete trace and cost-aware decisions;
6. an eval proves the same behavior is repeatable.

This slice demonstrates thoughtful GPT-5.6 usage, substantial Codex collaboration,
technical depth, user experience and a Sardinia-specific impact story without betting
the demo on a large production data estate.
