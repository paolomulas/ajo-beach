"use client";

import { useState } from "react";
import { CoastIcon } from "@/app/components/CoastIcon";

const SIGNALS = [
  ["crowding", "Crowding", "crowd"],
  ["parking", "Parking", "parking"],
  ["posidonia", "Posidonia", "leaf"],
  ["water_clarity", "Water clarity", "water"],
  ["jellyfish", "Jellyfish", "wave"],
  ["clean_and_clear", "Clean & clear", "spark"],
] as const;

type Signal = typeof SIGNALS[number][0];
type Severity = "low" | "medium" | "high";

export function CommunityReport({ beachId, beachName }: { beachId: string; beachName: string }) {
  const [open, setOpen] = useState(false);
  const [signal, setSignal] = useState<Signal>("crowding");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [reportId, setReportId] = useState<string | null>(null);

  function submit() {
    const now = new Date();
    const report = {
      id: crypto.randomUUID(), beachId, signal, severity,
      observedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      source: "community-demo", confidence: 55,
    };
    const previous = JSON.parse(localStorage.getItem("ajo-community-reports") || "[]") as unknown[];
    localStorage.setItem("ajo-community-reports", JSON.stringify([...previous.slice(-19), report]));
    setReportId(report.id);
  }

  return (
    <section className={`community-report ${open ? "open" : ""}`} aria-label={`Report conditions at ${beachName}`}>
      <div className="community-intro">
        <span className="community-orbit"><CoastIcon name="crowd" /></span>
        <div><p className="eyebrow dark">COMMUNITY PULSE</p><h3>What do you see at {beachName}?</h3><p>Share a recent observation to help make the next beach choice better.</p></div>
        <button onClick={() => { setOpen(!open); setReportId(null); }}>{open ? "Close" : "Report conditions"}</button>
      </div>
      {open && !reportId && <div className="report-form">
        <div className="report-signals">{SIGNALS.map(([id, label, icon]) => <button key={id} className={signal === id ? "active" : ""} onClick={() => setSignal(id)}><CoastIcon name={icon}/><span>{label}</span></button>)}</div>
        <div className="severity-row"><span>Intensity</span>{(["low", "medium", "high"] as Severity[]).map((item) => <button key={item} className={severity === item ? "active" : ""} onClick={() => setSeverity(item)}>{item}</button>)}<button className="submit-report" onClick={submit}>Send observation →</button></div>
        <p className="report-privacy">Saved only on this device · expires after 3 hours · never treated as an official safety notice.</p>
      </div>}
      {reportId && <div className="report-success"><b>✓ Observation recorded</b><span>REPORT ID · {reportId.slice(0, 8).toUpperCase()}</span><p>Thank you. AJÒ looks for matching observations before using a community update.</p></div>}
    </section>
  );
}
