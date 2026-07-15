export type Mission = "relax" | "life" | "surf" | "kite";

export type Spot = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lon: number;
  coast: "north" | "south" | "east" | "west";
  missions: Mission[];
  tags: string[];
  level: "everyone" | "intermediate" | "expert";
  exposure: number;
  drive: number;
  image: string;
  imageCredit: string;
  imageSource: string;
  webcam: { url: string; label: string; coverage: "direct" | "nearby" };
  crowdBaseline: number;
  parkingProfile: "limited" | "moderate" | "urban";
  posidoniaSensitivity: number;
  note: string;
  experience: string;
};

export const SPOTS: Spot[] = [
  {
    id: "solanas",
    name: "Solanas",
    area: "Sinnai",
    lat: 39.136,
    lon: 9.429,
    coast: "south",
    missions: ["relax"],
    tags: ["family", "sand", "shallow", "services"],
    level: "everyone",
    exposure: 155,
    drive: 48,
    image: "/beaches/solanas.webp",
    imageCredit: "David Orban · CC BY 2.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Solanas_beach_in_Sardinia_-_Flickr_-_david.orban.jpg",
    webcam: { url: "https://panoramicams.com/cala-sinzias-castidias/", label: "Cala Sinzias camera", coverage: "nearby" },
    crowdBaseline: 68,
    parkingProfile: "limited",
    posidoniaSensitivity: 42,
    note: "Wide sandy bay with an easy family setup.",
    experience: "Late swim · golden-hour walk · village gelato",
  },
  {
    id: "mari-pintau",
    name: "Mari Pintau",
    area: "Quartu Sant’Elena",
    lat: 39.172,
    lon: 9.382,
    coast: "south",
    missions: ["relax"],
    tags: ["clear-water", "snorkel", "wild"],
    level: "everyone",
    exposure: 160,
    drive: 36,
    image: "/beaches/mari-pintau.webp",
    imageCredit: "Ramon Espiña Fernandez · CC BY-SA 3.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Cala_Mari_Pintau_-_panoramio.jpg",
    webcam: { url: "https://panoramicams.com/poetto-cagliari/", label: "Poetto camera", coverage: "nearby" },
    crowdBaseline: 82,
    parkingProfile: "limited",
    posidoniaSensitivity: 55,
    note: "Clear water and a wilder, pebbled shoreline.",
    experience: "Clear-water dip · scenic coast drive · sunset viewpoint",
  },
  {
    id: "su-giudeu",
    name: "Su Giudeu",
    area: "Chia",
    lat: 38.891,
    lon: 8.863,
    coast: "south",
    missions: ["relax", "life", "surf"],
    tags: ["sand", "family", "iconic", "services"],
    level: "everyone",
    exposure: 190,
    drive: 62,
    image: "/beaches/su-giudeu.webp",
    imageCredit: "emmequadro61 · CC BY 2.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Chia_beach,_Sardinia,_Italy.jpg",
    webcam: { url: "https://panoramicams.com/su-giudeu-chia/", label: "Su Giudeu live", coverage: "direct" },
    crowdBaseline: 88,
    parkingProfile: "limited",
    posidoniaSensitivity: 50,
    note: "A broad iconic beach with room to spread out.",
    experience: "Late beach · Chia aperitivo · lagoon at golden hour",
  },
  {
    id: "poetto",
    name: "Poetto",
    area: "Cagliari",
    lat: 39.2,
    lon: 9.169,
    coast: "south",
    missions: ["relax", "life", "kite"],
    tags: ["accessible", "services", "transit", "family"],
    level: "everyone",
    exposure: 155,
    drive: 18,
    image: "/beaches/poetto.webp",
    imageCredit: "Nilo1926 · CC BY-SA 4.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Poetto_seen_from_Sella_del_Diavolo.jpg",
    webcam: { url: "https://panoramicams.com/poetto-cagliari/", label: "Poetto live", coverage: "direct" },
    crowdBaseline: 76,
    parkingProfile: "urban",
    posidoniaSensitivity: 48,
    note: "The urban beach: easy access, services and a quick escape.",
    experience: "Sunset promenade · Sella del Diavolo · Marina aperitivo",
  },
  {
    id: "porto-botte",
    name: "Porto Botte",
    area: "Giba",
    lat: 38.944,
    lon: 8.596,
    coast: "west",
    missions: ["kite"],
    tags: ["kite", "flat-water", "wind"],
    level: "intermediate",
    exposure: 265,
    drive: 74,
    image: "/beaches/porto-botte.webp",
    imageCredit: "Settemagico · CC BY-SA 4.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Porto_Botte_Sud_Sardegna.jpg",
    webcam: { url: "https://panoramicams.com/porto-botte-is-arenas/", label: "Porto Botte live", coverage: "direct" },
    crowdBaseline: 35,
    parkingProfile: "limited",
    posidoniaSensitivity: 44,
    note: "A wind-led mission for experienced riders.",
    experience: "Lagoon light · local winery stop · Sant’Antioco evening",
  },
  {
    id: "porto-pollo",
    name: "Porto Pollo",
    area: "Palau",
    lat: 41.194,
    lon: 9.324,
    coast: "north",
    missions: ["life", "kite", "surf"],
    tags: ["kite", "windsurf", "schools", "wind"],
    level: "intermediate",
    exposure: 300,
    drive: 190,
    image: "/beaches/porto-pollo.webp",
    imageCredit: "Lory2k · CC BY 3.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Istmo_isola_dei_gabbiani.jpg",
    webcam: { url: "https://panoramicams.com/porto-pollo-flat-side/", label: "Porto Pollo live", coverage: "direct" },
    crowdBaseline: 72,
    parkingProfile: "limited",
    posidoniaSensitivity: 38,
    note: "One of Sardinia’s best-known wind playgrounds.",
    experience: "Wind session · island sunset · Palau harbour dinner",
  },
  {
    id: "capo-mannu",
    name: "Capo Mannu",
    area: "Sinis",
    lat: 40.047,
    lon: 8.376,
    coast: "west",
    missions: ["surf"],
    tags: ["surf", "reef", "waves", "wild"],
    level: "expert",
    exposure: 285,
    drive: 108,
    image: "/beaches/capo-mannu.webp",
    imageCredit: "Japs 88 · CC BY-SA 3.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Surfing_in_Capo_Mannu.png",
    webcam: { url: "https://panoramicams.com/putzu-idu-capo-mannu/", label: "Putzu Idu · Capo Mannu", coverage: "direct" },
    crowdBaseline: 40,
    parkingProfile: "limited",
    posidoniaSensitivity: 34,
    note: "A serious west-coast surf spot; local conditions matter.",
    experience: "Cliff walk · west-coast sunset · Sinis dinner",
  },
  {
    id: "funtanamare",
    name: "Funtanamare",
    area: "Gonnesa",
    lat: 39.337,
    lon: 8.416,
    coast: "west",
    missions: ["life", "surf"],
    tags: ["surf", "sand", "waves", "sunset"],
    level: "intermediate",
    exposure: 275,
    drive: 66,
    image: "/beaches/funtanamare.webp",
    imageCredit: "Alex10 · CC BY-SA 4.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Funtanamare.jpg",
    webcam: { url: "https://panoramicams.com/porto-paglia-marina-di-gonnesa/", label: "Porto Paglia camera", coverage: "nearby" },
    crowdBaseline: 45,
    parkingProfile: "moderate",
    posidoniaSensitivity: 30,
    note: "A long western beach with a strong sunset window.",
    experience: "Sunset swim · mining coast viewpoint · Iglesias evening",
  },
  {
    id: "cala-sinzias",
    name: "Cala Sinzias",
    area: "Castiadas",
    lat: 39.125,
    lon: 9.556,
    coast: "east",
    missions: ["relax", "life"],
    tags: ["family", "sand", "clear-water", "services"],
    level: "everyone",
    exposure: 105,
    drive: 63,
    image: "/beaches/cala-sinzias.webp",
    imageCredit: "Giorgio Galeotti · CC BY-SA 4.0",
    imageSource: "https://commons.wikimedia.org/wiki/File:Spiaggia_-_Cala_Sinzias,_Castiadas,_Cagliari,_Italia_-_29_Maggio_2026_01.jpg",
    webcam: { url: "https://panoramicams.com/cala-sinzias-castidias/", label: "Cala Sinzias live", coverage: "direct" },
    crowdBaseline: 74,
    parkingProfile: "limited",
    posidoniaSensitivity: 58,
    note: "A bright eastern option when the west gets rough.",
    experience: "Late swim · Costa Rei aperitivo · moonlit coast drive",
  },
];

