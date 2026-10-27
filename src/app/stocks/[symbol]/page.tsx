"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GROWTH_METRICS } from "@/lib/stocks/growth";
import { fmtDate, fmtMoney, fmtPct, fmtPrice, fmtRatio, pctClass, timeAgo } from "@/lib/stocks/format";
import type { CompanyDetail, IncomePeriod } from "@/lib/stocks/types";

export default function CompanyPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setError(null);
    fetch(`/api/stocks/company/${encodeURIComponent(symbol)}`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) setError(json.error ?? `Request failed (${res.status})`);
        else setDetail(json as CompanyDetail);
      })
      .catch((err) => !cancelled && setError((err as Error).message));
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  useEffect(() => {
    document.title = detail ? `${detail.row.name} (${symbol}) – Value screener` : `${symbol} – Value screener`;
  }, [detail, symbol]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/stocks" className="text-sm text-zinc-400 hover:text-zinc-200">← Back to screener</Link>

        {error && <div className="mt-4 rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">{error}</div>}
        {!detail && !error && <p className="mt-8 text-zinc-500">Loading {symbol}… (news, financial history and competitors are fetched live)</p>}
        {detail && <Detail detail={detail} />}
      </div>
    </main>
  );
}

function Detail({ detail }: { detail: CompanyDetail }) {
  const { row, news, developments, competitors } = detail;
  const f = row.fundamentals;
  const cur = row.currency ?? "USD";

  return (
    <>
      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {row.name} <span className="text-zinc-500">({row.symbol})</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {row.sector} · {row.industry}
            {f?.website && (
              <>
                {" · "}
                <a href={f.website} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">{f.website.replace(/^https?:\/\//, "")}</a>
              </>
            )}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums">{fmtPrice(row.price, cur)}</div>
          <div className={`text-sm tabular-nums ${pctClass(row.fiftyTwoWeekChange)}`}>{fmtPct(row.fiftyTwoWeekChange)} over 52 weeks</div>
        </div>
      </header>

      {f?.error && (
        <div className="mt-4 rounded-md border border-amber-900 bg-amber-950/40 px-3 py-2 text-sm text-amber-300">Fundamentals could not be loaded: {f.error}</div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Stat label="Market cap" value={fmtMoney(row.marketCap, cur)} />
        <Stat label="P/E (trailing)" value={fmtRatio(row.trailingPE)} />
        <Stat label="P/E (forward)" value={fmtRatio(row.forwardPE ?? f?.forwardPE)} />
        <Stat label="P/S (TTM)" value={fmtRatio(f?.priceToSales, 2)} />
        <Stat label="PEG" value={fmtRatio(f?.pegRatio, 2)} />
        <Stat label="EV / EBITDA" value={fmtRatio(f?.evToEbitda)} />
        <Stat label="Price / book" value={fmtRatio(f?.priceToBook, 2)} />
        <Stat label="Net margin" value={fmtPct(f?.profitMargin)} tone={pctClass(f?.profitMargin)} />
        <Stat label="Operating margin" value={fmtPct(f?.operatingMargin)} tone={pctClass(f?.operatingMargin)} />
        <Stat label="Revenue (TTM)" value={fmtMoney(f?.totalRevenueTtm, cur)} />
        <Stat label="Free cash flow" value={fmtMoney(f?.freeCashflow, cur)} />
        <Stat label="Next earnings" value={fmtDate(f?.nextEarningsDate)} />
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Growth</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {GROWTH_METRICS.map((m) => (
                <Stat key={m.key} label={m.label} value={fmtPct(f?.growth[m.key])} tone={pctClass(f?.growth[m.key])} title={m.description} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Annual income statement</h2>
            <IncomeTable periods={f?.annual ?? []} currency={cur} yoyLag={1} />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Quarterly income statement</h2>
            <IncomeTable periods={(f?.quarterly ?? []).slice(-8)} allPeriods={f?.quarterly ?? []} currency={cur} yoyLag={4} />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Top competitors</h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <tr>
                    <th className="px-3 py-2">Company</th>
                    <th className="px-3 py-2 text-right">Mkt cap</th>
                    <th className="px-3 py-2 text-right">P/E</th>
                    <th className="px-3 py-2 text-right">Fwd P/E</th>
                    <th className="px-3 py-2 text-right">P/S</th>
                    <th className="px-3 py-2 text-right">PEG</th>
                    <th className="px-3 py-2 text-right">Net margin</th>
                    <th className="px-3 py-2 text-right">Rev growth (FY)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <CompetitorTr
                    c={{ symbol: row.symbol, name: row.name, marketCap: row.marketCap, trailingPE: row.trailingPE, forwardPE: row.forwardPE, priceToSales: f?.priceToSales, pegRatio: f?.pegRatio, profitMargin: f?.profitMargin, revenueGrowth: f?.growth.revenueGrowthFy ?? f?.yahooRevenueGrowth, source: "yahoo" }}
                    self
                  />
                  {competitors.map((c) => (
                    <CompetitorTr key={c.symbol} c={c} />
                  ))}
                  {competitors.length === 0 && (
                    <tr><td colSpan={8} className="px-3 py-6 text-center text-zinc-500">No competitor data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Peers come from Yahoo Finance&apos;s similar-companies list; rows marked “industry” are same-GICS-industry S&amp;P 500 members used to fill the list.
            </p>
          </section>
        </div>

        <aside className="space-y-8">
          {developments.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Significant developments</h2>
              <ul className="space-y-2 text-sm">
                {developments.map((d, i) => (
                  <li key={i} className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2">
                    <div className="text-xs text-zinc-500">{fmtDate(d.date)}</div>
                    <div>{d.headline}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-semibold">Latest news</h2>
            <p className="mb-3 text-xs text-zinc-500">Tagged articles mention earnings, revenue, guidance, margins, M&amp;A or other drivers of growth and profit, and are listed first.</p>
            <ul className="space-y-3">
              {news.map((n) => (
                <li key={n.id} className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3">
                  <a href={n.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-100 hover:text-emerald-400">{n.title}</a>
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-zinc-500">
                    <span>{n.publisher}</span>
                    {n.publishedAt && <span>· {timeAgo(n.publishedAt)}</span>}
                  </div>
                  {n.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {n.tags.map((t) => (
                        <span key={t} className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">{t}</span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              {news.length === 0 && <li className="text-sm text-zinc-500">No recent news found.</li>}
            </ul>
          </section>

          {f?.summary && (
            <section>
              <h2 className="mb-2 text-lg font-semibold">About</h2>
              <p className="text-sm leading-relaxed text-zinc-400">{f.summary}</p>
              {f.employees && <p className="mt-2 text-xs text-zinc-500">{f.employees.toLocaleString()} employees</p>}
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

function Stat({ label, value, tone, title }: { label: string; value: string; tone?: string; title?: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2" title={title}>
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className={`mt-0.5 text-base font-semibold tabular-nums ${tone ?? ""}`}>{value}</div>
    </div>
  );
}

function IncomeTable({ periods, allPeriods, currency, yoyLag }: { periods: IncomePeriod[]; allPeriods?: IncomePeriod[]; currency: string; yoyLag: number }) {
  const series = allPeriods ?? periods;
  const yoy = (p: IncomePeriod, field: "totalRevenue" | "netIncome" | "dilutedEPS") => {
    const idx = series.indexOf(p);
    const prior = series[idx - yoyLag];
    const a = p[field];
    const b = prior?.[field];
    if (a === undefined || b === undefined || b <= 0) return undefined;
    return a / b - 1;
  };
  if (periods.length === 0) return <p className="text-sm text-zinc-500">No data.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[560px] text-sm">
        <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
          <tr>
            <th className="px-3 py-2">Period end</th>
            <th className="px-3 py-2 text-right">Revenue</th>
            <th className="px-3 py-2 text-right">YoY</th>
            <th className="px-3 py-2 text-right">Operating income</th>
            <th className="px-3 py-2 text-right">Net income</th>
            <th className="px-3 py-2 text-right">YoY</th>
            <th className="px-3 py-2 text-right">Diluted EPS</th>
            <th className="px-3 py-2 text-right">YoY</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {[...periods].reverse().map((p) => (
            <tr key={p.date}>
              <td className="px-3 py-2 text-zinc-300">{fmtDate(p.date)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(p.totalRevenue, currency)}</td>
              <td className={`px-3 py-2 text-right tabular-nums ${pctClass(yoy(p, "totalRevenue"))}`}>{fmtPct(yoy(p, "totalRevenue"))}</td>
              <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(p.operatingIncome, currency)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(p.netIncome, currency)}</td>
              <td className={`px-3 py-2 text-right tabular-nums ${pctClass(yoy(p, "netIncome"))}`}>{fmtPct(yoy(p, "netIncome"))}</td>
              <td className="px-3 py-2 text-right tabular-nums">{p.dilutedEPS !== undefined ? p.dilutedEPS.toFixed(2) : "–"}</td>
              <td className={`px-3 py-2 text-right tabular-nums ${pctClass(yoy(p, "dilutedEPS"))}`}>{fmtPct(yoy(p, "dilutedEPS"))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompetitorTr({ c, self }: { c: CompanyDetail["competitors"][number]; self?: boolean }) {
  return (
    <tr className={self ? "bg-emerald-950/30" : "hover:bg-zinc-900/60"}>
      <td className="px-3 py-2">
        {self ? (
          <span className="font-medium">{c.symbol}</span>
        ) : (
          <Link href={`/stocks/${c.symbol}`} className="font-medium text-emerald-400 hover:underline">{c.symbol}</Link>
        )}
        <div className="max-w-[220px] truncate text-xs text-zinc-400" title={c.name}>
          {c.name}
          {!self && c.source === "industry" && <span className="ml-1 text-zinc-600">(industry)</span>}
        </div>
      </td>
      <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(c.marketCap)}</td>
      <td className="px-3 py-2 text-right tabular-nums">{fmtRatio(c.trailingPE)}</td>
      <td className="px-3 py-2 text-right tabular-nums">{fmtRatio(c.forwardPE)}</td>
      <td className="px-3 py-2 text-right tabular-nums">{fmtRatio(c.priceToSales, 2)}</td>
      <td className="px-3 py-2 text-right tabular-nums">{fmtRatio(c.pegRatio, 2)}</td>
      <td className={`px-3 py-2 text-right tabular-nums ${pctClass(c.profitMargin)}`}>{fmtPct(c.profitMargin)}</td>
      <td className={`px-3 py-2 text-right tabular-nums ${pctClass(c.revenueGrowth)}`}>{fmtPct(c.revenueGrowth)}</td>
    </tr>
  );
}
