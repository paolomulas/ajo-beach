# Global beach-app benchmark and AJÒ opportunities

Updated: 15 July 2026

## Executive finding

The strongest products specialise in one layer: Surfline in visual surf conditions,
Beachsafe and Hawaii Ocean Safety in hazards, Florida BCRS in on-site observations,
Portugal and California in official water-quality provenance, MyCoast in civic access,
and CoastSnap in citizen science.

Very few close the loop from a personal objective to a timed plan, monitor that plan
and replan when evidence changes. That orchestration gap is AJÒ's defensible contest
position.

## International benchmark

| Product / region | Best capability | Lesson for AJÒ |
|---|---|---|
| Surfline / California and global | Live Smart Cam plus a distinct forecast-based visual preview | Separate observed reality from forecast imagery and label both unambiguously. |
| Beachsafe / Australia | Coast-wide patrol status, hazards, facilities, weather, swell and tide | A beach is suitable only if supervision, hazards and facilities match the user. |
| Hawaii Ocean Safety | Lifeguarded beach schedules and frequently refreshed hazard conditions | Build a supervised-swim window, not a generic all-day safety badge. |
| BCRS / Florida | Near-real-time flags, crowds, respiratory irritation, dead fish, surf and amenities | Operational and biological nuisance signals matter as much as weather. |
| InfoÁgua / Portugal | Official water analyses, current alerts, access instability, erosion, lifeguards and accessibility | Preserve source, sample date and official status; model the complete access chain. |
| Swim Guide / multiple countries | Sampling authority, applicable standard, timestamp and historical pass rate | Provenance and freshness should be first-class UI, not hidden in a disclaimer. |
| Beach Report Card / US West Coast | Simple grades over a large official monitoring history | Translate complex measurements into clear status while keeping the evidence accessible. |
| MyCoast / Greece | Concession map and structured reports for blocked public/disabled access, cleanliness and missing lifeguards | Treat access to the coast as a live civic condition, not static metadata. |
| Canarias InfoPlayas / Spain | Bathing flag and low/medium/high occupancy in one public map | Crowd and official bathing status should be immediately comparable across alternatives. |
| Beachday / global | Community crowd, seaweed, clarity, cleanliness, vibe and short visual updates | Ask for structured, expiring observations rather than long reviews. |
| CoastSnap / Australia and global | Repeat photos from fixed viewpoints converted into shoreline-change evidence | Give community photography a scientific protocol and a long-term purpose. |
| Sargassum Monitoring / Mexican Caribbean | Beach traffic light and short-horizon seaweed arrival outlook | A nuisance forecast becomes valuable when it triggers a timely alternative beach. |

### Sources and scope

- Surfline Forecast Cam: <https://support.surfline.com/hc/en-us/articles/45987797516443-Forecast-Cam>
- Surf Life Saving Australia Beachsafe: <https://beachsafe.org.au/apps>
- Hawaii Ocean Safety: <https://oceansafety.hawaii.gov/>
- Florida BCRS store listing: <https://play.google.com/store/apps/details?id=org.visitbeaches.bcrsv2>
- Portugal InfoÁgua: <https://infoagua.apambiente.pt/en/about>
- Swim Guide: <https://www.theswimguide.org/get-the-app/>
- Heal the Bay Beach Report Card: <https://healthebay.org/category/brc-location-for-home-page-panel/>
- Greek government MyCoast: <https://www.gov.gr/ipiresies/polites-kai-kathemerinoteta/kataggelies/MyCoast_app/>
- Canarias public beach map: <https://www3.gobiernodecanarias.org/aplicaciones/infoplayas/webmap>
- Beachday product description: <https://beachday.com/blogs/news/best-beach-app-2026-real-time-conditions>
- CoastSnap: <https://www.coastsnap.com/>
- Sargassum Monitoring: <https://sargassummonitoring.com/en/forecast-sargassum-mexico-riviera-maya/>

Marketing claims from commercial products are treated as feature descriptions, not
independently verified performance. AJÒ must not copy proprietary data or scoring.

## Recommended original implementations

### 1. Crowd Trajectory

Answer: **When will this beach probably become saturated?**

Fuse current crowd band, frame-to-frame change, historical weekday curve, access quota,
parking signals and drive time. Return `stable`, `filling`, `rapidly_filling` or
`easing`, with a confidence band and predicted useful-arrival cutoff.

Agent action: leave earlier, keep the plan, or switch to the fallback before the user
starts driving.

### 2. Supervised Swim Window

Answer: **During which part of my visit is lifeguard coverage expected and official
bathing status compatible?**

Combine seasonal lifeguard schedule, current official flags/closures, beach access
hours and the proposed itinerary. Never convert missing official information into a
safety guarantee.

Agent action: move the swimming portion inside the supervised interval while keeping
aperitivo or walking outside it.

### 3. Access Integrity

Answer: **Can the public realistically reach and use the shore today?**

