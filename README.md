# AJÒ Beach

**The right coast, right now.**

AJÒ is an installable beach-day agent born in Sardinia. Instead of returning a directory or a generic weather score, AJÒ accepts a mission, compares conditions with personal constraints, builds a plan, watches it and replans when the island changes.

Built for the **OpenAI Build Week 2026** with Codex and GPT‑5.6.

## Built end to end with Codex

The application was executed from idea to production-ready artifact inside one
continuous Codex workspace; no application source code was manually written or edited
outside Codex. The human founder provided the Sardinian insight, creative direction,
product judgment and approvals. Codex performed research synthesis, architecture,
implementation, dependency management, evals, API verification, real-browser QA and
release documentation: **human-led vision; Codex-executed product**.

## Why AJÒ is different

Most beach apps answer: “Which beach has the highest score?” AJÒ answers a harder question: “How do I preserve this person’s day as weather, timing and constraints change?”

The product follows a visible agent loop:

1. **Observe** — understand a Relax, Surf or Kitesurf mission.
2. **Plan** — call a transparent ranking tool over weather, exposure, skill and travel constraints.
3. **Act** — create a timed beach plan and departure window.
4. **Watch** — arm a lightweight condition monitor.
5. **Recover** — replan while preserving the original mission.

## OpenAI implementation

- **Codex** was used to research the challenge, turn product constraints into the working application, implement the scoring engine and PWA, and run build plus browser QA.
- **GPT‑5.6** runs through the OpenAI Agents SDK. A bounded `CoastOrchestrator` must invoke the Zod-typed `rank_sardinian_spots` tool before returning a structured decision.
- **Open‑Meteo** provides live weather and marine conditions through a server-only adapter with a 15-minute cache and attribution.
- The tool, not the model, calculates fit and safety signals. GPT‑5.6 interprets the shortlist and communicates a concise mission.
- Credit-saver mode keeps the complete product testable without an API call. Live AI mode is capped at two model turns, exports a privacy-safe trace, reports token usage, caches equivalent missions for 30 minutes and safely falls back if the API is unavailable.

## Features

- Relax, Beach Life, Surf and Kitesurf mission profiles
- Sardinian spot shortlist with transparent mission-fit score
- Skill, accessibility, family and drive-time constraints
- GPT‑5.6 function calling and visible agent activity
- Versioned weather watch and a real one-tap replan endpoint
- Visible trace ID, request count and token usage (decision evidence, not chain-of-thought)
- Daily run cap, per-mission cooldown, cache and deterministic recovery
- Installable PWA with offline shell and notifications
- Responsive mobile-first interface

## Run locally

Requirements: Node.js 22+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Add `OPENAI_API_KEY` to `.env.local` to enable Live AI mode. Use `OPENAI_MODEL=gpt-5.6-sol`; demo mode requires no key.

Production verification:

```bash
pnpm lint
pnpm test
pnpm build
pnpm start
```

## Safety and scope

AJÒ is a contest prototype. Forecasts and sport suitability are indicative, not safety guarantees. Surf and kitesurf users must verify conditions with local schools, authorities and official notices. The included spot dataset is deliberately small and editorially curated for the demo.

## Stack

Next.js 16, React 19, TypeScript, OpenAI Agents SDK, Zod, Vitest, service worker and Web Notifications.

The contest slice stores the active mission in browser local storage and keeps the budget/cache state in the warm serverless instance. A production rollout would move those records and atomic quotas to a durable store; the OpenAI project spend limit remains the deployment-wide backstop.

Live environmental data: Open‑Meteo, CC BY 4.0, with attribution.

## License

MIT for original source code. Third-party photos are loaded remotely from Unsplash for prototype presentation and are not redistributed in this repository.
