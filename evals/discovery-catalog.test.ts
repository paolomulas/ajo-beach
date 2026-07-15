import { describe, expect, it } from "vitest";
import { DISCOVERY_BEACHES, discoveryFit, osmMapUrl } from "../lib/discovery-catalog";

describe("open beach discovery catalogue", () => {
  it("adds meaningful island coverage without duplicate identifiers", () => {
    expect(DISCOVERY_BEACHES.length).toBeGreaterThanOrEqual(40);
    expect(new Set(DISCOVERY_BEACHES.map((beach) => beach.id)).size).toBe(DISCOVERY_BEACHES.length);
    expect(new Set(DISCOVERY_BEACHES.map((beach) => beach.coast))).toEqual(new Set(["north", "south", "east", "west"]));
  });

  it("keeps all POIs inside Sardinia map bounds and attributed", () => {
    for (const beach of DISCOVERY_BEACHES) {
      expect(beach.lat).toBeGreaterThanOrEqual(38.75);
      expect(beach.lat).toBeLessThanOrEqual(41.35);
      expect(beach.lon).toBeGreaterThanOrEqual(8.05);
      expect(beach.lon).toBeLessThanOrEqual(9.85);
      expect(beach.source).toBe("OpenStreetMap");
      expect(osmMapUrl(beach)).toContain("openstreetmap.org");
    }
  });

  it("produces bounded deterministic discovery fit, not a live score", () => {
    for (const beach of DISCOVERY_BEACHES) {
      for (const mission of ["relax", "life", "surf", "kite"] as const) {
        expect(discoveryFit(beach, mission)).toBe(discoveryFit(beach, mission));
        expect(discoveryFit(beach, mission)).toBeGreaterThanOrEqual(68);
        expect(discoveryFit(beach, mission)).toBeLessThanOrEqual(91);
      }
    }
  });
});
