# AJÒ Beach — Codex working agreement

## Product goal

Build a contest-ready, installable Sardinian beach PWA that turns weather, marine,
access, camera and community observations into a complete beach mission. The product
is an active coastal companion, not a weather dashboard and not a general chatbot.

## Architecture rules

- Use one coast orchestrator first. Add specialist agents only when an eval proves
  that a bounded specialist or handoff improves reliability.
- Every production run is bounded and event-driven. Never keep an infinite agent loop
  alive inside a Vercel invocation.
- Keep facts and scores deterministic where possible. The model plans and explains;
  typed tools retrieve observations and calculate candidates.
- Every observation carries `source`, `observedAt`, `expiresAt` and `confidence`.
- Keep awards, official bathing status and environmental proxies separate. A missing
  Blue Flag is neutral, while an official bathing prohibition overrides every score.
- Never invent live weather, crowding, parking, webcam or safety information.
- Surf and kitesurf output is advisory. Never promise safety; recommend local and
  official verification when risk is material.
- Store decisions and concise evidence, never hidden chain-of-thought.
- Apply a candidate funnel before AI vision or reasoning. Use cached results and call
  models only after a meaningful trigger.
- Treat the OpenAI credit ceiling as a hard product invariant. A `BudgetGovernor`
  must atomically approve every model call; failure or exhaustion falls back to the
  deterministic engine without retrying around the limit.
- No third-party scraping or copied datasets without documented permission. Demo data
  must be clearly labeled.
- Side effects such as notifications require user opt-in, deduplication and cooldowns.

## Repository map

- `app/`: Next.js App Router UI and server routes.
- `app/api/agent/route.ts`: current prototype decision run.
- `lib/engine.ts`: deterministic ranking and resilient demo plan.
- `lib/spots.ts`: curated demo beach catalogue.
- `docs/AGENTIC-ARCHITECTURE.md`: target runtime design and eval contract.
- `docs/AI-BUDGET.md`: model-call and caching policy.

## Commands

- Install: `pnpm install`
- Develop: `pnpm dev`
- Lint: `pnpm lint`
- Production build: `pnpm build`

## Definition of done

- Lint and production build pass.
- Agent changes include or update scenario evals.
- Ordinary 30-minute refreshes make zero model calls when no meaningful state changed.
- Tool inputs and outputs use strict schemas.
- Failure paths expose stale/unknown state instead of fabricated certainty.
- No secrets, private data or unlicensed competitor data enter the repository.
- UI remains useful from cached state when OpenAI or a data provider is unavailable.
- The Devpost demo can expose the trigger, tools, evidence, decision and resulting
  watch without exposing private reasoning.

## How to prompt Codex in this repository

For non-trivial changes state: goal, relevant paths/context, constraints, and the
observable definition of done. Ask for a plan first when a change spans runtime,
storage and UI. Turn a repeated repository workflow into a skill only after it has
stabilized.