Combine reservation/quota status, official closures, unstable paths, works, reported
blocked access, parking access and concession boundaries. Inspired by MyCoast, but
focused on immediate trip feasibility rather than legal enforcement.

Agent action: exclude an inaccessible candidate or ask for a structured on-site signal.

### 4. Sea Reality Gap

Answer: **How far is the lived beach from the forecast?**

Compare forecast clouds, whitecaps, shore break and visibility with an authorized
camera observation and recent trusted reports. This extends `Sea Truth` with a change
score and explicit contradictions.

Agent action: increase monitoring frequency or replan when reality diverges materially.

### 5. Water Confidence

Answer: **How current and decision-useful is the official bathing-water information?**

Show the official result, sampling authority, sample age, historical pass rate and
active notices. Recent heavy rain/runoff can lower confidence and recommend checking
official updates, but must never replace or falsify a laboratory result.

Agent action: preserve the official classification while explaining freshness and
selecting a better-supported alternative when appropriate.

### 6. Access-to-Water Chain

Answer: **Is the whole visit accessible, not merely the car park?**

Model reserved parking, surface and slope, walkway reach, adapted toilets/showers,
shade, assistance schedule, amphibious chair availability and compatible sea-entry
conditions.

Agent action: build an accessibility-first mission and never recommend a nominally
accessible beach when a critical link is unavailable.

### 7. Marine Nuisance Radar

Generalise Posidonia without diluting its Sardinian identity. Structured, expiring
signals cover Posidonia location, jellyfish, mucilage/foam, floating debris, poor
clarity and blown sand. Each nuisance has separate provenance and uncertainty.

Agent action: change the swimming cove, the time window or the mission activity rather
than merely lowering a generic beach score.

### 8. Coast Steward Missions

Use a CoastSnap-style fixed-view photo guide. The pavoncella leads a 20-second
`Snap the coast` contribution: align the horizon silhouette, take one photo and choose
one or two structured signals. Over time the same view supports shoreline, usable-sand
and Posidonia comparisons.

Agent action: request a contribution only when evidence is stale and the user is on
site; reward data quality rather than social popularity.

### 9. Plan Fragility

Answer: **How many things must remain true for this plan to work?**

Calculate forecast uncertainty, evidence freshness, access dependencies and travel cost
to fallbacks. A beautiful recommendation with no nearby alternative should visibly
score as fragile.

Agent action: arm stricter watchers for fragile plans and precompute the fallback.

### 10. Quiet Coast Routing

Offer a lower-pressure alternative when the famous destination is saturated, while
respecting protected zones, access rules and local capacity. Do not expose secluded or
ecologically sensitive locations that authorities do not promote for visitation.

Agent action: distribute arrivals across compatible, authorized beaches and explain the
small tradeoff in scenery, driving or services.

## What not to promise in the contest

- **AI rip-current detection:** valuable research exists, but visual detection remains
  safety-critical and difficult across viewpoints. Show official warnings and marine
  conditions; do not claim AJÒ can certify the absence of a rip current.
- **Exact people counts:** use aggregate crowd bands and usable-space estimates.
- **Live parking availability without a valid source:** call it pressure or likelihood.
- **Automatic identification of jellyfish species from distant webcams:** accept a
  nuisance report with confidence, not a biological diagnosis.
- **Official enforcement reports:** AJÒ may structure community access signals, but
  should link to the competent authority rather than impersonate it.

## Contest prioritisation

### P0 — build and demonstrate

1. `Crowd Trajectory` feeding `Arrival Risk` and a leave-by time.
2. `Sea Reality Gap` from one authorized or clearly labelled demo frame.
3. `Access Integrity` plus a primary/fallback decision.
4. One high-confidence `AJÒ Signal` that triggers a bounded replan and notification.
5. Agent Activity trace showing evidence freshness, tool calls, decision and no-op/replan.

### P1 — highly visible if time permits

1. `Supervised Swim Window` using curated or official demo metadata.
2. `Access-to-Water Chain` for at least one genuinely accessible beach.
3. `Marine Nuisance Radar` combining Posidonia and jellyfish reports.
4. Guided pavoncella `Snap the coast` contribution.

### Later production work

- official partnerships for cameras, capacity and parking;
- expanded water-quality adapters and alerts;
- historical calibration of crowd trajectories;
- coast-steward datasets and municipal dashboards;
- controlled experiments for specialist agents only where evals justify them.

## Three-minute demo narrative

1. A family asks for a calm and accessible beach morning near Cagliari.
2. AJÒ chooses a beach, supervised window, leave-by time and fallback.
3. A new camera/community event changes the crowd trajectory and access confidence.
4. The agent wakes, checks only the relevant tools, replans and sends one explanation.
5. The user sees the fallback plus the exact evidence age and confidence.
6. The judge opens Agent Activity and sees the bounded loop, cache savings and eval pass.

This narrative combines the best international patterns while showing the missing
agentic layer: AJÒ does not merely display the coast; it protects the user's objective
as the coast changes.
