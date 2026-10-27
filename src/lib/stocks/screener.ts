import universeJson from "@/content/stocks/universe.json";
import { HOUR, MINUTE, cacheGet, cacheSet, cached } from "./cache";
import { computeGrowth } from "./growth";
import type {
  Fundamentals,
  IncomePeriod,
  ScreenParams,
  ScreenResponse,
  ScreenerRow,
  UniverseEntry,
} from "./types";
import { getYahoo, lenient } from "./yahoo";

export const UNIVERSE: UniverseEntry[] = universeJson as UniverseEntry[];
const BY_SYMBOL = new Map(UNIVERSE.map((u) => [u.symbol, u]));

const QUOTE_TTL = 15 * MINUTE;
const FUNDAMENTALS_TTL = 12 * HOUR;
const QUOTE_BATCH = 100;

type QuoteFields = Pick<
  ScreenerRow,
  "price" | "currency" | "marketCap" | "trailingPE" | "forwardPE" | "epsTtm" | "fiftyTwoWeekChange" | "analystRating"
> & { longName?: string };

/** Batch quotes for the whole universe. One Yahoo call per 100 symbols; cached for 15 minutes. */
async function getUniverseQuotes(): Promise<{ quotes: Map<string, QuoteFields>; updatedAt: number }> {
  return cached("universe-quotes", QUOTE_TTL, async () => {
    const yf = getYahoo();
    const quotes = new Map<string, QuoteFields>();
    const symbols = UNIVERSE.map((u) => u.symbol);
    for (let i = 0; i < symbols.length; i += QUOTE_BATCH) {
      const batch = symbols.slice(i, i + QUOTE_BATCH);
      try {
        const result = await yf.quote(batch, { return: "array" }, lenient);
        for (const q of result as any[]) {
          if (!q?.symbol) continue;
          quotes.set(q.symbol, {
            longName: q.longName ?? q.shortName,
            price: q.regularMarketPrice,
            currency: q.currency,
            marketCap: q.marketCap,
            trailingPE: q.trailingPE,
            forwardPE: q.forwardPE,
            epsTtm: q.epsTrailingTwelveMonths,
            fiftyTwoWeekChange: q.fiftyTwoWeekChangePercent !== undefined ? q.fiftyTwoWeekChangePercent / 100 : undefined,
            analystRating: q.averageAnalystRating,
          });
        }
      } catch (err) {
        console.error(`[stocks] quote batch ${i / QUOTE_BATCH} failed:`, (err as Error).message);
      }
    }
    if (quotes.size === 0) throw new Error("Yahoo Finance returned no quotes; is the network reachable?");
    return { quotes, updatedAt: Date.now() };
  });
}

function toPeriod(r: any): IncomePeriod {
  const d: Date = r.date instanceof Date ? r.date : new Date(r.date);
  return {
    date: d.toISOString().slice(0, 10),
    totalRevenue: r.totalRevenue ?? undefined,
    netIncome: r.netIncome ?? r.netIncomeCommonStockholders ?? undefined,
    dilutedEPS: r.dilutedEPS ?? undefined,
    operatingIncome: r.operatingIncome ?? undefined,
  };
}

function yearsAgo(n: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}

/** Fetch ratios, profile and income-statement history for one symbol. Cached for 12 hours. */
export async function getFundamentals(symbol: string): Promise<Fundamentals> {
  return cached(`fundamentals:${symbol}`, FUNDAMENTALS_TTL, async () => {
    const yf = getYahoo();
    try {
      const [summary, annualRaw, quarterlyRaw] = await Promise.all([
        yf.quoteSummary(
          symbol,
          { modules: ["summaryDetail", "financialData", "defaultKeyStatistics", "assetProfile", "calendarEvents"] },
          lenient,
        ) as Promise<any>,
        // 6 years back so a 3-year CAGR has a full base year even around fiscal year-ends.
        yf.fundamentalsTimeSeries(symbol, { period1: yearsAgo(6), type: "annual", module: "financials" }, lenient) as Promise<any[]>,
        // 3 years of quarters gives 8+ quarters with a year-ago comparison for each.
        yf.fundamentalsTimeSeries(symbol, { period1: yearsAgo(3), type: "quarterly", module: "financials" }, lenient) as Promise<any[]>,
      ]);

      const sd = summary?.summaryDetail ?? {};
      const fd = summary?.financialData ?? {};
      const ks = summary?.defaultKeyStatistics ?? {};
      const ap = summary?.assetProfile ?? {};
      const earningsDate: Date | undefined = summary?.calendarEvents?.earnings?.earningsDate?.[0];

      const annual = (annualRaw ?? []).map(toPeriod).sort((a, b) => a.date.localeCompare(b.date));
      const quarterly = (quarterlyRaw ?? []).map(toPeriod).sort((a, b) => a.date.localeCompare(b.date));

      return {
        priceToSales: sd.priceToSalesTrailing12Months,
        forwardPE: sd.forwardPE ?? ks.forwardPE,
        pegRatio: ks.pegRatio ?? ks.trailingPegRatio,
        priceToBook: ks.priceToBook,
        evToEbitda: ks.enterpriseToEbitda,
        profitMargin: fd.profitMargins,
        operatingMargin: fd.operatingMargins,
        yahooRevenueGrowth: fd.revenueGrowth,
        yahooEarningsGrowth: fd.earningsGrowth,
        totalRevenueTtm: fd.totalRevenue,
        freeCashflow: fd.freeCashflow,
        dividendYield: sd.dividendYield,
        nextEarningsDate: earningsDate ? new Date(earningsDate).toISOString().slice(0, 10) : undefined,
        website: ap.website,
        summary: ap.longBusinessSummary,
        employees: ap.fullTimeEmployees,
        industry: ap.industry,
        sector: ap.sector,
        growth: computeGrowth(annual, quarterly),
        annual,
        quarterly,
        fetchedAt: Date.now(),
      };
    } catch (err) {
      const message = (err as Error).message ?? String(err);
      console.error(`[stocks] fundamentals for ${symbol} failed: ${message}`);
      // Cache the failure briefly so one bad symbol doesn't get hammered on every poll.
      const failed: Fundamentals = { growth: {}, annual: [], quarterly: [], error: message, fetchedAt: Date.now() };
      cacheSet(`fundamentals:${symbol}`, failed, 10 * MINUTE);
      return failed;
    }
  });
}

