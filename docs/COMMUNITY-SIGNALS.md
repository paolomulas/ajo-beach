# AJÒ Signals — trusted, expiring beach reports

Updated: 15 July 2026

## Product decision

- Browsing, planning and installing the PWA never require an account.
- Sign in with Google is requested only when someone sends a report, confirms another report or saves personal missions.
- Request only basic identity scopes (`openid`, email and profile). AJÒ never asks for Gmail access.
- A Google account verifies an account, not the truth of a report. Truth confidence is built from independent evidence.

## The interaction

The feature is called **AJÒ Signals** with the action **Send a coast signal**.

A person at or approaching a beach can report in a few taps:

- crowd: quiet / balanced / busy / saturated;
- parking: easy / filling / nearly full / full;
- access: open / queue / booking problem / closed;
- Posidonia: none / ashore / at the waterline / in the water;
- jellyfish: none seen / a few / many;
- water clarity: clear / mixed / murky;
- wind and blown-sand discomfort;
- services: parking, toilets, lifeguard, kiosk or rental open/closed;
- surf/kite reality check;
- optional photo.

Reports are operational signals, not social posts. They expire automatically—normally after 2 hours, sooner for parking and crowding—and feed the agent's next decision.

## Confidence, not “certification”

Each signal may earn these independent proofs:

- **Account confirmed** — authenticated Google account.
- **On-site confirmed** — coarse device location was near the beach at submission time; precise location is discarded.
- **AI corroborated** — an optional photo supports the selected category.
- **Camera corroborated** — an authorized webcam observation agrees.
- **Community corroborated** — recent independent reports agree.

The public UI shows the evidence and a confidence band: low, medium or high. It never exposes the reporter's email or exact location.

## Agentic differentiator

AJÒ does not display a passive review feed. A new signal can trigger an agent action:

1. Observe a new high-confidence crowd, parking or access report.
2. Compare it with the webcam, forecast and current plan.
3. Estimate whether the user will still arrive before saturation.
4. Keep the plan, recommend leaving earlier, or switch to the fallback beach.
5. Explain exactly which live signals caused the change.

After the planned visit, AJÒ asks only: **“Did the coast match the plan?”** The answer becomes an evaluation record for recommendation quality, separate from public reports.

## Anti-abuse and privacy

- Maximum three reports per account per hour.
- One active report per beach/category/account inside a 30-minute window.
- Aggregate public output; no public user profiles are needed for the contest.
- No face recognition, person tracking or identity inference from photos/webcams.
- Strip image metadata and delete raw report photos after the short verification window unless the user explicitly consents to longer retention.
- Keep a private reliability score based on past corroboration, not popularity or follower counts.
- Row-level database policies: users can create and view their own raw reports; everyone else reads only aggregates.

## Free contest architecture

- **Vercel Hobby** — Next.js PWA and API routes at `ajo-beach.vercel.app`.
- **Supabase Free** — Google authentication, Postgres reports, row-level security and optional short-lived photo storage.
- **Contabo cron** — one signed call every 30 minutes for camera refresh because Vercel Hobby cron is daily-only.
- **OpenAI Responses API** — optional photo/webcam corroboration and agent replanning; deterministic code computes confidence and expiry.

Supabase Free is sufficient for a contest demo but may pause after one week of inactivity. Keep it active during the judging period or move the tiny reports table to the existing Contabo database later.

## Minimal schema

`reports`

- `id`, `beach_id`, `user_id`, `category`, `value`
- `created_at`, `expires_at`
- `on_site_confirmed`, `ai_corroborated`, `camera_corroborated`
- `confidence`, `status`
- optional private `photo_path`; never include email or precise coordinates

`report_aggregates`

- `beach_id`, `category`, `value`, `confidence`
- `signals_count`, `observed_at`, `expires_at`

`mission_outcomes`

- `mission_id`, `recommended_beach_id`, `visited_beach_id`
- `matched_plan`, `reason`, `created_at`
