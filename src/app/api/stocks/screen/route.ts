import { NextRequest, NextResponse } from "next/server";
import { GROWTH_METRICS } from "@/lib/stocks/growth";
import { DEFAULT_PARAMS, listSectors, screen } from "@/lib/stocks/screener";
import type { GrowthMetricKey, ScreenParams, SortKey } from "@/lib/stocks/types";

export const dynamic = "force-dynamic";

const SORT_KEYS: SortKey[] = ["pe", "ps", "forwardPE", "marketCap", "growth"];

function num(v: string | null): number | undefined {
  if (v === null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function parseParams(sp: URLSearchParams): ScreenParams {
  const sortBy = sp.get("sortBy") as SortKey | null;
  const growthMetric = sp.get("growthMetric") as GrowthMetricKey | null;
  const minGrowthPct = num(sp.get("minGrowth"));
  return {
    minMarketCap: num(sp.get("minMarketCap")) ?? DEFAULT_PARAMS.minMarketCap,
    sortBy: sortBy && SORT_KEYS.includes(sortBy) ? sortBy : DEFAULT_PARAMS.sortBy,
    growthMetric: growthMetric && GROWTH_METRICS.some((m) => m.key === growthMetric) ? growthMetric : DEFAULT_PARAMS.growthMetric,
    minGrowth: minGrowthPct !== undefined ? minGrowthPct / 100 : undefined,
    maxPE: num(sp.get("maxPE")),
    maxPS: num(sp.get("maxPS")),
    sector: sp.get("sector") || undefined,
    limit: Math.min(Math.max(num(sp.get("limit")) ?? DEFAULT_PARAMS.limit, 1), 200),
  };
}

export async function GET(req: NextRequest) {
  const params = parseParams(req.nextUrl.searchParams);
  try {
    const result = await screen(params);
    return NextResponse.json({ ...result, params, sectors: listSectors() });
  } catch (err) {
    const message = (err as Error).message ?? "Unknown error";
    return NextResponse.json({ rows: [], enriched: 0, total: 0, pendingMatches: 0, quotesUpdatedAt: null, params, sectors: listSectors(), error: message }, { status: 502 });
  }
}
