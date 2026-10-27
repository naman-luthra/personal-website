"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GROWTH_METRICS } from "@/lib/stocks/growth";
import { MARKET_CAP_OPTIONS, fmtMoney, fmtPct, fmtRatio, pctClass } from "@/lib/stocks/format";
import type { GrowthMetricKey, ScreenResponse, ScreenerRow, SortKey } from "@/lib/stocks/types";

interface Filters {
  minMarketCap: number;
  sortBy: SortKey;
  growthMetric: GrowthMetricKey;
  minGrowth: string;
  maxPE: string;
  maxPS: string;
  sector: string;
  limit: number;
}

const DEFAULT_FILTERS: Filters = {
  minMarketCap: 10e9,
  sortBy: "pe",
  growthMetric: "revenueCagr3y",
  minGrowth: "",
  maxPE: "",
  maxPS: "",
  sector: "",
  limit: 50,
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "pe", label: "P/E (trailing), low → high" },
  { value: "ps", label: "P/S (trailing 12m), low → high" },
  { value: "forwardPE", label: "Forward P/E, low → high" },
  { value: "growth", label: "Selected growth metric, high → low" },
  { value: "marketCap", label: "Market cap, high → low" },
];

type ApiResponse = ScreenResponse & { sectors: string[] };

function toQuery(f: Filters): string {
  const sp = new URLSearchParams();
  sp.set("minMarketCap", String(f.minMarketCap));
  sp.set("sortBy", f.sortBy);
  sp.set("growthMetric", f.growthMetric);
  if (f.minGrowth !== "") sp.set("minGrowth", f.minGrowth);
  if (f.maxPE !== "") sp.set("maxPE", f.maxPE);
  if (f.maxPS !== "") sp.set("maxPS", f.maxPS);
  if (f.sector) sp.set("sector", f.sector);
  sp.set("limit", String(f.limit));
  return sp.toString();
}

const inputClass =
  "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400";