/**
 * Background enrichment of the whole universe, largest companies first so the
 * usual "min market cap" screens fill in early. Runs once per process; re-runs
 * when fundamentals expire. Progress is observable via `enrichmentProgress()`.
 */
const g = globalThis as unknown as { __stockWarm?: { running: boolean; order: string[] } };
const warm = g.__stockWarm ?? (g.__stockWarm = { running: false, order: [] });

export function enrichmentProgress() {
  const enriched = UNIVERSE.filter((u) => cacheGet<Fundamentals>(`fundamentals:${u.symbol}`) !== undefined).length;
  return { enriched, total: UNIVERSE.length };
}

export async function warmUniverse() {
  if (warm.running) return;
  warm.running = true;
  try {
    const { quotes } = await getUniverseQuotes();
    warm.order = [...UNIVERSE]
      .sort((a, b) => (quotes.get(b.symbol)?.marketCap ?? 0) - (quotes.get(a.symbol)?.marketCap ?? 0))
      .map((u) => u.symbol);
    const CONCURRENCY = 3;
    let next = 0;
    const worker = async () => {
      while (next < warm.order.length) {
        const symbol = warm.order[next++];
        if (cacheGet(`fundamentals:${symbol}`) === undefined) await getFundamentals(symbol);
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  } catch (err) {
    console.error("[stocks] warm-up aborted:", (err as Error).message);
  } finally {
    warm.running = false;
  }
}

export async function getScreenerRow(symbol: string): Promise<ScreenerRow | undefined> {
  const entry = BY_SYMBOL.get(symbol);
  const { quotes } = await getUniverseQuotes();
  const q = quotes.get(symbol);
  if (!entry && !q) return undefined;
  const fundamentals = await getFundamentals(symbol);
  return {
    symbol,
    name: entry?.name ?? q?.longName ?? symbol,
    sector: entry?.sector ?? fundamentals.sector ?? "",
    industry: entry?.industry ?? fundamentals.industry ?? "",
    ...q,
    fundamentals,
  };
}

export const DEFAULT_PARAMS: ScreenParams = {
  minMarketCap: 10e9,
  sortBy: "pe",
  growthMetric: "revenueCagr3y",
  minGrowth: undefined,
  maxPE: undefined,
  maxPS: undefined,
  sector: undefined,
  limit: 50,
};

/** Apply the screen to the universe using whatever data is loaded; kicks off enrichment if needed. */
export async function screen(params: ScreenParams): Promise<ScreenResponse> {
  const { quotes, updatedAt } = await getUniverseQuotes();
  const progress = enrichmentProgress();
  if (progress.enriched < progress.total) void warmUniverse();

  const needsFundamentals = params.sortBy === "ps" || params.sortBy === "growth" || params.minGrowth !== undefined || params.maxPS !== undefined;
  let pendingMatches = 0;

  const rows: ScreenerRow[] = [];
  for (const u of UNIVERSE) {
    const q = quotes.get(u.symbol);
    if (!q) continue;
    if ((q.marketCap ?? 0) < params.minMarketCap) continue;
    if (params.sector && u.sector !== params.sector) continue;
    // Negative or missing P/E means losses; "low P/E" screens exclude those.
    if (q.trailingPE === undefined || q.trailingPE <= 0) continue;
    if (params.maxPE !== undefined && q.trailingPE > params.maxPE) continue;

    const fundamentals = cacheGet<Fundamentals>(`fundamentals:${u.symbol}`);
    if (needsFundamentals && !fundamentals) {
      pendingMatches++;
      continue;
    }
    if (fundamentals) {
      const ps = fundamentals.priceToSales;
      if (params.maxPS !== undefined && (ps === undefined || ps > params.maxPS)) continue;
      if (params.minGrowth !== undefined) {
        const gv = fundamentals.growth[params.growthMetric];
        if (gv === undefined || gv < params.minGrowth) continue;
      }
      if (params.sortBy === "ps" && (ps === undefined || ps <= 0)) continue;
    }
    rows.push({ ...u, ...q, fundamentals });
  }

  const key = (r: ScreenerRow): number => {
    switch (params.sortBy) {
      case "ps":
        return r.fundamentals?.priceToSales ?? Infinity;
      case "forwardPE":
        return r.forwardPE && r.forwardPE > 0 ? r.forwardPE : Infinity;
      case "marketCap":
        return -(r.marketCap ?? 0);
      case "growth":
        return -(r.fundamentals?.growth[params.growthMetric] ?? -Infinity);
      case "pe":
      default:
        return r.trailingPE ?? Infinity;
    }
  };
  rows.sort((a, b) => key(a) - key(b));

  return {
    rows: rows.slice(0, params.limit),
    enriched: progress.enriched,
    total: progress.total,
    pendingMatches,
    quotesUpdatedAt: updatedAt,
  };
}

export function listSectors(): string[] {
  return Array.from(new Set(UNIVERSE.map((u) => u.sector))).sort();
}

export function industryPeers(symbol: string, industry: string, limit: number): UniverseEntry[] {
  return UNIVERSE.filter((u) => u.industry === industry && u.symbol !== symbol).slice(0, limit);
}
