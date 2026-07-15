import { Mission, SPOTS, Spot } from "./spots";

export type Profile = {
  mission: Mission;
  origin: string;
  level: "beginner" | "intermediate" | "expert";
  family: boolean;
  accessible: boolean;
  maxDrive: number;
};

export type HourlyPoint = { time: string; cloudCover: number; windSpeed: number; gusts: number; windDirection: number };

export type Conditions = {
  windSpeed: number;
  windDirection: number;
  gusts: number;
  waveHeight: number;
  wavePeriod: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  cloudCover: number;
  uvIndex: number;
  seaTemperature: number;
  hourly: HourlyPoint[];
  source: "live" | "demo";
};

export type CoastalSignals = {
  crowding: { score: number; label: "Quiet" | "Moderate" | "Busy" | "Very busy"; confidence: number };
  parking: { score: number; label: "Easy" | "Filling up" | "Difficult"; detail: string };
  posidonia: { score: number; label: "Unlikely" | "Possible" | "Likely"; detail: string };
  camera: {
    state: "demo-snapshot";
    observedAt: string;
    expiresAt: string;
    confidence: number;
    retention: "Images not retained";
  };
};

export type RankedSpot = Spot & Conditions & { score: number; reasons: string[]; risk: string; signals: CoastalSignals };

function demoHourly(wind: number, gusts: number, cloud: number, direction: number): HourlyPoint[] {
  const hour = new Date().getHours();
  return [0, 2, 4, 6, 8, 10, 12].map((offset, index) => ({
    time: `${String((hour + offset) % 24).padStart(2, "0")}:00`,
    cloudCover: clamp(cloud + [8, 2, -4, -7, -2, 4, 9][index]),
    windSpeed: Math.max(0, Math.round(wind + [0, -1, 1, 3, 2, 0, -2][index])),
    gusts: Math.max(0, Math.round(gusts + [0, 1, 3, 4, 2, 0, -1][index])),
    windDirection: (direction + [0, 4, 8, 12, 9, 5, 2][index]) % 360,
  }));
}

const demoByCoast: Record<Spot["coast"], Conditions> = {
  south: { windSpeed: 13, windDirection: 315, gusts: 18, waveHeight: 0.5, wavePeriod: 5, temperature: 29, apparentTemperature: 31, humidity: 58, cloudCover: 12, uvIndex: 7, seaTemperature: 25, hourly: demoHourly(13, 18, 12, 315), source: "demo" },
  east: { windSpeed: 9, windDirection: 315, gusts: 14, waveHeight: 0.3, wavePeriod: 4, temperature: 30, apparentTemperature: 32, humidity: 61, cloudCover: 8, uvIndex: 8, seaTemperature: 26, hourly: demoHourly(9, 14, 8, 315), source: "demo" },
  west: { windSpeed: 21, windDirection: 305, gusts: 29, waveHeight: 1.6, wavePeriod: 8, temperature: 27, apparentTemperature: 28, humidity: 66, cloudCover: 21, uvIndex: 6, seaTemperature: 24, hourly: demoHourly(21, 29, 21, 305), source: "demo" },
  north: { windSpeed: 24, windDirection: 300, gusts: 32, waveHeight: 1.1, wavePeriod: 7, temperature: 26, apparentTemperature: 27, humidity: 63, cloudCover: 16, uvIndex: 6, seaTemperature: 24, hourly: demoHourly(24, 32, 16, 300), source: "demo" },
};

function angleDistance(a: number, b: number) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function cameraWindow(now = new Date()) {
  const observed = new Date(now);
  observed.setUTCMinutes(Math.floor(observed.getUTCMinutes() / 30) * 30, 0, 0);
  const expires = new Date(observed.getTime() + 30 * 60 * 1000);
  return { observedAt: observed.toISOString(), expiresAt: expires.toISOString() };
}

function deriveCoastalSignals(spot: Spot, c: Conditions): CoastalSignals {
  const localHour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", hour: "2-digit", hour12: false }).format(new Date()));
  const timePressure = localHour >= 10 && localHour <= 17 ? 14 : localHour >= 8 && localHour <= 19 ? 5 : -12;
  const beachWeather = c.temperature >= 24 && c.cloudCover < 45 && c.windSpeed < 22 ? 7 : -5;
  const crowdScore = clamp(spot.crowdBaseline + timePressure + beachWeather);
  const crowdLabel = crowdScore >= 85 ? "Very busy" : crowdScore >= 65 ? "Busy" : crowdScore >= 40 ? "Moderate" : "Quiet";
  const parkingPenalty = spot.parkingProfile === "limited" ? 18 : spot.parkingProfile === "urban" ? 7 : 3;
  const parkingScore = clamp(crowdScore + parkingPenalty);
  const parkingLabel = parkingScore >= 78 ? "Difficult" : parkingScore >= 50 ? "Filling up" : "Easy";
  const posidoniaScore = clamp(spot.posidoniaSensitivity + c.waveHeight * 10 + Math.max(0, c.gusts - 18) * 0.7);
  const posidoniaLabel = posidoniaScore >= 68 ? "Likely" : posidoniaScore >= 38 ? "Possible" : "Unlikely";
  const window = cameraWindow();

  return {
    crowding: { score: crowdScore, label: crowdLabel, confidence: spot.webcam.coverage === "direct" ? 82 : 61 },
    parking: {
      score: parkingScore,
      label: parkingLabel,
      detail: spot.parkingProfile === "limited" ? "Limited roadside capacity · arrive early" : spot.parkingProfile === "urban" ? "Several access points · traffic sensitive" : "Moderate local capacity",
    },
    posidonia: {
      score: posidoniaScore,
      label: posidoniaLabel,
      detail: "Proxy from beach sensitivity, recent waves and gusts",
    },
    camera: { state: "demo-snapshot", ...window, confidence: spot.webcam.coverage === "direct" ? 82 : 61, retention: "Images not retained" },
  };
}

