import type { Mission } from "@/lib/spots";
import publicCatalog from "./public-beach-catalog.json";

export type DiscoveryBeach = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  zone: string;
  coast: "north" | "south" | "east" | "west";
  source: "OpenStreetMap" | "Public coordinate cross-check";
  sourceId: string | null;
};

function coastFor(lon: number, lat: number): DiscoveryBeach["coast"] {
  if (lat > 40.7) return lon > 9.1 ? "north" : "west";
  if (lat < 39.2) return lon > 9.1 ? "east" : "south";
  return lon > 9.2 ? "east" : "west";
}

function zoneFor(name: string, lat: number, lon: number) {
  const lower = name.toLowerCase();
  if (/(goloritz|mariolu|coccorrocci|arbatax|santa maria navarrese|san gemiliano|foxi manna|orri)/.test(lower)) return "Ogliastra";
  if (/(cinta|brandinchi|impostu|tavolara|agrustos|budoni|ottiolu|san teodoro|capo coda)/.test(lower)) return "San Teodoro";
  if (/(capriccioli|liscia ruja|principe|pevero|romazzino|cala di volpe|porto cervo|moresca|cala soraya|granara|coticcio)/.test(lower)) return "Costa Smeralda";
  if (/(pelosa|mugoni|bombarde|maria pia|lazzaretto|tramariglio|burantin|porto ferro|alghero|argentiera)/.test(lower)) return "Alghero";
  if (/(sinis|arutas|maimoni|mari ermi|putzu|mesa longa|rocca tunda|s arena|mandriola|san giovanni)/.test(lower)) return "Sinis";
  if (/(villasimius|simius|campus|campulongu|porto sa ruxi|porto giunco|punta molentis|cava usai)/.test(lower)) return "Villasimius";
  if (/(costa rei|monte turno|sinzias|piscina rei|scoglio peppino|feraxi)/.test(lower)) return "Costa Rei";
  if (/(chia|su giudeu|campana|cala cipolla|tuerredda|malfatano|sa colonia)/.test(lower)) return "Chia";
  if (lat > 40.7 && lon > 9.35) return "Gallura · north-east";
  if (lat > 40.45 && lon > 9.55) return "Golfo di Orosei · east";
  if (lat > 40.45 && lon <= 9.55) return "Alghero · north-west";
  if (lat < 39.25 && lon > 9.35) return "South-east coast";
  if (lat < 39.25 && lon <= 9.35) return "South-west coast";
  if (lon > 9.2) return "East coast";
  if (lower.includes("sinis")) return "Sinis";
  return "West coast";
}

export const DISCOVERY_BEACHES: DiscoveryBeach[] = publicCatalog.map((item) => ({
  id: item.id,
  name: item.name,
  lat: item.lat,
  lon: item.lon,
  zone: zoneFor(item.name, item.lat, item.lon),
  coast: coastFor(item.lon, item.lat),
  source: item.source as DiscoveryBeach["source"],
  sourceId: item.sourceId ?? null,
}));

export function discoveryFit(beach: DiscoveryBeach, mission: Mission) {
  const preferred: Record<Mission, DiscoveryBeach["coast"][]> = {
    relax: ["east", "south", "north"],
    life: ["south", "north", "east"],
    surf: ["west", "north"],
    kite: ["north", "west", "south"],
  };
  const hash = [...beach.id].reduce((total, char) => total + char.charCodeAt(0), 0);
  const affinity = preferred[mission].includes(beach.coast) ? 12 : 3;
  return Math.min(91, 65 + affinity + (hash % 14));
}

export function osmMapUrl(beach: Pick<DiscoveryBeach, "lat" | "lon">) {
  return `https://www.openstreetmap.org/?mlat=${beach.lat}&mlon=${beach.lon}#map=15/${beach.lat}/${beach.lon}`;
}
