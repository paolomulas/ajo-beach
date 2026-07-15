"use client";

import { useEffect, useMemo, useState } from "react";
import { Pavoncella } from "@/app/components/Pavoncella";
import { buildDemoPlan, Profile } from "@/lib/engine";
import { MISSION_LABELS, Mission } from "@/lib/spots";

type Plan = ReturnType<typeof buildDemoPlan> & {
  mode: string;
  missionId?: string;
  version?: number;
  generatedAt?: string;
  traceId?: string;
  usage?: { requests: number; inputTokens: number; outputTokens: number; totalTokens: number };
  budget?: { runs: number; cap: number; remaining: number };
  changedBecause?: string;
};
type DeferredInstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const defaultProfile: Profile = {
  mission: "relax",
  origin: "Cagliari",
  level: "intermediate",
  family: true,
  accessible: false,
  maxDrive: 70,
};

export default function Home() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [useAI, setUseAI] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [watching, setWatching] = useState(false);
  const [alert, setAlert] = useState(false);
  const [replanning, setReplanning] = useState(false);
  const [replanFrom, setReplanFrom] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<DeferredInstallPrompt | null>(null);
  const [islandWeather, setIslandWeather] = useState({ temperature: 29, windSpeed: 13, waveHeight: 0.5, source: "DEMO" });

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setShowSplash(false), 1150);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
    fetch("/api/conditions")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        const current = data.conditions?.poetto;
        if (current) setIslandWeather({ ...current, source: "LIVE" });
      })
      .catch(() => undefined);
    const restoreTimer = window.setTimeout(() => {
      const savedPlan = window.localStorage.getItem("ajo-active-mission");
      if (!savedPlan) return;
      try {
        setPlan(JSON.parse(savedPlan) as Plan);
        setWatching(true);
      } catch {
        window.localStorage.removeItem("ajo-active-mission");
      }
    }, 0);
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as DeferredInstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.clearTimeout(splashTimer);
      window.clearTimeout(restoreTimer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    if (plan) window.localStorage.setItem("ajo-active-mission", JSON.stringify(plan));
  }, [plan]);

  const loadingLabels = useMemo(() => [
    "Reading your mission",
    "Checking wind & swell",
    "Comparing Sardinian coasts",
    "Building your weather watch",
  ], []);

  async function createPlan() {
    setLoading(true);
    setPlan(null);
    setAlert(false);
    setWatching(false);
    setStage(0);
    const timer = window.setInterval(() => setStage((current) => Math.min(3, current + 1)), 520);
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, useAI }),
      });
      const data = await response.json();
      setPlan(data);
    } catch {
      setPlan(buildDemoPlan(profile));
    } finally {
      window.clearInterval(timer);
      setStage(3);
      window.setTimeout(() => setLoading(false), 320);
    }
  }

  async function armWatch() {
    setWatching(true);
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }

  async function simulateChange() {
    if (!plan || replanning) return;
    setReplanning(true);
    const previousSpot = plan.top.name;
    let nextPlan = plan;
    try {
      const response = await fetch("/api/agent/replan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          useAI,
          missionId: plan.missionId || `local-${Date.now()}`,
          version: plan.version || 1,
          event: { type: "wind-spike", spotId: plan.top.id, severity: "high", observedAt: new Date().toISOString() },
        }),
      });
      if (!response.ok) throw new Error("Replan failed");
      nextPlan = await response.json() as Plan;
      setReplanFrom(previousSpot);
      setPlan(nextPlan);
      setAlert(true);
    } finally {
      setReplanning(false);
    }
    if ("serviceWorker" in navigator && "Notification" in window && Notification.permission === "granted") {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("AJÒ — the wind changed", {
        body: `Switch from ${previousSpot} to ${nextPlan.top.name}. The mission remains inside your constraints.`,
        icon: "/icon.svg",
        tag: "ajo-replan",
      });
    }
  }

  async function install() {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    } else {
      window.alert("On iPhone: Share → Add to Home Screen. On Android: browser menu → Install app.");
    }
  }

  return (
    <main>
      {showSplash && (
        <div className="app-splash" role="status" aria-label="AJÒ is waking up">
          <Pavoncella className="splash-bird" />
          <strong>AJÒ</strong>
          <span>SARDINIA, IN SYNC</span>
        </div>
      )}
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AJÒ home">
          <span className="brand-mark">AJÒ</span>
          <span className="brand-sub">SARDINIA, IN SYNC</span>
        </a>
        <div className="header-actions">
          <span className="live-pill"><i /> {islandWeather.source} ISLAND</span>
          <button className="icon-button" onClick={install} aria-label="Install AJÒ">↧</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="hero-copy">
          <p className="eyebrow">YOUR BEACH DAY AGENT</p>
          <h1>Don’t search beaches.<br /><em>Give AJÒ a mission.</em></h1>
          <p className="lede">AJÒ plans your day, watches the island and changes course before the wind does.</p>
          <div className="weather-strip">
            <span><b>{islandWeather.temperature}°</b> Cagliari</span>
            <span><b>{islandWeather.windSpeed} kt</b> Poetto wind</span>
            <span><b>{islandWeather.waveHeight.toFixed(1)} m</b> South swell</span>
          </div>
        </div>
        <div className="island-art" aria-hidden="true">
          <div className="sardinia-shape" />
          <i className="map-marker marker-north" />
          <i className="map-marker marker-west" />
          <i className="map-marker marker-south" />
          <div className="wind-lines">⌁⌁⌁</div>
        </div>
      </section>

      <section className="mission-panel" id="mission">
        <div className="section-heading">
          <div><p className="eyebrow dark">01 · SET THE MISSION</p><h2>What kind of day?</h2></div>
          <label className="ai-toggle" title="Use one GPT-5.6 agent run">
            <input type="checkbox" checked={useAI} onChange={(event) => setUseAI(event.target.checked)} />
            <span /> {useAI ? "LIVE GPT‑5.6" : "CREDIT-SAVER DEMO"}
          </label>
        </div>

        <div className="mission-grid">
          {(Object.keys(MISSION_LABELS) as Mission[]).map((mission) => {
            const item = MISSION_LABELS[mission];
            return (
              <button key={mission} className={`mission-card ${profile.mission === mission ? "selected" : ""}`} onClick={() => setProfile({ ...profile, mission })}>
                <span className="mission-icon">{item.icon}</span>
                <span><b>{item.title}</b><small>{item.subtitle}</small></span>
                <i>{profile.mission === mission ? "●" : "○"}</i>
              </button>
            );
          })}
        </div>

        <div className="constraints">
          <label><span>Starting from</span><select value={profile.origin} onChange={(event) => setProfile({ ...profile, origin: event.target.value })}><option>Cagliari</option><option>Oristano</option><option>Olbia</option></select></label>
          <label><span>Max drive</span><select value={profile.maxDrive} onChange={(event) => setProfile({ ...profile, maxDrive: Number(event.target.value) })}><option value="40">40 min</option><option value="70">70 min</option><option value="120">2 hours</option><option value="240">Whole island</option></select></label>
          {(profile.mission === "surf" || profile.mission === "kite") && <label><span>Your level</span><select value={profile.level} onChange={(event) => setProfile({ ...profile, level: event.target.value as Profile["level"] })}><option>beginner</option><option>intermediate</option><option>expert</option></select></label>}
          {(profile.mission === "relax" || profile.mission === "life") && <div className="chip-row"><button className={profile.family ? "active" : ""} onClick={() => setProfile({ ...profile, family: !profile.family })}>{profile.mission === "life" ? "Local mood" : "Family"}</button><button className={profile.accessible ? "active" : ""} onClick={() => setProfile({ ...profile, accessible: !profile.accessible })}>{profile.mission === "life" ? "Easy evening" : "Accessible"}</button></div>}
        </div>

        <button className="primary-cta" onClick={createPlan} disabled={loading}>
          <span>{loading ? loadingLabels[stage] : "AJÒ, plan my day"}</span><b>{loading ? "···" : "→"}</b>
        </button>
        <p className="safety-note">Forecasts are indicative. For surf and kite, always verify locally and respect restrictions.</p>
      </section>

      {loading && (
        <section className="agent-working">
          <div className="agent-pulse" aria-label="AJÒ is planning">
            <Pavoncella className="loader-bird" />
          </div>
          <div>{loadingLabels.map((label, index) => <p key={label} className={index <= stage ? "done" : ""}><i>{index < stage ? "✓" : index === stage ? "•" : "○"}</i>{label}</p>)}</div>
        </section>
      )}

      {plan && !loading && (
        <section className="plan-section">
          <div className="section-heading plan-heading">
            <div><p className="eyebrow dark">02 · AGENT DECISION</p><h2>Your island window</h2></div>
            <span className={`mode-badge ${plan.mode.includes("live") ? "live" : ""}`}>{plan.mode.includes("live") ? "GPT‑5.6 LIVE" : "DEMO MODE"}</span>
          </div>

          <article className="hero-result" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,39,33,.92) 0%, rgba(10,39,33,.56) 56%, rgba(10,39,33,.12) 100%), url(${plan.top.image})` }}>
            <div className="score-ring"><b>{plan.top.score}</b><span>MISSION<br/>FIT</span></div>
            <div className="result-copy">
              <p className="result-label">BEST MOVE · {plan.window}</p>
              <h3>{plan.top.name}</h3>
              <p>{plan.summary}</p>
              <div className="conditions-row"><span>⌁ {plan.top.windSpeed} kt</span><span>≈ {plan.top.waveHeight.toFixed(1)} m</span><span>☀ {plan.top.temperature}°</span></div>
              <strong>{plan.departure}</strong>
            </div>
            <a className="photo-credit" href={plan.top.imageSource} target="_blank" rel="noreferrer">REAL {plan.top.name.toUpperCase()} · {plan.top.imageCredit}</a>
          </article>

          <div className="decision-grid">
            <div className="why-card">
              <p className="card-label">WHY AJÒ CHOSE IT</p>
              {plan.top.reasons.map((reason) => <div className="reason" key={reason}><i>✓</i><span>{reason}</span></div>)}
              <div className="risk"><b>Local check</b><span>{plan.top.risk}</span></div>
            </div>
            <div className="agent-log">
              <p className="card-label">AGENT ACTIVITY</p>
              {plan.activity.map((item, index) => <div className="log-row" key={`${item}-${index}`}><i>{index + 1}</i><span>{item}</span></div>)}
              <div className="agent-telemetry">
                <span>TRACE <b>{plan.traceId === "deterministic" ? "LOCAL" : plan.traceId?.slice(-8) || "LOCAL"}</b></span>
                <span>MODEL REQUESTS <b>{plan.usage?.requests || 0}</b></span>
                <span>TOKENS <b>{plan.usage?.totalTokens || 0}</b></span>
              </div>
            </div>
          </div>

          <div className={`watch-card ${watching ? "armed" : ""}`}>
            <div className="radar"><i/><i/><b>⌁</b></div>
            <div><p className="card-label">03 · STAY IN SYNC</p><h3>{watching ? plan.watch.label : "Let AJÒ watch the island"}</h3><p>{watching ? `AJÒ will react when ${plan.watch.trigger}.` : "Arm a lightweight weather watch and get one useful notification—not a stream of noise."}</p></div>
            <button onClick={watching ? simulateChange : armWatch} disabled={replanning}>{replanning ? "Replanning…" : watching ? "Simulate change" : "Arm watch"}</button>
          </div>

          {alert && (
            <div className="replan-card">
              <div className="replan-icon">!</div>
              <div><p className="eyebrow">CONDITIONS CHANGED · PLAN v{plan.version || 2}</p><h3>{replanFrom} → {plan.top.name}</h3><p>{plan.changedBecause || "Wind increased earlier than expected"}. AJÒ preserved the mission and switched to the safer fit.</p></div>
              <button onClick={() => setAlert(false)}>Accept switch →</button>
            </div>
          )}

          <div className="alternatives">
            <div className="section-heading"><div><p className="eyebrow dark">BACKUP PLANS</p><h2>Still inside your mission</h2></div></div>
            <div className="alternative-grid">
              {plan.alternatives.map((spot, index) => (
                <article key={spot.id} className="alternative-card">
                  <div className="alt-image" style={{ backgroundImage: `url(${spot.image})` }}><span>0{index + 2}</span><b>{spot.score}% fit</b><a href={spot.imageSource} target="_blank" rel="noreferrer" aria-label={`Photo credit for ${spot.name}`}>REAL PHOTO ↗</a></div>
                  <div><h3>{spot.name}</h3><p>{spot.note}</p><small>{spot.drive} min · {spot.windSpeed} kt · {spot.waveHeight.toFixed(1)} m</small></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="manifesto">
        <p className="eyebrow">BORN IN SARDINIA</p>
        <h2>Weather apps show data.<br/>Travel apps show places.<br/><em>AJÒ takes responsibility for the day.</em></h2>
        <div className="agent-loop"><span>OBSERVE</span><b>→</b><span>PLAN</span><b>→</b><span>ACT</span><b>→</b><span>WATCH</span><b>→</b><span>RECOVER</span></div>
        <a className="blue-zone-note" href="https://www.bluezones.com/explorations/sardinia-italy/" target="_blank" rel="noreferrer">
          <span>THE FIRST IDENTIFIED BLUE ZONE</span>
          Sardinia taught the world that a good life is a system of movement, environment, rhythm and community. AJÒ brings that whole-system thinking to the coast. ↗
        </a>
      </section>

      <footer><div className="brand-mark">AJÒ</div><p>Built with GPT‑5.6 + Codex for OpenAI Build Week.</p><button onClick={install}>Install the PWA ↧</button></footer>
    </main>
  );
}
