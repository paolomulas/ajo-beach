import type { Mission } from "@/lib/spots";

export type DiscoveryBeach = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  zone: string;
  coast: "north" | "south" | "east" | "west";
  source: "OpenStreetMap";
};

// An open discovery layer, intentionally separate from AJÒ's deeply curated live profiles.
// Coordinates and names are OpenStreetMap data (ODbL); no competitor catalogue is included.
export const DISCOVERY_BEACHES: DiscoveryBeach[] = [
  { id: "goloritze", name: "Cala Goloritzè", lat: 40.1080702, lon: 9.6896029, zone: "Ogliastra", coast: "east", source: "OpenStreetMap" },
  { id: "mariolu", name: "Cala Mariolu", lat: 40.1233317, lon: 9.676703, zone: "Ogliastra", coast: "east", source: "OpenStreetMap" },
  { id: "luna", name: "Cala Luna", lat: 40.2264753, lon: 9.6259242, zone: "Golfo di Orosei", coast: "east", source: "OpenStreetMap" },
  { id: "la-cinta", name: "La Cinta", lat: 40.7952107, lon: 9.669953, zone: "San Teodoro", coast: "east", source: "OpenStreetMap" },
  { id: "brandinchi", name: "Cala Brandinchi", lat: 40.8346441, lon: 9.6855594, zone: "San Teodoro", coast: "east", source: "OpenStreetMap" },
  { id: "lu-impostu", name: "Lu Impostu", lat: 40.8211207, lon: 9.6828247, zone: "San Teodoro", coast: "east", source: "OpenStreetMap" },
  { id: "capriccioli", name: "Capriccioli", lat: 41.0829756, lon: 9.546263, zone: "Costa Smeralda", coast: "north", source: "OpenStreetMap" },
  { id: "liscia-ruja", name: "Liscia Ruja", lat: 41.0704637, lon: 9.5285342, zone: "Costa Smeralda", coast: "north", source: "OpenStreetMap" },
  { id: "rena-bianca", name: "Rena Bianca", lat: 41.245117, lon: 9.1889954, zone: "Santa Teresa", coast: "north", source: "OpenStreetMap" },
  { id: "la-pelosa", name: "La Pelosa", lat: 40.9652807, lon: 8.2096592, zone: "Stintino", coast: "north", source: "OpenStreetMap" },
  { id: "mugoni", name: "Mugoni", lat: 40.616841, lon: 8.2055627, zone: "Alghero", coast: "west", source: "OpenStreetMap" },
  { id: "bombarde", name: "Le Bombarde", lat: 40.5852097, lon: 8.255191, zone: "Alghero", coast: "west", source: "OpenStreetMap" },
  { id: "maria-pia", name: "Maria Pia", lat: 40.5850758, lon: 8.3127008, zone: "Alghero", coast: "west", source: "OpenStreetMap" },
  { id: "porto-ferro", name: "Porto Ferro", lat: 40.6892258, lon: 8.2013927, zone: "Alghero", coast: "west", source: "OpenStreetMap" },
  { id: "biderosa", name: "Biderosa", lat: 40.4575799, lon: 9.8005507, zone: "Orosei", coast: "east", source: "OpenStreetMap" },
  { id: "berchida", name: "Bérchida", lat: 40.4818778, lon: 9.8055039, zone: "Siniscola", coast: "east", source: "OpenStreetMap" },
  { id: "coccorrocci", name: "Coccorrocci", lat: 39.7253998, lon: 9.6750876, zone: "Ogliastra", coast: "east", source: "OpenStreetMap" },
  { id: "punta-molentis", name: "Punta Molentis", lat: 39.1336239, lon: 9.5563807, zone: "Villasimius", coast: "south", source: "OpenStreetMap" },
  { id: "simius", name: "Simius", lat: 39.1251104, lon: 9.5269803, zone: "Villasimius", coast: "south", source: "OpenStreetMap" },
  { id: "cala-cipolla", name: "Cala Cipolla", lat: 38.87879, lon: 8.854666, zone: "Chia", coast: "south", source: "OpenStreetMap" },
  { id: "cala-del-morto", name: "Cala del Morto", lat: 38.8914625, lon: 8.8746091, zone: "Chia", coast: "south", source: "OpenStreetMap" },
  { id: "campana", name: "Campana", lat: 38.8887883, lon: 8.8710976, zone: "Chia", coast: "south", source: "OpenStreetMap" },
  { id: "santa-margherita", name: "Santa Margherita di Pula", lat: 38.9269615, lon: 8.9232663, zone: "Pula", coast: "south", source: "OpenStreetMap" },
  { id: "is-solinas", name: "Is Solinas", lat: 39.0212212, lon: 8.5753751, zone: "Sulcis", coast: "south", source: "OpenStreetMap" },
  { id: "maladroxia", name: "Maladroxia", lat: 38.999, lon: 8.449096, zone: "Sant’Antioco", coast: "south", source: "OpenStreetMap" },
  { id: "cala-sapone", name: "Cala Sapone", lat: 39.008632, lon: 8.385438, zone: "Sant’Antioco", coast: "west", source: "OpenStreetMap" },
  { id: "cala-domestica", name: "Cala Domestica", lat: 39.373168, lon: 8.380595, zone: "Iglesiente", coast: "west", source: "OpenStreetMap" },
  { id: "buggerru", name: "Buggerru", lat: 39.4034092, lon: 8.4011711, zone: "Iglesiente", coast: "west", source: "OpenStreetMap" },
  { id: "scivu", name: "Scivu", lat: 39.4880005, lon: 8.4055205, zone: "Costa Verde", coast: "west", source: "OpenStreetMap" },
  { id: "piscinas", name: "Piscinas", lat: 39.5415849, lon: 8.4466302, zone: "Costa Verde", coast: "west", source: "OpenStreetMap" },
  { id: "portu-maga", name: "Portu Maga", lat: 39.5796214, lon: 8.4643166, zone: "Costa Verde", coast: "west", source: "OpenStreetMap" },
  { id: "funtanazza", name: "Funtanazza", lat: 39.6136472, lon: 8.4667251, zone: "Costa Verde", coast: "west", source: "OpenStreetMap" },
  { id: "torregrande", name: "Torregrande", lat: 39.9052275, lon: 8.5150512, zone: "Oristano", coast: "west", source: "OpenStreetMap" },
  { id: "san-giovanni-sinis", name: "San Giovanni di Sinis", lat: 39.8801595, lon: 8.4369352, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "funtana-meiga", name: "Funtana Meiga", lat: 39.8928751, lon: 8.4252958, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "maimoni", name: "Maimoni", lat: 39.913859, lon: 8.3990399, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "is-arutas", name: "Is Arutas", lat: 39.95126, lon: 8.4010136, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "mari-ermi", name: "Mari Ermi", lat: 39.9664895, lon: 8.3973903, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "putzu-idu", name: "Putzu Idu", lat: 40.0289957, lon: 8.4041499, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "arena-scoada", name: "S’Arena Scoada", lat: 40.0173221, lon: 8.4141524, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "mesa-longa", name: "Sa Mesa Longa", lat: 40.0458493, lon: 8.3979522, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "rocca-tunda", name: "Sa Rocca Tunda", lat: 40.0429611, lon: 8.417674, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
  { id: "mandriola", name: "Mandriola", lat: 40.0318438, lon: 8.3952795, zone: "Sinis", coast: "west", source: "OpenStreetMap" },
];

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
