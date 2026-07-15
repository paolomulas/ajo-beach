# AJÒ Beach — three-minute judging demo

The goal is to make the product, agent behavior and Codex collaboration obvious without
turning the video into an architecture lecture.

## 0:00–0:25 — The problem and Sardinian hook

Open on the island hero.

> In Sardinia, “best beach” is the wrong question. Maestrale, swell, access, skill and
> the purpose of the day can make the right coast change in an hour. AJÒ does not give
> you another list. Give it a mission and it takes responsibility for preserving the day.

Mention that Sardinia is the first identified Blue Zone and one of the five original
regions. Use it as a systems-thinking metaphor—environment, movement, rhythm and
community—not as a medical claim.

## 0:25–1:05 — A polished product, not a prompt box

Choose **Beach day**, Cagliari, 70 minutes, Family. Turn on **Fresh analysis** only for the
recorded controlled run and press **AJÒ, plan my day**.

Point out the single recommendation, timed window, leave-by time, local safety check and
two feasible fallbacks. Do not narrate every weather value.

> The ranking is deterministic and inspectable. GPT‑5.6 owns the judgment and
> communication, but it can only choose from the typed tool output.

## 1:05–1:35 — Show depth without exposing machinery in the product

Stay in the consumer UI: show coastal intelligence, the thirty-minute beach snapshot,
the dense island map and one community observation. Do not show trace, token or model
telemetry inside the application.

Cut briefly to the Devpost architecture visual while narrating the implementation:

> Under the product, an OpenAI Agents SDK run is capped at two turns: one typed tool
> call and one structured decision. Equivalent missions are cached for thirty minutes,
> and ordinary refreshes cost zero model calls.

Briefly show the repository eval result: nine tests passing. Then return immediately to
the product experience.

## 1:35–2:15 — The wow moment: heartbeat and recovery

Press **Arm watch**, then **Simulate change**.

> The app receives a typed wind-threshold event. AJÒ invalidates the original assumption,
> re-ranks viable spots and creates plan version 2 while preserving the user’s mission.

Pause on the orange `Solanas → Su Giudeu` recovery card and the system notification.
Emphasize that normal thirty-minute refreshes are deterministic zero-token no-ops;
the model wakes only if the action would materially change.

## 2:15–2:42 — Why Codex mattered

Show the architecture document, eval file and production UI in a quick three-panel cut.

> Codex helped us research the international market, turn the gap into a product thesis,
> implement the runtime, write evals, inspect real Chrome layouts and iterate to a
> production build. The feedback loop is specification → code → eval → browser → trace.

Avoid saying “Codex wrote everything.” Show the human decisions: domain framing,
licensing boundaries, safety policy and the choice to stay with one orchestrator until
evals justify more agents.

## 2:42–3:00 — Close on impact

> Weather apps show data. Travel apps show places. AJÒ takes responsibility for the day.
> It starts in Sardinia, but the architecture can protect any coastal mission where
> weather, access and reality change faster than a static score.

End on the installable PWA and the pavoncella mark.

## Evaluation lens covered

- **Technical implementation:** bounded Agents SDK loop, typed tools, plan versions,
  tracing, token governor and evals.
- **Design and UX:** outcome-first mobile experience, visible commitments and recovery.
- **Potential impact:** a reusable decision layer over fragmented coastal evidence.
- **Idea quality:** Sardinian domain identity changes the product logic rather than only
  its visual theme.

## Factual references

- Build Week criteria and judges: <https://openai.com/build-week/>
- Sardinia and the original Blue Zones: <https://www.bluezones.com/exploration/>
- Sardinia as the first identified region: <https://www.bluezones.com/explorations/sardinia-italy/>
- Codex agent-first feedback loops: <https://openai.com/index/harness-engineering/>
- OpenClaw remains open and independent: <https://steipete.me/posts/2026/openclaw>
