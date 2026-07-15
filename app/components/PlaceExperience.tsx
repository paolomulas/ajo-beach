"use client";

import { useState } from "react";
import { CoastIcon, CoastIconName } from "@/app/components/CoastIcon";
import type { RankedSpot } from "@/lib/engine";
import { SPOT_DETAILS } from "@/lib/spots";

const activityIcons: Record<string, CoastIconName> = { snorkel: "water", paddle: "wave", hike: "location", food: "spark", family: "relax", ride: "surf" };

export function PlaceExperience({ spot }: { spot: RankedSpot }) {
  const details = SPOT_DETAILS[spot.id];
  const [added, setAdded] = useState<string[]>([]);
  return (
    <section className="place-experience">
      <div className="place-heading"><div><p className="eyebrow dark">KNOW THE PLACE</p><h2>More than a beach.</h2></div><span><CoastIcon name="location"/>{details.zone} · {spot.area}</span></div>
      <div className="place-grid">
        <article className="place-story"><p className="card-label">{spot.name.toUpperCase()}</p><h3>A local read before you go.</h3><p>{details.description}</p><div className="place-chips"><span>☀ {spot.temperature}° now</span><span>Ⓟ {spot.signals.parking.label}</span><span>✦ {details.services.split(",")[0]}</span></div></article>
        <article className="beach-facts"><p className="card-label">BEACH CHARACTER</p><div><CoastIcon name="wave"/><span><b>Shore</b>{details.surface}</span></div><div><CoastIcon name="water"/><span><b>Sea entry</b>{details.seabed}</span></div><div><CoastIcon name="sun"/><span><b>Exposure</b>{details.exposure}</span></div><div><CoastIcon name="spark"/><span><b>Services</b>{details.services}</span></div></article>
      </div>
      <div className="activities-heading"><div><p className="card-label">NEARBY EXPERIENCES</p><h3>Build the rest of the day.</h3></div><p>AJÒ combines the beach with the rhythm around it—not only surf and kite.</p></div>
      <div className="activity-grid">{details.activities.map((activity, index) => { const isAdded = added.includes(activity.title); return <article key={activity.title} className={`activity-card activity-${index + 1} ${isAdded ? "added" : ""}`}><span><CoastIcon name={activityIcons[activity.kind]}/></span><small>{details.zone.toUpperCase()}</small><h3>{activity.title}</h3><p>{activity.subtitle}</p><button onClick={() => setAdded((current) => isAdded ? current.filter((item) => item !== activity.title) : [...current, activity.title])}>{isAdded ? "ADDED TO MY DAY" : "ADD TO MY DAY"}<b>{isAdded ? "✓" : "＋"}</b></button></article>; })}</div>
    </section>
  );
}
