import "server-only";
import { Conditions } from "./engine";
import { SPOTS } from "./spots";

type WeatherPayload = {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    cloud_cover?: number;
    uv_index?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    wind_gusts_10m?: number;
  };
};

type MarinePayload = {
  current?: { wave_height?: number; wave_direction?: number; wave_period?: number; sea_surface_temperature?: number };
};

type CacheEntry = { expiresAt: number; value: Record<string, Conditions> };

const CACHE_TTL_MS = 15 * 60 * 1000;
let memoryCache: CacheEntry | null = null;

export async function getLiveConditions() {
  if (memoryCache && memoryCache.expiresAt > Date.now()) return memoryCache.value;

  const latitude = SPOTS.map((spot) => spot.lat).join(",");
  const longitude = SPOTS.map((spot) => spot.lon).join(",");
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.search = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,cloud_cover,uv_index,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    wind_speed_unit: "kn",
    timezone: "Europe/Rome",
  }).toString();

  const marineUrl = new URL("https://marine-api.open-meteo.com/v1/marine");
  marineUrl.search = new URLSearchParams({
    latitude,
    longitude,
    current: "wave_height,wave_direction,wave_period,sea_surface_temperature",
    timezone: "Europe/Rome",
  }).toString();

  const [weatherResponse, marineResponse] = await Promise.all([
    fetch(weatherUrl, { next: { revalidate: 900 } }),
    fetch(marineUrl, { next: { revalidate: 900 } }),
  ]);
  if (!weatherResponse.ok || !marineResponse.ok) throw new Error("Open-Meteo is unavailable");

  const weatherRaw = await weatherResponse.json() as WeatherPayload | WeatherPayload[];
  const marineRaw = await marineResponse.json() as MarinePayload | MarinePayload[];
  const weather = Array.isArray(weatherRaw) ? weatherRaw : [weatherRaw];
  const marine = Array.isArray(marineRaw) ? marineRaw : [marineRaw];

  const value = Object.fromEntries(SPOTS.map((spot, index) => {
    const w = weather[index]?.current || {};
    const m = marine[index]?.current || {};
    return [spot.id, {
      windSpeed: Math.round(w.wind_speed_10m ?? 0),
      windDirection: Math.round(w.wind_direction_10m ?? 0),
      gusts: Math.round(w.wind_gusts_10m ?? w.wind_speed_10m ?? 0),
      waveHeight: Number((m.wave_height ?? 0).toFixed(1)),
      wavePeriod: Math.round(m.wave_period ?? 0),
      temperature: Math.round(w.temperature_2m ?? 0),
      apparentTemperature: Math.round(w.apparent_temperature ?? w.temperature_2m ?? 0),
      humidity: Math.round(w.relative_humidity_2m ?? 0),
      cloudCover: Math.round(w.cloud_cover ?? 0),
      uvIndex: Number((w.uv_index ?? 0).toFixed(1)),
      seaTemperature: Math.round(m.sea_surface_temperature ?? 0),
      source: "live" as const,
    }];
  }));

  memoryCache = { expiresAt: Date.now() + CACHE_TTL_MS, value };
  return value;
}
