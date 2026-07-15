import { NextResponse } from "next/server";
import { getLiveConditions } from "@/lib/live";

export async function GET() {
  try {
    const conditions = await getLiveConditions();
    return NextResponse.json({ source: "Open-Meteo", cachedFor: "15 minutes", conditions });
  } catch {
    return NextResponse.json({ source: "unavailable", conditions: {} }, { status: 503 });
  }
}