export default function StocksPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const growthLabel = useMemo(
    () => GROWTH_METRICS.find((m) => m.key === filters.growthMetric)?.label ?? "Growth",
    [filters.growthMetric],
  );

  const load = useCallback(async (f: Filters, silent = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/stocks/screen?${toQuery(f)}`, { signal: controller.signal });
      const json = (await res.json()) as ApiResponse;
      setData(json);
      setError(json.error ?? null);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Fetch on filter change (debounced for the free-text inputs).
  useEffect(() => {
    const t = setTimeout(() => load(filters), 300);
    return () => clearTimeout(t);
  }, [filters, load]);

  // While the server is still enriching the universe, poll so rows fill in.
  const enriching = data !== null && !data.error && data.enriched < data.total;
  useEffect(() => {
    if (!enriching) return;
    const t = setInterval(() => load(filters, true), 4000);
    return () => clearInterval(t);
  }, [enriching, filters, load]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Value screener</h1>
            <p className="mt-1 text-sm text-zinc-400">
              S&amp;P 500 companies ranked by valuation, with growth filters, news and competitor ratios. Data: Yahoo Finance.
            </p>
          </div>
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
            ← Back to site
          </Link>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass} htmlFor="minMarketCap">Minimum market cap</label>
            <select id="minMarketCap" className={inputClass} value={filters.minMarketCap} onChange={(e) => set("minMarketCap", Number(e.target.value))}>
              {MARKET_CAP_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="sortBy">Sort by</label>
            <select id="sortBy" className={inputClass} value={filters.sortBy} onChange={(e) => set("sortBy", e.target.value as SortKey)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="sector">Sector</label>
            <select id="sector" className={inputClass} value={filters.sector} onChange={(e) => set("sector", e.target.value)}>
              <option value="">All sectors</option>
              {(data?.sectors ?? []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="limit">Rows</label>
            <select id="limit" className={inputClass} value={filters.limit} onChange={(e) => set("limit", Number(e.target.value))}>
              {[25, 50, 100, 200].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="growthMetric">Growth metric</label>
            <select id="growthMetric" className={inputClass} value={filters.growthMetric} onChange={(e) => set("growthMetric", e.target.value as GrowthMetricKey)}>
              {GROWTH_METRICS.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-zinc-500">{GROWTH_METRICS.find((m) => m.key === filters.growthMetric)?.description}</p>
          </div>
          <div>
            <label className={labelClass} htmlFor="minGrowth">Minimum growth (%)</label>
            <input id="minGrowth" className={inputClass} type="number" placeholder="e.g. 10" value={filters.minGrowth} onChange={(e) => set("minGrowth", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass} htmlFor="maxPE">Max P/E</label>
              <input id="maxPE" className={inputClass} type="number" placeholder="any" value={filters.maxPE} onChange={(e) => set("maxPE", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="maxPS">Max P/S</label>
              <input id="maxPS" className={inputClass} type="number" step="0.1" placeholder="any" value={filters.maxPS} onChange={(e) => set("maxPS", e.target.value)} />
            </div>
          </div>
        </section>

        <StatusBar data={data} loading={loading} error={error} />

        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Sector</th>
                <th className="px-3 py-2 text-right">Mkt cap</th>
                <th className="px-3 py-2 text-right">P/E</th>
                <th className="px-3 py-2 text-right">Fwd P/E</th>
                <th className="px-3 py-2 text-right">P/S</th>
                <th className="px-3 py-2 text-right">PEG</th>
                <th className="px-3 py-2 text-right">Net margin</th>
                <th className="px-3 py-2 text-right" title={growthLabel}>{growthLabel}</th>
                <th className="px-3 py-2 text-right">Rev YoY (last Q)</th>
                <th className="px-3 py-2 text-right">52w</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data?.rows.map((r, i) => (
                <Row key={r.symbol} row={r} index={i + 1} growthMetric={filters.growthMetric} />
              ))}
              {data && data.rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={12} className="px-3 py-8 text-center text-zinc-500">
                    {data.pendingMatches > 0 ? "Matching companies are still loading fundamentals…" : "No companies match these filters."}
                  </td>
                </tr>
              )}
              {!data && (
                <tr>
                  <td colSpan={12} className="px-3 py-8 text-center text-zinc-500">{error ?? "Loading quotes…"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Companies with negative trailing earnings are excluded (no meaningful P/E). Growth metrics come from reported income statements; “–” means the base period was a loss or data is missing. Not investment advice.
        </p>
      </div>
    </main>
  );
}

function StatusBar({ data, loading, error }: { data: ApiResponse | null; loading: boolean; error: string | null }) {
  if (error) {
    return <div className="mb-3 rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">{error}</div>;
  }
  if (!data) return null;
  const pct = data.total ? Math.round((data.enriched / data.total) * 100) : 0;
  return (
    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
      <span>{data.rows.length} shown</span>
      {data.enriched < data.total ? (
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-32 overflow-hidden rounded bg-zinc-800">
            <span className="block h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </span>
          Loading fundamentals {data.enriched}/{data.total}
          {data.pendingMatches > 0 && ` · ${data.pendingMatches} matching companies pending`}
        </span>
      ) : (
        <span>Fundamentals loaded for all {data.total} companies</span>
      )}
      {data.quotesUpdatedAt && <span>Quotes as of {new Date(data.quotesUpdatedAt).toLocaleTimeString()}</span>}
      {loading && <span className="text-emerald-400">Updating…</span>}
    </div>
  );
}

function Row({ row, index, growthMetric }: { row: ScreenerRow; index: number; growthMetric: GrowthMetricKey }) {
  const f = row.fundamentals;
  const g = f?.growth[growthMetric];
  return (
    <tr className="hover:bg-zinc-900/60">
      <td className="px-3 py-2 text-zinc-500">{index}</td>
      <td className="px-3 py-2">
        <Link href={`/stocks/${row.symbol}`} className="font-medium text-emerald-400 hover:underline">
          {row.symbol}
        </Link>
        <div className="max-w-[220px] truncate text-xs text-zinc-400" title={row.name}>{row.name}</div>
      </td>
      <td className="px-3 py-2 text-xs text-zinc-400">
        <div>{row.sector}</div>
        <div className="max-w-[180px] truncate text-zinc-500" title={row.industry}>{row.industry}</div>
      </td>
      <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(row.marketCap, row.currency)}</td>
      <td className="px-3 py-2 text-right tabular-nums font-medium">{fmtRatio(row.trailingPE)}</td>
      <td className="px-3 py-2 text-right tabular-nums">{fmtRatio(row.forwardPE)}</td>
      <td className="px-3 py-2 text-right tabular-nums">{f ? fmtRatio(f.priceToSales, 2) : <Pending />}</td>
      <td className="px-3 py-2 text-right tabular-nums">{f ? fmtRatio(f.pegRatio, 2) : <Pending />}</td>
      <td className={`px-3 py-2 text-right tabular-nums ${pctClass(f?.profitMargin)}`}>{f ? fmtPct(f.profitMargin) : <Pending />}</td>
      <td className={`px-3 py-2 text-right tabular-nums font-medium ${pctClass(g)}`}>{f ? fmtPct(g) : <Pending />}</td>
      <td className={`px-3 py-2 text-right tabular-nums ${pctClass(f?.yahooRevenueGrowth)}`}>{f ? fmtPct(f.yahooRevenueGrowth) : <Pending />}</td>
      <td className={`px-3 py-2 text-right tabular-nums ${pctClass(row.fiftyTwoWeekChange)}`}>{fmtPct(row.fiftyTwoWeekChange, 0)}</td>
    </tr>
  );
}

function Pending() {
  return <span className="text-zinc-600">…</span>;
}
