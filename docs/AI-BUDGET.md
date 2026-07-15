# AJÒ Beach — AI usage and budget policy

Updated: 15 July 2026

## Product position

AJÒ is not a chatbot. Users consume stored beach intelligence and agent decisions; they do not receive an unrestricted prompt box and do not directly trigger arbitrary model calls.

## Event-driven pipeline

1. Fetch weather, marine, access and community data every 30 minutes without an LLM.
2. Rank the whole island deterministically, then inspect cameras only for the active missions and top candidate/fallback beaches—not every beach.
3. Capture authorized camera frames during daylight and compare each frame with the previous one using a cheap perceptual hash.
4. Skip AI analysis when the scene has not changed materially.
5. Use `gpt-5.6-luna` with low reasoning and strict structured output for changed-camera observations.
6. Compute derived metrics and thresholds in deterministic TypeScript.
7. Invoke the `gpt-5.6` agent only when a meaningful threshold changes, a high-confidence community signal arrives, or a mission must be replanned.
8. Store normalized observations, metrics, explanations and plans. Every PWA page view reads stored data and costs zero model tokens.

## Guardrails

- Signed internal update endpoints; never expose a public “run AI” endpoint without rate limits.
- Daylight-only camera analysis.
- Per-camera cache of at least 30 minutes.
- Maximum daily camera analyses and replans configured by environment variables.
- Short prompts, resized frames and compact JSON output.
- No model call for formatting, sorting, basic scores or ordinary page navigation.
- Credit-saver demo remains available if the daily budget is reached.
- Log request count, reason, model and token usage without logging secrets or private images.

## Budget governor

Every model run in the contest slice passes through one server-side `BudgetGovernor`
before contacting OpenAI; application code does not call the SDK outside the bounded
orchestrator.

The governor checks:

- global daily call ceiling;
- per-mission and per-account cooldown;
- maximum turns and token limits for the requested operation;
- whether an equivalent cached result is still valid.

If reservation fails, AJÒ immediately returns cached or deterministic output. Budget
exhaustion is not an error to retry. The UI labels the result `credit-saver` and keeps
the core experience working.

For this serverless demo, the application counter/cache is best-effort per warm
instance. The OpenAI project spend limit is the true deployment-wide hard backstop.
Production would move reservations to durable atomic storage (for example Postgres or
Redis) before anonymous Live AI access is enabled.

Recommended contest defaults:

| Control | Default |
|---|---:|
| Scheduled refresh AI calls | 0 unless a meaningful threshold crossed |
| Sol model turns per planning/replan run | 2 maximum |
| Recovery model turns | 0 by default; deterministic fallback |
| Sol output tokens per turn | 500 maximum |
| Camera observation output tokens | 180 maximum |
| Camera analysis TTL | 2 hours unless scene changes materially |
| Per-user mission AI cooldown | 60 minutes |
| Notification/replan cooldown | 90 minutes per mission and reason |
| Daily Sol and Luna calls | explicit low environment caps; fail closed if unset in production |
| Daily euro/dollar spend | owner-defined hard ceiling; fail closed if unset in production |

The public PWA must not give every anonymous visitor a fresh paid run. Anonymous users
receive the deterministic/cached plan; an authenticated or judge-demo flow may request
one budgeted AI mission under rate limits. The demo can also replay a stored trace at
zero cost while retaining one controlled live-run button.

## Zero-call decision gate

Before the budget governor is consulted, deterministic code asks all of the following:

1. Is there an active mission affected by this observation?
2. Is the new observation fresh and sufficiently confident?
3. Did a material metric cross its hysteresis threshold?
4. Would the resulting action differ from the stored plan?
5. Is the event outside its cooldown and deduplication window?

If any answer is no, the run records a `no_op` trace and exits with zero model calls.
Hysteresis prevents normal forecast noise from repeatedly crossing the same boundary.

## Credit-efficient call shape

- Precompute shortlist, scores and compact evidence in TypeScript.
- Send only the active mission, three candidates and changed evidence—not the full
  beach catalogue or raw forecast history.
- Keep one strict tool turn plus one final structured-output turn.
- Reuse stable system instructions with prompt caching where supported.
- Resize/crop authorized camera frames to the configured beach region before upload.
- Never ask a model to rewrite text that can be rendered from stored structured fields.

## Contest provider decision

The judged deployment uses OpenAI only. Gemini is not needed for the contest build: third-party services may be allowed when properly licensed, but the official project requirement calls for Codex and GPT-5.6, and judging explicitly rewards thoughtful GPT-5.6 use.

After the contest, another provider could be evaluated as a non-default fallback. It should not be present in the submitted architecture or Devpost story.

## Model roles

- **GPT-5.6 Luna** — high-volume, cost-sensitive image observation with structured output.
- **GPT-5.6 Sol (`gpt-5.6`)** — sparse agent orchestration, explanation and mission replanning.
- **Deterministic engine** — all repeatable scoring, aggregation, confidence decay, access pressure and notification thresholds.

Official model guidance: <https://developers.openai.com/api/docs/models>
