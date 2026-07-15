"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CoastIcon } from "@/app/components/CoastIcon";
import { CommunityReport } from "@/app/components/CommunityReport";
import { DISCOVERY_BEACHES, DiscoveryBeach, discoveryFit, osmMapUrl } from "@/lib/discovery-catalog";
import { MISSION_LABELS, Mission, SPOT_DETAILS, Spot } from "@/lib/spots";

const MAP_BOUNDS = { west: 8.05, east: 9.85, north: 41.35, south: 38.75 };
const POPULAR_ZONES = ["Cagliari", "Chia", "Villasimius", "Ogliastra", "San Teodoro", "Costa Smeralda", "Alghero", "Sinis"];

function positionFor(item: { lat: number; lon: number }) {
  return {
    left: `${((item.lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100}%`,
    top: `${((MAP_BOUNDS.north - item.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100}%`,
  };
}

function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = (value: number) => value * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function scoreClass(score: number) {
  return score >= 82 ? "great" : score >= 74 ? "good" : "fair";
}

export function BeachMap({ spots, mission, onMissionChange }: { spots: Spot[]; mission: Mission; onMissionChange: (mission: Mission) => void }) {
  const [selectedId, setSelectedId] = useState("premium:su-giudeu");
  const [locating, setLocating] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [userPosition, setUserPosition] = useState<{ lat: number; lon: number } | null>(null);
  const premiumId = selectedId.startsWith("premium:") ? selectedId.replace("premium:", "") : null;
  const discoveryId = selectedId.startsWith("discovery:") ? selectedId.replace("discovery:", "") : null;
  const premium = spots.find((spot) => spot.id === premiumId) || null;
  const discovery = DISCOVERY_BEACHES.find((beach) => beach.id === discoveryId) || null;
  const selected = premium || discovery || spots[0];
  const nearby = useMemo(() => spots.filter((spot) => spot.id !== premium?.id).sort((a, b) => distanceKm(selected, a) - distanceKm(selected, b)).slice(0, 3), [premium, selected, spots]);
  const selectedFit = discovery ? discoveryFit(discovery, mission) : 94;

  function selectZone(zone: string) {
    const curated = spots.find((spot) => SPOT_DETAILS[spot.id].zone === zone);
    const open = DISCOVERY_BEACHES.find((beach) => beach.zone === zone);
    if (curated) setSelectedId(`premium:${curated.id}`);
    else if (open) setSelectedId(`discovery:${open.id}`);
  }

  function locateMe() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const current = { lat: position.coords.latitude, lon: position.coords.longitude };
      setUserPosition(current);
      const candidates = [
        ...spots.map((spot) => ({ id: `premium:${spot.id}`, lat: spot.lat, lon: spot.lon })),
        ...DISCOVERY_BEACHES.map((beach) => ({ id: `discovery:${beach.id}`, lat: beach.lat, lon: beach.lon })),
      ];
      setSelectedId([...candidates].sort((a, b) => distanceKm(current, a) - distanceKm(current, b))[0].id);
      setLocating(false);
    }, () => setLocating(false), { enableHighAccuracy: false, timeout: 8000, maximumAge: 15 * 60 * 1000 });
  }

  return (
    <section className="map-explorer" aria-label="Explore Sardinian beaches on the map">
      <div className="map-heading">
        <div><p className="eyebrow dark">52 BEACHES · 9 COMPLETE GUIDES</p><h2>The whole island, one glance.</h2><p className="map-subtitle">Colours show how well each beach matches your day. Open a gold-ringed beach for the complete picture.</p></div>
        <div className="map-filters" aria-label="Filter beaches by mission">
          {(Object.keys(MISSION_LABELS) as Mission[]).map((item) => <button key={item} className={mission === item ? "active" : ""} onClick={() => onMissionChange(item)}>{MISSION_LABELS[item].title}</button>)}
        </div>
      </div>
      <div className="zone-filters" aria-label="Browse popular Sardinian zones">
        <button className={showAll ? "active" : ""} onClick={() => setShowAll(!showAll)}>{showAll ? "All 52" : "9 complete guides"}</button>
        {POPULAR_ZONES.map((zone) => <button key={zone} onClick={() => selectZone(zone)}>{zone}</button>)}
      </div>
      <div className="map-stage">
        <div className="map-sea-lines" aria-hidden="true"><i/><i/><i/></div>
        <div className="island-map-layer" aria-label="Map of Sardinian beaches">
          <div className="island-map-shape" aria-hidden="true" />
          {showAll && DISCOVERY_BEACHES.map((beach) => {
            const fit = discoveryFit(beach, mission);
            return <button key={beach.id} className={`catalog-marker ${scoreClass(fit)} ${discovery?.id === beach.id ? "selected" : ""}`} style={positionFor(beach)} onClick={() => setSelectedId(`discovery:${beach.id}`)} aria-label={`Open ${beach.name}, AJÒ discovery fit ${fit}`}><span>{Math.round(fit / 10)}</span><b>{beach.name}</b></button>;
          })}
          {spots.map((spot) => (
            <button key={spot.id} className={`beach-marker ${premium?.id === spot.id ? "selected" : ""} ${spot.missions.includes(mission) ? "mission-match" : ""}`} style={positionFor(spot)} onClick={() => setSelectedId(`premium:${spot.id}`)} aria-label={`Open full coastal intelligence for ${spot.name}`}><span/><b>{spot.name} · LIVE PROFILE</b></button>
          ))}
          {userPosition && userPosition.lat >= MAP_BOUNDS.south && userPosition.lat <= MAP_BOUNDS.north && userPosition.lon >= MAP_BOUNDS.west && userPosition.lon <= MAP_BOUNDS.east && <div className="user-map-marker" style={positionFor(userPosition)}><i/><span>You</span></div>}
        </div>
        <button className="locate-button" onClick={locateMe} disabled={locating}><CoastIcon name="location"/>{locating ? "Locating…" : userPosition ? "Nearest beach" : "Near me"}</button>
        <article className={`map-spot-card ${discovery ? "discovery-card" : ""}`}>
          {premium ? <div className="map-spot-image"><Image src={premium.image} alt={`Real view of ${premium.name}`} fill sizes="132px" /></div> : <div className={`map-discovery-visual ${scoreClass(selectedFit)}`}><CoastIcon name="location"/><b>{(selected as DiscoveryBeach).coast.toUpperCase()}</b></div>}
          <div className="map-spot-copy">
            <span>{premium ? `${premium.area} · COMPLETE BEACH GUIDE` : `${(selected as DiscoveryBeach).zone} · ISLAND DISCOVERY`}</span>
            <h3>{selected.name}</h3>
            <p>{premium ? premium.note : "A mapped Sardinian beach ready for your next day out. Open a gold-ringed beach for weather, sea, access and local experiences."}</p>
            <div>{premium ? <><b>{premium.drive} min</b><b>{premium.missions.map((item) => MISSION_LABELS[item].title).join(" · ")}</b></> : <><b className={`fit-pill ${scoreClass(selectedFit)}`}>{selectedFit}% AJÒ fit</b><b>{(selected as DiscoveryBeach).coast} coast</b><b>Mapped location</b></>}</div>
          </div>
          {premium ? <a href={premium.webcam.url} target="_blank" rel="noreferrer"><CoastIcon name="camera"/> Live camera <b>↗</b></a> : <a href={osmMapUrl(selected as DiscoveryBeach)} target="_blank" rel="noreferrer"><CoastIcon name="location"/> Open map <b>↗</b></a>}
        </article>
        <div className="map-hint"><span/><b>AJÒ fit · {MISSION_LABELS[mission].title}</b><small>Green = stronger mission match</small></div>
      </div>
      <div className="map-legend"><span><i className="great"/>82–91 stronger match</span><span><i className="good"/>74–81 good match</span><span><i className="fair"/>68–73 explore</span><b><i/> Gold ring = full live profile</b><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Discovery POIs © OpenStreetMap contributors · ODbL ↗</a></div>
      <div className="nearby-row">
        <div className="nearby-title"><span>NEAR {selected.name.toUpperCase()}</span><b>Full intelligence, one tap away.</b></div>
        {nearby.map((spot) => <button key={spot.id} onClick={() => setSelectedId(`premium:${spot.id}`)}><span className="nearby-image"><Image src={spot.image} alt="" fill sizes="78px"/></span><span><b>{spot.name}</b><small>{SPOT_DETAILS[spot.id].zone} · {Math.round(distanceKm(selected, spot))} km</small></span></button>)}
      </div>
      <CommunityReport beachId={selected.id} beachName={selected.name} />
    </section>
  );
}