function scoreSpot(spot: Spot, profile: Profile, c: Conditions): RankedSpot {
  let score = spot.missions.includes(profile.mission) ? 66 : 18;
  const reasons: string[] = [];
  const alignment = angleDistance(c.windDirection, spot.exposure);

  if (spot.drive <= profile.maxDrive) {
    score += 10;
    reasons.push(`${spot.drive} min from ${profile.origin}`);
  } else {
    score -= Math.min(22, (spot.drive - profile.maxDrive) / 3);
  }

  if (profile.mission === "relax") {
    score += Math.max(-18, 18 - c.windSpeed * 1.2);
    score += alignment > 100 ? 10 : -5;
    if (profile.family && spot.tags.includes("family")) { score += 10; reasons.push("easy family setup"); }
    if (profile.accessible && spot.tags.includes("accessible")) { score += 12; reasons.push("accessible access"); }
    if (c.waveHeight < 0.7) reasons.push("calmer water window");
  }

  if (profile.mission === "kite") {
    score += c.windSpeed >= 14 && c.windSpeed <= 28 ? 18 : -14;
    score += alignment < 95 ? 8 : -8;
    reasons.push(`${c.windSpeed} kt wind · gusts ${c.gusts} kt`);
    if (profile.level === "beginner" && spot.level !== "everyone") score -= 18;
  }

  if (profile.mission === "life") {
    score += spot.tags.includes("sunset") ? 18 : 5;
    score += spot.tags.includes("services") ? 9 : 3;
    score += spot.coast === "west" || spot.coast === "south" ? 9 : 3;
    score += c.temperature >= 22 && c.temperature <= 31 ? 7 : -4;
    reasons.push(spot.experience);
    if (spot.tags.includes("sunset")) reasons.push("strong sunset sequence");
    reasons.push(`${spot.drive} min · easy evening return`);
  }

  if (profile.mission === "surf") {
    score += c.waveHeight >= 0.8 && c.waveHeight <= 2.2 ? 18 : -14;
    score += c.windSpeed < 18 ? 7 : -7;
    reasons.push(`${c.waveHeight.toFixed(1)} m swell window`);
    if (profile.level === "beginner" && spot.level === "expert") score -= 35;
  }

  const risk = spot.level === "expert" && profile.level !== "expert"
    ? "Skill mismatch — expert spot"
    : c.gusts > 30
      ? "Strong gusts — verify locally"
      : "Conditions indicative — check locally";

  return { ...spot, ...c, score: Math.max(9, Math.min(98, Math.round(score))), reasons: reasons.slice(0, 3), risk, signals: deriveCoastalSignals(spot, c) };
}

export function rankSpots(profile: Profile, conditions?: Record<string, Conditions>) {
  const source: Record<string, Conditions> = conditions || demoByCoast;
  return SPOTS.map((spot) => scoreSpot(spot, profile, source[spot.id] || source[spot.coast]))
    .sort((a, b) => b.score - a.score);
}

export function buildDemoPlan(profile: Profile) {
  const ranked = rankSpots(profile);
  const top = ranked[0];
  const second = ranked[1];
  const activity = [
    `Understood your ${profile.mission === "relax" ? "beach-day" : profile.mission} mission`,
    "Checked wind, gusts, swell and temperature",
    "Fused camera, crowding, parking and shoreline signals",
    `Compared ${SPOTS.length} Sardinian spots against your constraints`,
    `Built a weather watch for ${top.name}`,
  ];
  return {
    mode: "demo" as const,
    summary: profile.mission === "relax"
      ? `${top.name} gives you the calmest useful window without turning the day into a road trip.`
      : profile.mission === "life"
        ? `${top.name} creates the best beach-to-sunset arc, with an easy local evening instead of another checklist.`
      : `${top.name} has the strongest conditions-to-skill match in today’s window.`,
    window: profile.mission === "relax" ? "09:40–13:10" : profile.mission === "life" ? "17:20–22:15" : "11:20–15:30",
    departure: profile.mission === "relax" ? "Leave by 09:05" : profile.mission === "life" ? "Leave by 16:35" : "Leave by 10:10",
    top,
    alternatives: ranked.slice(1, 3),
    watch: {
      label: `Watching ${top.name}`,
      trigger: profile.mission === "relax" ? "wind > 18 kt or waves > 0.9 m" : "gust spread > 12 kt or skill mismatch",
      fallback: second.name,
    },
    activity: activity.slice(0, 5),
  };
}
