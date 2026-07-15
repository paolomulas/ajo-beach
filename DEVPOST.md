# Devpost submission copy

## Project name

AJÒ Beach

## Elevator pitch

An installable AI beach agent that plans, watches and replans your Sardinian beach day as wind, waves and personal constraints change.

## Inspiration

In Sardinia, choosing a beach is not simply a search problem. The right coast changes with the Maestrale, swell, time of day, mobility and what you want from the sea. Existing products expose maps and scores. We wanted an agent that takes responsibility for preserving the intent of the day.

“Ajò” is the Sardinian invitation to move: come on, let’s go.

Sardinia is not decorative scenery for this project. The term “Blue Zone” grew from
longevity research in Sardinian mountain communities, and the island became the first
identified Blue Zone before the idea expanded to five original regions worldwide.
Those communities are understood as whole systems of environment, natural movement,
daily rhythm and social connection. AJÒ borrows that systems lens—not as a health
claim, but as a product principle: a great coastal day is also more than one score.

## State of the art and the gap we found

Before building, we compared coastal products and public services across California,
Hawaii, Florida, Australia, Portugal, Greece, Spain, Mexico and the Mediterranean.
The strongest products are excellent specialists: surf cameras and forecasts; official
hazards and lifeguard coverage; bathing-water provenance; beach occupancy; public
access; accessibility; or community reports about seaweed and beach conditions.

Across the products we reviewed, we did not find one experience that closes the whole
personal decision loop: understand why someone is going to the coast, create a timed
plan, expose the evidence and its freshness, monitor the assumptions, and switch to a
feasible fallback when reality changes. AJÒ is designed around that missing layer.
Instead of presenting more coastal data, it protects the user's objective as the coast
changes.

Our benchmark and the resulting original metrics—including Crowd Trajectory, Sea
Reality Gap, Access Integrity, Posidonia Shorecast and Plan Resilience—are documented
in the public repository with their provenance, confidence and safety boundaries.

## What it does

The user gives AJÒ a mission: a relaxed family beach day, a beach-to-sunset local experience, a surf window or a kitesurf session. AJÒ evaluates travel time, skill, accessibility, wind, gusts, waves and coast exposure. It creates a timed plan, explains the decision and arms a condition watch. When conditions change, it proposes a new spot while preserving the original constraints.

The app is a mobile-first PWA, works in credit-saver demo mode and exposes a Live GPT‑5.6 mode for the judged agent path.

## How we built it

AJÒ was executed end to end inside one continuous Codex workspace. No application
source code was manually written or edited outside Codex. From the first empty project
to the production-ready PWA, Codex synthesized the international benchmark, inspected
competitors, designed the architecture and interface, implemented the runtime, managed
dependencies, wrote scenario evals, ran API smoke tests, inspected real desktop and
mobile Chrome renders, produced the documentation and prepared the release.

The division of responsibility was deliberate. The human founder supplied the original
idea, Sardinian domain knowledge, creative direction, product taste, competitor leads,
feature priorities and approvals. Codex turned that intent into research, decisions,
code and verified artifacts. In short: **human-led vision; Codex-executed product**.

This was more than using Codex for code completion. The complete build loop stayed in
Codex: **intent → research → specification → implementation → eval → browser → trace →
revision**. The project itself is therefore also a working demonstration of the contest
thesis—how far one creator can move from idea to shipped product by supervising an
agent instead of manually operating every engineering tool.

The repository shows that collaboration rather than merely claiming it: product thesis
and agent instructions live beside the code; each runtime slice ends in typecheck,
scenario evals, production build and real-browser inspection. The result is a small
feedback harness where humans define intent and safety boundaries while Codex executes,
tests and helps refine the shipped artifact.

AJÒ is an event-driven agentic system, not a collection of agents created for a diagram.
One Coast Orchestrator uses GPT‑5.6 with strict typed tools. Deterministic TypeScript
retrieves, normalizes and scores weather, marine, access and community evidence; a
bounded visual observer is used only for materially changed, authorized camera frames.
The orchestrator makes the final mission decision, persists watch rules and replans
only when a meaningful threshold is crossed. A specialist handoff is introduced only
if a trace-based eval proves that it improves the result.

The submitted agent path uses GPT‑5.6 through the OpenAI Agents SDK. GPT‑5.6 must call
the Zod-typed `rank_sardinian_spots` tool; deterministic TypeScript calculates mission
fit from structured data, while the model makes and communicates the final plan. Each
run is capped at two turns, returns a strict output schema, exports a privacy-safe trace
and exposes request/token usage in the UI. A typed change event creates plan version 2
through the same runtime, with deterministic recovery if the API or budget is unavailable.

The interface displays the agent’s activity rather than hiding the workflow. A service worker provides the installable shell, and Web Notifications demonstrate the watch-and-recover loop.

The closest mental model is a coastal heartbeat, not a chatbot. AJÒ wakes for a typed
event, observes only relevant evidence, acts through narrow tools, persists a plan
version and exits. The next wake-up normally produces a traceable no-op; a consequential
change produces one bounded replan. This keeps autonomy useful, observable and cheap.

## Agentic loop and credit efficiency

AJÒ runs `trigger → observe → derive → plan → act → watch → replan`. The scheduled
30-minute refresh normally uses zero model tokens: adapters refresh cached evidence,
TypeScript derives signals, and a zero-call gate exits when the active decision would
not change. GPT‑5.6 is reserved for a new mission or a consequential replan, with a
hard budget governor, short structured outputs, cooldowns and a deterministic
credit-saver fallback. Page views never trigger model calls.

This constraint made the product more agentic, not less: the system must decide when
reasoning is valuable and when the correct action is a traceable no-op.

## Challenges

The hardest product decision was avoiding “AI as a paragraph on top of a beach score.” We separated objective calculation from agent judgment, built an inspectable scoring tool and made replanning—not search—the central interaction. We also designed a deterministic fallback so the experience remains testable when network or API credit is limited.

The second challenge was making an international market claim responsibly. We use the
benchmark to describe the reviewed landscape and the integration gap we observed; we
do not claim that no comparable experiment can exist. We also keep forecasts,
observations and official safety information visually and technically distinct.

## Accomplishments

- A complete agent loop in a coherent mobile product
- Relax, Surf and Kitesurf missions with explicit skill constraints
- Bounded OpenAI Agents SDK loop with strict GPT‑5.6 tool calling
- Installable and offline-capable PWA
- Versioned replanning, trace/usage telemetry and notifications
- Six automated scenario/invariant evals with deterministic zero-cost execution
- A Sardinian identity that is functional, not decorative

## What we learned

Agentic UX needs visible commitments. Users should see what the agent checked, what it decided, what it is monitoring and when it needs approval. For risk-bearing sports, keeping calculations deterministic and recommendations cautious is more valuable than making the model sound certain.

We also learned that multi-agent is not automatically more agentic. A small number of
bounded components, typed tools, persistent state, recovery behavior and evaluated
decisions produce a stronger system than many named agents with unclear ownership.

## What’s next

Live marine forecasts, official beach access notices, school-verified surf and kite safety data, opt-in community reality checks from photos, and a production push-notification scheduler.

## Category

Apps for Your Life
