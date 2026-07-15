"use client";

import { useEffect, useMemo, useState } from "react";
import { Pavoncella } from "@/app/components/Pavoncella";
import { CoastIcon, CoastIconName } from "@/app/components/CoastIcon";
import { BeachMap } from "@/app/components/BeachMap";
import { ForecastTrends } from "@/app/components/ForecastTrends";
import { PlaceExperience } from "@/app/components/PlaceExperience";
import { buildDemoPlan, Profile } from "@/lib/engine";
import { MISSION_LABELS, Mission, SPOTS } from "@/lib/spots";

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

const missionIcons: Record<Mission, CoastIconName> = { relax: "relax", life: "spark", surf: "surf", kite: "kite" };

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
  const [islandWeather, setIslandWeather] = useState({ temperature: 29, apparentTemperature: 31, uvIndex: 7, windSpeed: 13, waveHeight: 0.5, source: "DEMO" });

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
        const parsed = JSON.parse(savedPlan) as Plan;
        if (!parsed.top?.signals) throw new Error("Outdated saved mission");
        setPlan(parsed);
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
          <span className="logo-seal"><Pavoncella /></span>
          <span className="brand-copy"><span className="brand-mark">AJÒ</span><span className="brand-sub">SARDINIA, IN SYNC</span></span>
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
          <p className="eyebrow">YOUR SARDINIAN BEACH COMPANION</p>
          <h1>Don’t search beaches.<br /><em>Give AJÒ a mission.</em></h1>
          <p className="lede">AJÒ plans your day, watches the island and changes course before the wind does.</p>
          <div className="weather-strip">
            <span><CoastIcon name="sun"/><b>{islandWeather.temperature}°</b> Cagliari</span>
            <span><CoastIcon name="wind"/><b>{islandWeather.windSpeed} kt</b> Poetto wind</span>
            <span><CoastIcon name="wave"/><b>{islandWeather.waveHeight.toFixed(1)} m</b> South swell</span>
            <span><CoastIcon name="sun"/><b>UV {islandWeather.uvIndex.toFixed(1)}</b>{islandWeather.uvIndex >= 8 ? "Very high" : "Sun exposure"}</span>
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

      <BeachMap spots={SPOTS} mission={profile.mission} onMissionChange={(mission) => setProfile({ ...profile, mission })} />

      <section className="mission-panel" id="mission">
        <div className="section-heading">
          <div><p className="eyebrow dark">01 · SET THE MISSION</p><h2>What kind of day?</h2></div>
          <label className="ai-toggle" title="Refresh the recommendation with a fresh analysis">
            <input type="checkbox" checked={useAI} onChange={(event) => setUseAI(event.target.checked)} />
            <span /> {useAI ? "FRESH ANALYSIS" : "INSTANT PREVIEW"}
          </label>
        </div>

        <div className="mission-grid">
          {(Object.keys(MISSION_LABELS) as Mission[]).map((mission) => {
            const item = MISSION_LABELS[mission];
            return (
              <button key={mission} className={`mission-card ${profile.mission === mission ? "selected" : ""}`} onClick={() => setProfile({ ...profile, mission })}>
                <span className="mission-icon"><CoastIcon name={missionIcons[mission]} /></span>
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
            <div><p className="eyebrow dark">02 · YOUR BEST MATCH</p><h2>Your island window</h2></div>
            <span className={`mode-badge ${plan.mode.includes("live") ? "live" : ""}`}>{plan.mode.includes("live") ? "FRESH CONDITIONS" : "PREVIEW CONDITIONS"}</span>
          </div>

          <article className="hero-result" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,39,33,.92) 0%, rgba(10,39,33,.56) 56%, rgba(10,39,33,.12) 100%), url(${plan.top.image})` }}>
            <div className="score-ring"><b>{plan.top.score}</b><span>MISSION<br/>FIT</span></div>
            <div className="result-copy">
              <p className="result-label">BEST MOVE · {plan.window}</p>
              <h3>{plan.top.name}</h3>
              <p>{plan.summary}</p>
              <div className="conditions-row"><span><CoastIcon name="wind"/> {plan.top.windSpeed} kt · {plan.top.gusts} gusts</span><span><CoastIcon name="wave"/> {plan.top.waveHeight.toFixed(1)} m · {plan.top.wavePeriod}s</span><span><CoastIcon name="water"/> {plan.top.seaTemperature}° water</span></div>
              <strong>{plan.departure}</strong>
            </div>
            <a className="photo-credit" href={plan.top.imageSource} target="_blank" rel="noreferrer">REAL {plan.top.name.toUpperCase()} · {plan.top.imageCredit}</a>
          </article>

          <section className="coast-deck" aria-label={`${plan.top.name} coastal intelligence`}>
            <div className="coast-deck-heading">
              <div><p className="eyebrow dark">COASTAL INTELLIGENCE</p><h3>The whole beach, at a glance.</h3></div>
              <div className="provenance-key"><span><i className="source-live"/> CURRENT</span><span><i className="source-derived"/> ESTIMATE</span><span><i className="source-camera"/> CAMERA PREVIEW</span></div>
            </div>

            <div className="signal-grid">
              <article className="signal-card"><CoastIcon name="wind" className="signal-icon"/><span className="signal-source live">LIVE</span><small>WIND · GUSTS</small><strong>{plan.top.windSpeed} <i>kt</i></strong><p>Gusts {plan.top.gusts} kt · direction {plan.top.windDirection}°</p></article>
              <article className="signal-card"><CoastIcon name="wave" className="signal-icon"/><span className="signal-source live">LIVE</span><small>SEA STATE</small><strong>{plan.top.waveHeight.toFixed(1)} <i>m</i></strong><p>{plan.top.wavePeriod}s period · local verification advised</p></article>
              <article className="signal-card"><CoastIcon name="water" className="signal-icon"/><span className="signal-source live">LIVE</span><small>WATER · AIR</small><strong>{plan.top.seaTemperature}° <i>water</i></strong><p>{plan.top.temperature}° air · feels {plan.top.apparentTemperature}°</p></article>
              <article className="signal-card uv-card"><CoastIcon name="sun" className="signal-icon"/><span className="signal-source live">LIVE</span><small>UV INDEX</small><strong>{plan.top.uvIndex.toFixed(1)} <i>{plan.top.uvIndex >= 8 ? "very high" : plan.top.uvIndex >= 6 ? "high" : "moderate"}</i></strong><div className="meter"><i style={{ width: `${Math.min(100, plan.top.uvIndex / 11 * 100)}%` }}/></div><p>{plan.top.uvIndex >= 8 ? "Seek shade 11:00–16:00 · SPF 50+" : "Protection recommended around midday"}</p></article>
              <article className="signal-card heat-card"><CoastIcon name="thermometer" className="signal-icon"/><span className="signal-source live">LIVE</span><small>HEAT STRESS</small><strong>{plan.top.apparentTemperature}° <i>feels like</i></strong><div className="meter"><i style={{ width: `${Math.min(100, Math.max(0, (plan.top.apparentTemperature - 20) / 24 * 100))}%` }}/></div><p>{plan.top.apparentTemperature >= 38 ? "Extreme heat · water, shade and shorter exposure" : plan.top.apparentTemperature >= 32 ? "High heat · hydrate and plan shade" : "Comfortable with normal precautions"}</p></article>
              <article className="signal-card crowd"><CoastIcon name="crowd" className="signal-icon"/><span className="signal-source camera">CAMERA PREVIEW</span><small>CROWDING</small><strong>{plan.top.signals.crowding.label}</strong><div className="meter"><i style={{ width: `${plan.top.signals.crowding.score}%` }}/></div><p>{plan.top.signals.crowding.score}/100 · {plan.top.signals.crowding.confidence}% reliability</p></article>
              <article className="signal-card parking"><CoastIcon name="parking" className="signal-icon"/><span className="signal-source derived">ESTIMATE</span><small>PARKING</small><strong>{plan.top.signals.parking.label}</strong><div className="meter"><i style={{ width: `${plan.top.signals.parking.score}%` }}/></div><p>{plan.top.signals.parking.detail}</p></article>
              <article className="signal-card posidonia"><CoastIcon name="leaf" className="signal-icon"/><span className="signal-source derived">ESTIMATE</span><small>POSIDONIA RISK</small><strong>{plan.top.signals.posidonia.label}</strong><div className="meter"><i style={{ width: `${plan.top.signals.posidonia.score}%` }}/></div><p>{plan.top.signals.posidonia.detail}</p></article>
            </div>

            <ForecastTrends spot={plan.top} />

            <article className="camera-agent-card">
              <div className="camera-orbit" aria-hidden="true"><CoastIcon name="camera"/><i/><i/></div>
              <div className="camera-copy">
                <div className="camera-title"><p className="card-label">BEACH SNAPSHOT · EVERY 30 MIN</p><span>PREVIEW</span></div>
                <h3>{plan.top.webcam.coverage === "direct" ? plan.top.webcam.label : `Nearest view · ${plan.top.webcam.label}`}</h3>
                <p>See how busy the shore feels before you leave. AJÒ checks a single privacy-friendly snapshot for useful crowding, shoreline and access hints.</p>
                <div className="camera-facts">
                  <span><b>LAST</b>{new Date(plan.top.signals.camera.observedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                  <span><b>NEXT</b>{new Date(plan.top.signals.camera.expiresAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                  <span><b>RELIABILITY</b>{plan.top.signals.camera.confidence}%</span>
                  <span><b>PRIVACY</b>{plan.top.signals.camera.retention}</span>
                </div>
              </div>
              <a className="camera-link" href={plan.top.webcam.url} target="_blank" rel="noreferrer">OPEN LIVE CAM <b>↗</b><small>{plan.top.webcam.coverage === "direct" ? "Direct beach view" : "Nearest coastal view"}</small></a>
            </article>
            <p className="data-note">Weather and sea values: {plan.top.source === "live" ? <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">current Open‑Meteo conditions ↗</a> : "preview conditions"}. Crowding, parking and Posidonia are helpful estimates—always check locally.</p>
          </section>

          <PlaceExperience spot={plan.top} />

          <div className="decision-grid consumer-reasons">
            <div className="why-card">
              <p className="card-label">WHY AJÒ CHOSE IT</p>
              {plan.top.reasons.map((reason) => <div className="reason" key={reason}><i>✓</i><span>{reason}</span></div>)}
              <div className="risk"><b>Local check</b><span>{plan.top.risk}</span></div>
            </div>
          </div>

          <div className={`watch-card ${watching ? "armed" : ""}`}>
            <div className="alert-icon"><CoastIcon name="bell"/></div>
            <div className="watch-copy"><p className="card-label">SMART BEACH ALERTS</p><h3>{watching ? `We’re keeping ${plan.top.name} fresh.` : "Want AJÒ to protect this choice?"}</h3><p>{watching ? `You’ll hear from us only if ${plan.watch.trigger}, with ${plan.watch.fallback} ready as your backup.` : "We’ll check the few things that can spoil the plan and notify you only when another beach becomes the better move."}</p><div className="watch-signals"><span><CoastIcon name="wind"/>Wind</span><span><CoastIcon name="wave"/>Sea</span><span><CoastIcon name="crowd"/>Crowding</span><span><CoastIcon name="parking"/>Parking</span></div></div>
            <button onClick={watching ? simulateChange : armWatch} disabled={replanning}>{replanning ? "Updating…" : watching ? "Preview an update" : "Turn on smart alerts"}</button>
          </div>

          {alert && (
            <div className="replan-card">
              <div className="replan-icon">!</div>
              <div><p className="eyebrow">CONDITIONS CHANGED · BETTER OPTION FOUND</p><h3>{replanFrom} → {plan.top.name}</h3><p>{plan.changedBecause || "Wind increased earlier than expected"}. AJÒ kept the day you wanted and found a better fit.</p></div>
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
        <p className="agentic-claim">SARDINIA’S FULLY AGENTIC BEACH COMPANION · DOZENS OF COASTAL SIGNALS, ONE SIMPLE CHOICE.</p>
        <a className="blue-zone-note" href="https://www.bluezones.com/explorations/sardinia-italy/" target="_blank" rel="noreferrer">
          <span>THE FIRST IDENTIFIED BLUE ZONE</span>
          Sardinia taught the world that a good life is a system of movement, environment, rhythm and community. AJÒ brings that whole-system thinking to the coast. ↗
        </a>
      </section>

      <footer><div className="footer-brand"><span className="logo-seal"><Pavoncella /></span><div className="brand-mark">AJÒ</div></div><p>Your best Sardinian beach day, beautifully simple.</p><button onClick={install}>Install the PWA ↧</button></footer>
    </main>
  );
}