export const MISSION_LABELS: Record<Mission, { title: string; subtitle: string; icon: string }> = {
  relax: { title: "Beach day", subtitle: "Calm, shade & easy water", icon: "☀" },
  life: { title: "Beach life", subtitle: "Sunset, food & local rhythm", icon: "✦" },
  surf: { title: "Explore", subtitle: "Trails, coves & viewpoints", icon: "⌖" },
  kite: { title: "Water time", subtitle: "SUP, snorkel & kayak", icon: "≈" },
};

export type SpotDetails = {
  zone: "Cagliari" | "Chia" | "Costa Rei" | "Sulcis" | "Sinis" | "Gallura";
  description: string;
  surface: string;
  seabed: string;
  exposure: string;
  services: string;
  activities: Array<{ title: string; subtitle: string; kind: "snorkel" | "paddle" | "hike" | "food" | "family" | "ride" }>;
};

export const SPOT_DETAILS: Record<string, SpotDetails> = {
  solanas: { zone: "Cagliari", description: "A long pale-sand bay framed by Mediterranean scrub, practical for an easy day without losing the wild-coast feeling.", surface: "Fine sand", seabed: "Shallow, gradual entry", exposure: "South-east · morning light", services: "Seasonal kiosks, loungers and nearby village services", activities: [{ title: "Paddle the bay", subtitle: "SUP & kayak", kind: "paddle" }, { title: "Coastal walk", subtitle: "Easy panoramic trail", kind: "hike" }, { title: "Village flavours", subtitle: "Gelato & local dinner", kind: "food" }] },
  "mari-pintau": { zone: "Cagliari", description: "Its name means ‘painted sea’: turquoise water over smooth pale pebbles, with excellent visibility close to shore.", surface: "Smooth pebbles · reef shoes useful", seabed: "Deepens relatively quickly", exposure: "South · sun most of the day", services: "Seasonal kiosk and limited roadside parking", activities: [{ title: "Clear-water snorkel", subtitle: "Rocky edges & fish", kind: "snorkel" }, { title: "Scenic coast drive", subtitle: "Panoramic SP17", kind: "hike" }, { title: "Sunset aperitivo", subtitle: "Cagliari coast", kind: "food" }] },
  "su-giudeu": { zone: "Chia", description: "One of Chia’s signature dunes and lagoons, with a broad sandy shore and the small offshore islet that gives the beach its name.", surface: "Fine pale sand", seabed: "Mostly gradual", exposure: "South-west · long sunsets", services: "Paid parking, seasonal bars and beach facilities", activities: [{ title: "Lagoon nature walk", subtitle: "Flamingos & dunes", kind: "hike" }, { title: "Family water time", subtitle: "Wide sandy setup", kind: "family" }, { title: "Chia golden hour", subtitle: "Aperitivo & dinner", kind: "food" }] },
  poetto: { zone: "Cagliari", description: "Cagliari’s urban beach stretches beneath the Sella del Diavolo, combining easy access, sport, food and a lively evening promenade.", surface: "Fine sand", seabed: "Gradual urban beach", exposure: "South-east", services: "Full services, transit, kiosks, showers and accessible sections", activities: [{ title: "Sella del Diavolo", subtitle: "Panoramic hike", kind: "hike" }, { title: "Water playground", subtitle: "SUP, sailing & kayak", kind: "paddle" }, { title: "Poetto after dark", subtitle: "Food & beach bars", kind: "food" }] },
  "porto-botte": { zone: "Sulcis", description: "A low, wind-exposed shoreline beside lagoons and salt landscapes, best known for reliable kitesurf conditions.", surface: "Sand and lagoon shore", seabed: "Shallow launch area", exposure: "West · wind exposed", services: "Specialist kite schools; limited general services", activities: [{ title: "Kite session", subtitle: "Schools & flat water", kind: "ride" }, { title: "Lagoon birdlife", subtitle: "Nature observation", kind: "hike" }, { title: "Sulcis wine route", subtitle: "Cellars & local food", kind: "food" }] },
  "porto-pollo": { zone: "Gallura", description: "A narrow isthmus between two bays, internationally known for wind sports and the granite landscape of northern Sardinia.", surface: "Sand and granite", seabed: "Different sides, different exposure", exposure: "North-west · Maestrale", services: "Schools, rentals, bars and seasonal facilities", activities: [{ title: "Wind playground", subtitle: "Kite & windsurf", kind: "ride" }, { title: "Archipelago paddle", subtitle: "Kayak & SUP", kind: "paddle" }, { title: "Palau evening", subtitle: "Harbour food", kind: "food" }] },
  "capo-mannu": { zone: "Sinis", description: "A rugged marine headland and Sardinia’s reference surf zone, with powerful exposed breaks and a raw western landscape.", surface: "Rock, reef and small coves", seabed: "Technical reef zones", exposure: "West · open swell", services: "Limited; specialist surf support nearby", activities: [{ title: "Surf the west", subtitle: "Expert local breaks", kind: "ride" }, { title: "Cliff exploration", subtitle: "Wild coastal walk", kind: "hike" }, { title: "Sinis archaeology", subtitle: "Culture & local food", kind: "family" }] },
  funtanamare: { zone: "Sulcis", description: "A sweeping west-coast beach beneath the mining landscape, appreciated for open horizons, waves and dramatic sunsets.", surface: "Long sandy shore", seabed: "Open-water entry", exposure: "West · sunset and swell", services: "Seasonal facilities and moderate parking", activities: [{ title: "Sunset surf", subtitle: "Sandy west-coast waves", kind: "ride" }, { title: "Mining coast", subtitle: "Viewpoints & heritage", kind: "hike" }, { title: "Iglesias evening", subtitle: "Historic centre & food", kind: "food" }] },
  "cala-sinzias": { zone: "Costa Rei", description: "A bright arc of pale sand and clear water backed by eucalyptus and Mediterranean vegetation on Sardinia’s south-east coast.", surface: "Fine pale sand", seabed: "Gradual and clear", exposure: "East · morning sun", services: "Parking, seasonal bars, rentals and family facilities", activities: [{ title: "Morning snorkel", subtitle: "Clear sheltered water", kind: "snorkel" }, { title: "Family paddle", subtitle: "SUP & kayak", kind: "paddle" }, { title: "Costa Rei evening", subtitle: "Markets & aperitivo", kind: "food" }] },
};
