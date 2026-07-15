"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CoastIcon } from "@/app/components/CoastIcon";
import { MISSION_LABELS, Mission, SPOT_DETAILS, Spot } from "@/lib/spots";

const MAP_BOUNDS = { west: 8.05, east: 9.85, north: 41.35, south: 38.75 };

function positionFor(spot: Spot) {
  return {
    left: `${((spot.lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100}%`,
    top: `${((MAP_BOUNDS.north - spot.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100}%`,
  };
}

function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = (value: number) => value * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function BeachMap({ spots, mission, onMissionChange }: { spots: Spot[]; mission: Mission; onMissionChange: (mission: Mission) => void }) {
  const [selectedId, setSelectedId] = useState("su-giudeu");
  const [locating, setLocating] = useState(false);
  const [userPosition, setUserPosition] = useState<{ lat: number; lon: number } | null>(null);
  const selected = useMemo(() => spots.find((spot) => spot.id === selectedId) || spots[0], [selectedId, spots]);
  const zones = useMemo(() => Array.from(new Set(spots.map((spot) => SPOT_DETAILS[spot.id].zone))), [spots]);
  const nearby = useMemo(() => spots.filter((spot) => spot.id !== selected.id).sort((a, b) => distanceKm(selected, a) - distanceKm(selected, b)).slice(0, 3), [selected, spots]);

  function locateMe() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const current = { lat: position.coords.latitude, lon: position.coords.longitude };
      setUserPosition(current);
      const closest = [...spots].sort((a, b) => distanceKm(current, a) - distanceKm(current, b))[0];
      setSelectedId(closest.id);
      setLocating(false);
    }, () => setLocating(false), { enableHighAccuracy: false, timeout: 8000, maximumAge: 15 * 60 * 1000 });
  }

  return (
    <section className="map-explorer" aria-label="Explore Sardinian beaches on the map">
      <div className="map-heading">
        <div><p className="eyebrow dark">EXPLORE THE ISLAND</p><h2>Find your coast.</h2></div>
        <div className="map-filters" aria-label="Filter beaches by mission">
          {(Object.keys(MISSION_LABELS) as Mission[]).map((item) => <button key={item} className={mission === item ? "active" : ""} onClick={() => onMissionChange(item)}>{MISSION_LABELS[item].title}</button>)}
        </div>
      </div>
      <div className="zone-filters" aria-label="Browse popular Sardinian zones">
        <span>POPULAR ZONES</span>
        {zones.map((zone) => <button key={zone} onClick={() => setSelectedId(spots.find((spot) => SPOT_DETAILS[spot.id].zone === zone)?.id || selected.id)}>{zone}</button>)}
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
          {userPosition && userPosition.lat >= MAP_BOUNDS.south && userPosition.lat <= MAP_BOUNDS.north && userPosition.lon >= MAP_BOUNDS.west && userPosition.lon <= MAP_BOUNDS.east && <div className="user-map-marker" style={{ left: `${((userPosition.lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100}%`, top: `${((MAP_BOUNDS.north - userPosition.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100}%` }}><i/><span>You</span></div>}
        </div>
        <button className="locate-button" onClick={locateMe} disabled={locating}><CoastIcon name="location"/>{locating ? "Locating…" : userPosition ? "Nearest beach" : "Near me"}</button>
        <article className="map-spot-card">
          <div className="map-spot-image"><Image src={selected.image} alt="" fill sizes="112px" /></div>
          <div className="map-spot-copy"><span>{selected.area} · Sardinia</span><h3>{selected.name}</h3><p>{selected.note}</p><div><b>{selected.drive} min</b><b>{selected.missions.map((item) => MISSION_LABELS[item].title).join(" · ")}</b></div></div>
          <a href={selected.webcam.url} target="_blank" rel="noreferrer"><CoastIcon name="camera"/> Live view <b>↗</b></a>
        </article>
        <div className="map-hint"><span/><b>Best for {MISSION_LABELS[mission].title}</b><small>Tap a beach to explore</small></div>
      </div>
      <div className="nearby-row">
        <div className="nearby-title"><span>NEAR {selected.name.toUpperCase()}</span><b>More beaches, one tap away.</b></div>
        {nearby.map((spot) => <button key={spot.id} onClick={() => setSelectedId(spot.id)}><span className="nearby-image"><Image src={spot.image} alt="" fill sizes="78px"/></span><span><b>{spot.name}</b><small>{SPOT_DETAILS[spot.id].zone} · {Math.round(distanceKm(selected, spot))} km</small></span></button>)}
      </div>
    </section>
  );
}
