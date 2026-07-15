# Sardinian bathing-water and environmental quality sources

Updated: 15 July 2026

## Product rule

AJÒ must not collapse health status, environmental awards and satellite observations
into one misleading "clean sea" score. They answer different questions:

| Layer | User question | Update cadence |
|---|---|---|
| Official bathing status | Is bathing currently permitted and what did the latest sample show? | Daily check during season or on publication |
| EU long-term class | How has this bathing water performed across recent seasons? | Annual |
| Blue Flag | Did the managed beach meet the programme's water, environment, education, safety, services and accessibility criteria this year? | Annual |
| Environmental protection | Is the beach in or near a protected habitat with special rules? | On source release / rare |
| Ocean-colour observation | Are turbidity, suspended matter or chlorophyll unusual near this coast? | Cached satellite refresh |

An active official prohibition always overrides ranking and agent language. Absence of
a Blue Flag is neutral: beaches may be excellent but not entered in the voluntary
programme.

## Source precedence

### 1. Current Italian and Sardinian bathing status

Primary sources:

- Italian Ministry of Health Portale Acque:
  <https://www.portaleacque.salute.gov.it/PortaleAcquePubblico/homeBalneazione?lang=it>
- Sardegna Ambiente bathing portal and ARPAS communications:
  <https://sardegnaambiente.it/balneazione/>

These provide or link current-season bathing areas, monitoring, out-of-range results
and municipal prohibition orders. Use them for current bathing status, latest sample
and official restrictions.

Do not reverse-engineer an undocumented private endpoint. Until a documented feed or
permission is available, use an official deep link plus curated contest fixtures whose
source and capture date are shown. A future production adapter may consume a formally
published regional/national feed.

### 2. Comparable European classification

The EEA/WISE Bathing Water Directive service exposes station-level classifications and
supports JSON/GeoJSON queries:

- <https://water.discomap.eea.europa.eu/arcgis/rest/services/BathingWater>
- European Commission overview:
  <https://environment.ec.europa.eu/topics/water/bathing-water_en>

The EU classes are `excellent`, `good`, `sufficient`, `poor` or `not_classified` and
are based on E. coli and intestinal enterococci over the required multi-season dataset.
They are health-oriented microbiological classifications, not a complete ecological or
visual-clarity assessment.

This is AJÒ's best international index for comparing Sardinian bathing waters with
other European destinations. Cache the annual station snapshot in the repository for
the demo when licence/attribution terms permit, and refresh it server-side in
production.

### 3. Blue Flag

Primary sources:

- Blue Flag international programme and criteria: <https://www.blueflag.global/criteria>
- FEE Italia 2026 list: <https://www.bandierablu.org/common/blueflag.asp?anno=2026&tipo=bb>
- Official Italian Tourism Ministry list:
  <https://www.ministeroturismo.gov.it/wp-content/uploads/2026/05/Elenco-Spiagge-Bandiera-Blu-2026.pdf>

For 2026, official Sardinian tourism material reports more than sixty awarded beaches
across 17 municipalities, with Teulada among the new entries. Store awards by exact
beach/site and award year, not merely by municipality, because a municipal award does
not automatically describe every nearby shoreline.

Display Blue Flag as a recognisable trust and management badge. It may contribute a
small preference bonus for users seeking managed services or accessibility, but must
not override fresh official water restrictions or dominate natural/wild-beach ranking.

### 4. Copernicus Marine ocean colour

Copernicus Marine offers Sentinel-2 high-resolution products for European coastal
waters, including the Mediterranean product
`OCEANCOLOUR_MED_BGC_HR_L3_NRT_009_205`. Variables include chlorophyll, turbidity,
suspended matter and reflectance at approximately 100 m resolution:

- <https://help.marine.copernicus.eu/en/articles/5194057-introduction-to-ocean-colour-sentinel-2-high-resolution-products>

Use this only for environmental context such as a `Clarity Evidence` or coastal anomaly
signal. Cloud cover, acquisition time, bottom reflectance and near-shore effects can
make a pixel unavailable or ambiguous. It must never declare water safe for bathing or
replace microbiological sampling.

