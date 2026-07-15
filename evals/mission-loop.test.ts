import { describe, expect, it } from "vitest";
import { buildDemoPlan, Profile, rankSpots } from "../lib/engine";
import { AgentDecisionSchema, ChangeEventSchema, ProfileSchema } from "../lib/agent/schemas";
import { SPOTS } from "../lib/spots";

const base: Omit<Profile, "mission"> = {
  origin: "Cagliari",
  level: "intermediate",
  family: true,
  accessible: false,
  maxDrive: 70,
};

describe("AJÒ deterministic eval set", () => {
  for (const mission of ["relax", "life", "surf", "kite"] as const) {
    it(`${mission} produces a grounded and recoverable mission`, () => {
      const profile = ProfileSchema.parse({ ...base, mission });
      const ranked = rankSpots(profile);
      const plan = buildDemoPlan(profile);

      expect(ranked).toHaveLength(SPOTS.length);
      expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
      expect(SPOTS.some((spot) => spot.id === plan.top.id)).toBe(true);
      expect(plan.alternatives).toHaveLength(2);
      expect(new Set([plan.top.id, ...plan.alternatives.map((spot) => spot.id)]).size).toBe(3);
      expect(plan.watch.fallback).not.toBe(plan.top.name);
      expect(plan.top.reasons.length).toBeGreaterThan(0);
      expect(plan.top.webcam.url).toMatch(/^https:\/\//);
      expect(plan.top.signals.crowding.score).toBeGreaterThanOrEqual(0);
      expect(plan.top.signals.crowding.score).toBeLessThanOrEqual(100);
      expect(Date.parse(plan.top.signals.camera.expiresAt) - Date.parse(plan.top.signals.camera.observedAt)).toBe(30 * 60 * 1000);
      expect(plan.top.signals.camera.retention).toBe("Images not retained");
      expect(plan.top.uvIndex).toBeGreaterThanOrEqual(0);
      expect(plan.top.apparentTemperature).toBeTypeOf("number");
    });
  }

  it("rejects an unbounded or invented agent decision", () => {
    expect(() => AgentDecisionSchema.parse({
      summary: "Too short",
      window: "anytime",
      departure: "whenever",
      topId: "x",
      alternativeIds: ["one", "two", "three"],
      watchReason: "unknown",
    })).toThrow();
  });

  it("accepts only typed watch observations", () => {
    expect(ChangeEventSchema.parse({ type: "crowding", spotId: "poetto", severity: "high" }).type).toBe("crowding");
    expect(() => ChangeEventSchema.parse({ type: "vibes", spotId: "poetto", severity: "high" })).toThrow();
  });
});
