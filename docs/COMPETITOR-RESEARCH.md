# AJÒ Beach — competitor and derived-metrics research

Updated: 15 July 2026

For the international state-of-the-art comparison and implementation roadmap, see
[`GLOBAL-BEACH-BENCHMARK.md`](./GLOBAL-BEACH-BENCHMARK.md).

For official bathing-water, Blue Flag and international environmental data, see
[`WATER-QUALITY-SOURCES.md`](./WATER-QUALITY-SOURCES.md).

## Public competitor coverage

### AURA Beach Advisor

- 300+ Sardinian beaches ranked hourly.
- A 0–10 score based on wind direction relative to beach orientation, wind speed, waves and general weather.
- Filters for time of day, services, accessibility, dogs, families, shallow water and wild beaches.
- Public UI includes hourly cloud/wind charts, live webcam links, community reports and a Posidonia accumulation likelihood.
- Source: <https://aurabeach.app/>

AURA's terms prohibit copying or extracting its interface, beach database, recommendation logic and content. AJÒ must implement original schemas and formulas from open/authorized sources, not scrape AURA.

### Bentu

- 700+ beaches, coves and coasts.
- Map/geolocation discovery, Bentu Score, weather and forecast score.
- Photos, user sharing, favourites and driving directions.
- Public store listing: <https://play.google.com/store/apps/details?id=com.milish.bentu>

The provided XAPK is package `com.milish.bentu`, version 2.1.5. Its public manifest confirms location, camera and network capabilities, but does not establish additional derived metrics or disclose scoring logic. No code, private endpoints or proprietary dataset should be extracted.

### Panoramicams

- A broad Sardinian live-camera network covering beaches, panoramas, sport and nightlife.
- Beach directory: <https://panoramicams.com/category/spiagge/>
- The site does not present an explicit public licence for automated frame capture, AI analysis or third-party embedding. Obtain written permission before production use: `angelo@panoramicams.com`.

## AJÒ's original intelligence layer

Every derived signal must return `value`, `confidence`, `observedAt`, `sources` and a short explanation. Safety-related signals are advisory and must never replace local authorities or lifeguards.

| Metric | What it answers | Derivation |
| --- | --- | --- |
| **Sea Truth** | Does reality match the forecast? | Compare webcam observations (cloud, whitecaps, shoreline, visibility) with forecast values; report agreement and confidence. |
| **Beach Pulse** | How busy does it feel now? | Camera region-of-interest occupancy, umbrellas and usable free-sand ratio; output bands, not identity or exact tracking. |
| **Usable Shore** | Is there actually room? | Visible dry-sand area minus occupied area, adjusted for beach width and wave run-up. |
| **Posidonia Shorecast** | Is accumulation at the waterline likely? | Previous 48–72h onshore wind, wave exposure, beach orientation/sensitivity, reports and authorized camera evidence. |
| **Sand Sting** | Will blown sand make the beach unpleasant? | Wind/gust speed, onshore/cross-shore angle, beach exposure and sand type. |
| **Clarity Window** | When is snorkelling likely best? | Recent wave energy, wind, rain/runoff, currents, seabed type and camera visibility evidence. |
| **Easy Entry** | How comfortable is entering the sea? | Shore slope, wave height/period, current, water temperature and visible shore break. |
| **Heat & Shade Load** | When will sun exposure become uncomfortable? | UV, apparent temperature, humidity, breeze, shade availability and solar angle. |
| **Kite Launchability** | Is the spot usable, not just windy? | Wind direction, gustiness, launch-zone space, crowding, obstacles and rider level. |
| **Surf Consistency** | Is the swell organised and suitable? | Swell vs wind-wave components, period, direction, offshore/onshore wind and spot exposure. |
| **Parking Pressure** | How much arrival friction should I expect? | Historical weekday/time curve, reports and camera observation only when the parking area is visible. |
| **Arrival Risk** | If I leave now, am I likely to get in and park? | Official access quota/reservation status, Beach Pulse, visible parking occupancy, historical arrival curve and current travel time. |
| **Sunset Comfort** | Is an aperitivo outdoors worth planning? | Horizon cloud, wind chill, humidity, sunset azimuth, venue proximity and travel time. |
| **Mosquito Evening Risk** | Will a calm wetland sunset be uncomfortable? | Wetland proximity, sunset temperature/humidity, recent rain and low-wind conditions. |
| **Water Confidence** | Are official bathing checks clear and current? | Current ARPAS/Ministero status and prohibitions, sample age, EEA long-term class and history. Blue Flag remains a separate award badge. |
| **Plan Resilience** | How likely is the day plan to survive a change? | Forecast uncertainty plus the number and travel cost of compatible fallback beaches. |

## Camera-analysis design

1. Capture one authorized frame every 30 minutes during useful daylight hours, never proxy the continuous video.
2. Apply a manually configured beach polygon so sky, roads, sea and private areas are excluded from crowd estimation.
3. Use inexpensive change detection first; call OpenAI vision only when the frame materially changes or the cache expires.
4. Ask for structured scene observations: crowd band, usable-space band, whitecaps, visible shore break, cloud band, visibility, possible shoreline debris/Posidonia, camera obstruction and confidence.
5. Fuse observations with forecasts in deterministic code. The language model observes; AJÒ's transparent scoring layer decides.
6. Store only aggregate results. Do not identify, recognise, track or profile people; do not retain raw frames beyond the minimal processing window.
7. If the camera is dark, wet, obstructed, moving or poorly aimed, return `unavailable` rather than inventing a value.

## Recommended contest slice

Demonstrate three beaches with cached conditions and one authorized/demo camera snapshot each:

- **Sea Truth**: forecast vs camera agreement.
- **Beach Pulse**: quiet / balanced / busy / saturated with confidence.
- **Arrival Risk**: access quota, likely parking pressure and a latest sensible departure time.
- **Posidonia Shorecast**: unlikely / possible / likely with contributing factors.
- **Sand Sting**: low / moderate / high.
- **Plan Resilience**: primary beach plus an agent-selected fallback.

The full AJÒ agent then turns those signals into a timed beach, sport and aperitivo itinerary, monitors the mission and replans when a signal crosses a threshold.

## Candidate open and official inputs

- Open-Meteo Marine API: waves, swell, period, direction, sea temperature and currents — <https://open-meteo.com/en/docs/marine-weather-api>
- Regione Sardegna / ARPAS bathing-water monitoring and current notices — <https://www.sardegnaambiente.it/balneazione/>
- EEA bathing-water REST services — <https://water.discomap.eea.europa.eu/arcgis/rest/services/BathingWater>
- OpenAI image-capable models through the Responses API — <https://developers.openai.com/api/docs/models>
