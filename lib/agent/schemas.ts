import { z } from "zod";

export const ProfileSchema = z.object({
  mission: z.enum(["relax", "life", "surf", "kite"]),
  origin: z.string().min(1).max(80),
  level: z.enum(["beginner", "intermediate", "expert"]),
  family: z.boolean(),
  accessible: z.boolean(),
  maxDrive: z.number().int().min(10).max(360),
});

export const AgentDecisionSchema = z.object({
  summary: z.string().min(12).max(240),
  window: z.string().min(5).max(40),
  departure: z.string().min(5).max(60),
  topId: z.string().min(2).max(80),
  alternativeIds: z.array(z.string().min(2).max(80)).max(2),
  watchReason: z.string().min(8).max(180),
});

export const ChangeEventSchema = z.object({
  type: z.enum(["wind-spike", "crowding", "parking", "posidonia"]),
  spotId: z.string().min(2).max(80),
  severity: z.enum(["moderate", "high"]),
  observedAt: z.string().datetime().optional(),
});

export type AgentDecision = z.infer<typeof AgentDecisionSchema>;
export type ChangeEvent = z.infer<typeof ChangeEventSchema>;
