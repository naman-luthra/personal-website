import type { GrowthMetricKey, GrowthMetrics, IncomePeriod } from "./types";

/** Labels and descriptions for the growth selector in the UI. */
export const GROWTH_METRICS: { key: GrowthMetricKey; label: string; description: string }[] = [
  { key: "revenueCagr3y", label: "Revenue CAGR (3 yrs)", description: "Compound annual revenue growth over the last three fiscal years" },
  { key: "revenueGrowthFy", label: "Revenue growth (last FY)", description: "Latest fiscal year revenue vs the prior year" },
  { key: "revenueAvgQuarterlyYoy", label: "Revenue YoY, avg of last 4 qtrs", description: "Average of each of the last four quarters' revenue growth vs the same quarter a year earlier" },
  { key: "revenueLatestQuarterYoy", label: "Revenue YoY (latest quarter)", description: "Most recent quarter's revenue vs the same quarter last year" },
  { key: "netIncomeCagr3y", label: "Net income CAGR (3 yrs)", description: "Compound annual net income growth over the last three fiscal years (needs positive profit at both ends)" },
  { key: "netIncomeGrowthFy", label: "Net income growth (last FY)", description: "Latest fiscal year net income vs the prior year" },
  { key: "netIncomeAvgQuarterlyYoy", label: "Net income YoY, avg of last 4 qtrs", description: "Average of the last four quarters' net income growth vs a year earlier" },
  { key: "epsCagr3y", label: "Diluted EPS CAGR (3 yrs)", description: "Compound annual growth of diluted EPS over three fiscal years" },
  { key: "epsGrowthFy", label: "Diluted EPS growth (last FY)", description: "Latest fiscal year diluted EPS vs the prior year" },
];

function growth(latest?: number, prior?: number): number | undefined {
  if (latest === undefined || prior === undefined) return undefined;
  // Growth is meaningless off a non-positive base (e.g. loss -> profit).
  if (prior <= 0) return undefined;
  return latest / prior - 1;
}

function cagr(latest?: number, start?: number, years = 3): number | undefined {
  if (latest === undefined || start === undefined) return undefined;
  if (start <= 0 || latest <= 0) return undefined;
  return Math.pow(latest / start, 1 / years) - 1;
}

/** Average of the last `n` year-over-year growth rates in a quarterly series (needs n+4 quarters). */
function avgQuarterlyYoy(quarters: IncomePeriod[], field: keyof IncomePeriod, n = 4): number | undefined {
  const rates: number[] = [];
  for (let i = quarters.length - 1; i >= 4 && rates.length < n; i--) {
    const g = growth(quarters[i][field] as number | undefined, quarters[i - 4][field] as number | undefined);
    if (g !== undefined) rates.push(g);
  }
  if (rates.length < Math.min(n, 2)) return undefined;
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

/**
 * Derive growth metrics from income statements, oldest -> newest.
 * Series come straight from Yahoo's fundamentals time series; gaps are tolerated.
 */
export function computeGrowth(annual: IncomePeriod[], quarterly: IncomePeriod[]): GrowthMetrics {
  const a = annual.filter((p) => p.totalRevenue !== undefined);
  const latest = a[a.length - 1];
  const prior = a[a.length - 2];
  const threeBack = a[a.length - 4];
  const q = quarterly;
  const qLatest = q[q.length - 1];
  const qYearAgo = q[q.length - 5];

  return {
    revenueCagr3y: cagr(latest?.totalRevenue, threeBack?.totalRevenue),
    revenueGrowthFy: growth(latest?.totalRevenue, prior?.totalRevenue),
    revenueAvgQuarterlyYoy: avgQuarterlyYoy(q, "totalRevenue"),
    revenueLatestQuarterYoy: growth(qLatest?.totalRevenue, qYearAgo?.totalRevenue),
    netIncomeCagr3y: cagr(latest?.netIncome, threeBack?.netIncome),
    netIncomeGrowthFy: growth(latest?.netIncome, prior?.netIncome),
    netIncomeAvgQuarterlyYoy: avgQuarterlyYoy(q, "netIncome"),
    epsCagr3y: cagr(latest?.dilutedEPS, threeBack?.dilutedEPS),
    epsGrowthFy: growth(latest?.dilutedEPS, prior?.dilutedEPS),
  };
}
