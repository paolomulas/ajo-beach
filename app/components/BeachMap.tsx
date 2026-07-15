"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CoastIcon } from "@/app/components/CoastIcon";
import { MISSION_LABELS, Mission, Spot } from "@/lib/spots";

const MAP_BOUNDS = { west: 8.05, east: 9.85, north: 41.35, south: 38.75 };

function positionFor(spot: Spot) {
  return {
    left: `${((spot.lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100}%`,
    top: `${((MAP_BOUNDS.north - spot.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100}%`,
  };
}

export function BeachMap({ spots, mission, onMissionChange }: { spots: Spot[]; mission: Mission; onMissionChange: (mission: Mission) => void }) {
  const [selectedId, setSelectedId] = useState("su-giudeu");
  const selected = useMemo(() => spots.find((spot) => spot.id === selectedId) || spots[0], [selectedId, spots]);

  return (
    <section className="map-explorer" aria-label="Explore Sardinian beaches on the map">
      <div className="map-heading">
        <div><p className="eyebrow dark">EXPLORE THE ISLAND</p><h2>Find your coast.</h2></div>
        <div className="map-filters" aria-label="Filter beaches by mission">
          {(Object.keys(MISSION_LABELS) as Mission[]).map((item) => <button key={item} className={mission === item ? "active" : ""} onClick={() => onMissionChange(item)}>{MISSION_LABELS[item].title}</button>)}
        </div>
      </div>
      <div className="map-stage">
        <div className="map-sea-lines" aria-hidden="true"><i/><i/><i/></div>
        <div className="island-map-layer" aria-label="Map of curated Sardinian beaches">
          <div className="island-map-shape" aria-hidden="true" />
          {spots.map((spot) => (
            <button
              key={spot.id}
              className={`beach-marker ${spot.id === selected.id ? "selected" : ""} ${spot.missions.includes(mission) ? "mission-match" : ""}`}
              style={positionFor(spot)}
              onClick={() => setSelectedId(spot.id)}
              aria-label={`Open ${spot.name}`}
            ><span/><b>{spot.name}</b></button>
          ))}
        </div>
        <article className="map-spot-card">
          <div className="map-spot-image"><Image src={selected.image} alt="" fill sizes="112px" /></div>
          <div className="map-spot-copy"><span>{selected.area} · Sardinia</span><h3>{selected.name}</h3><p>{selected.note}</p><div><b>{selected.drive} min</b><b>{selected.missions.map((item) => MISSION_LABELS[item].title).join(" · ")}</b></div></div>
          <a href={selected.webcam.url} target="_blank" rel="noreferrer"><CoastIcon name="camera"/> Live view <b>↗</b></a>
        </article>
        <div className="map-hint"><span/><b>Best for {MISSION_LABELS[mission].title}</b><small>Tap a beach to explore</small></div>
      </div>
    </section>
  );
}
