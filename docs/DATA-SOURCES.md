# AJÒ data sources and catalogue policy

## Discovery catalogue

AJÒ's broad discovery layer contains 293 named beach POIs. 276 have direct OpenStreetMap
records; 17 have public geographic cross-checks where the OSM name uses a different local
spelling. OpenStreetMap data is available under the Open Database License (ODbL); the product displays visible
attribution and links every discovery card back to the map. The discovery layer provides
names and coordinates only. It does not claim live beach conditions.

- Primary source: https://www.openstreetmap.org/copyright
- Public cross-checks: SardegnaTurismo, municipal pages and public cartographic directories;
  these are used for coordinates only, never for competitor reports or scores.
- Map verification: each POI opens at its recorded latitude and longitude.
- UI label: `OPEN DISCOVERY CATALOGUE`.

The separate curated layer currently contains nine beaches with real licensed imagery,
mission metadata, Open-Meteo observations, camera links and explainable derived signals.
Gold rings identify these full profiles on the map.

## Competitor exports

No AURA database row, identifier, report, score or proprietary beach catalogue is stored
or shipped by AJÒ. Material supplied during research was used only to understand common
product categories such as time-limited community observations and map density. AURA's
terms prohibit copying or reusing its service content and data structure.

- Terms reviewed: https://aurabeach.app/termini

## Community observations

Contest mode generates an AJÒ-owned UUID and stores the observation in browser
`localStorage`. It records a typed signal, severity, observation time and three-hour
expiry. It is explicitly labeled as local-only demo state and never overrides official
safety notices.

Production persistence can use a database such as Supabase after abuse prevention,
authentication, moderation, row-level security and retention controls are configured.
The contest release intentionally has no remote database dependency.

## Supabase decision

The Supabase Free plan is sufficient for a prototype, but free projects can be paused
after inactivity. AJÒ therefore keeps the judging demo static-first on Vercel. Supabase
is an optional post-contest backend for verified community reports, not a requirement
for map discovery or the agent loop.

- Pricing and limits reviewed: https://supabase.com/pricing