### 5. Natura 2000 and protected areas

EEA provides Natura 2000 vector and tabular datasets plus OGC services:

- <https://www.eea.europa.eu/en/datahub/datahubitem-view/6fc8ad2d-195d-40f4-bdec-576e7d1268e4/natura-2000>

This is not a beach-quality index. It supports `Eco Context`: protected habitat,
responsible-use notes, access restrictions and whether AJÒ should avoid routing more
people toward a sensitive location.

## Normalized data contract

```ts
type BathingWaterEvidence = {
  beachId: string;
  bathingAreaId?: string;
  current: {
    permitted: boolean | null;
    prohibitionReason?: "pollution" | "algae" | "other";
    latestSampleAt?: string;
    eColi?: number;
    intestinalEnterococci?: number;
    sourceUrl: string;
    checkedAt: string;
  };
  european?: {
    season: number;
    classification: "excellent" | "good" | "sufficient" | "poor" | "not_classified";
    stationId: string;
    sourceUrl: string;
  };
  blueFlag?: {
    awarded: boolean;
    year: number;
    exactSiteMatch: boolean;
    sourceUrl: string;
  };
  protectedAreas: Array<{
    name: string;
    scheme: "natura_2000" | "marine_protected_area";
    sourceUrl: string;
  }>;
  satellite?: {
    observedAt: string;
    turbidityBand?: "low" | "typical" | "elevated";
    chlorophyllAnomaly?: "below" | "typical" | "above";
    confidence: number;
    sourceUrl: string;
  };
};
```

The UI must show each source and date independently. Never calculate missing
microbiology values from satellite, camera or user reports.

## Derived UI signals

### Bathing Status

One of `permitted`, `prohibited`, `official_update_needed` or `unknown`, sourced only
from the competent authority. `Prohibited` removes the candidate from swimming plans.

### Water Confidence

A transparent evidence summary, not a new health certification:

- current official status;
- age of latest official sample;
- EU long-term class and assessment season;
- whether signals agree or one is missing.

### Blue Flag 2026

Annual badge with the exact awarded site and the explanation “environmental management,
water quality, education, safety, services and accessibility criteria”. Never show
“not clean” when the award is absent.

### Clarity Evidence

Combines recent wave/rain energy, authorized visual observation and optional Copernicus
turbidity. It describes likely visual clarity for snorkelling, not hygienic safety.

### Eco Context

Shows protected-area status and responsible-use constraints. It can lower routing
pressure to a sensitive beach even when conditions are attractive.

## Agent behavior

1. Retrieve this object from cache; GPT-5.6 never fetches or interprets raw portals.
2. Exclude swimming when `current.permitted === false`.
3. If current status is unknown, say so and link the official source.
4. Treat Blue Flag as a positive annual attribute and its absence as neutral.
5. Keep `Water Confidence`, `Clarity Evidence` and `Posidonia Shorecast` separate.
6. Replan only for an official prohibition/new valid result or a material mission
   preference—not for an unchanged annual badge.

## Cost profile

- Blue Flag: one static annual import, zero model calls.
- EEA class: one annual cache refresh, zero model calls.
- Ministry/ARPAS: daily/on-publication check, zero model calls.
- Natura 2000: versioned spatial import, zero model calls.
- Copernicus: optional cached subset processing, zero model calls.
- GPT-5.6 sees only the compact normalized object during an already-approved mission or
  replan; these sources never create an AI call by themselves unless an official
  prohibition materially changes an active mission.

## Contest implementation order

1. Add a curated Blue Flag 2026 exact-site fixture for the demo beaches.
2. Map those beaches to EEA bathing station identifiers and cached 2025 classes.
3. Add one clearly sourced current ARPAS/Ministero fixture plus official deep link.
4. Render separate status, EU class and Blue Flag chips with source dates.
5. Add an eval: a fresh official prohibition must override a Blue Flag and force a
   swimming-plan fallback.
6. Add Copernicus and protected-area context only after the core loop is complete.
