/** A company in the screening universe (static list, see content/stocks/universe.json). */
export interface UniverseEntry {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
}

/** Growth metrics derived from the income-statement time series. All values are fractions (0.12 = 12%). */
export interface GrowthMetrics {
  /** Compound annual growth of revenue over the last 3 fiscal years. */
  revenueCagr3y?: number;
  /** Revenue growth, latest fiscal year vs the one before. */
  revenueGrowthFy?: number;
  /** Mean of the last 4 quarters' year-over-year revenue growth. */
  revenueAvgQuarterlyYoy?: number;
  /** Latest reported quarter revenue vs the same quarter a year earlier. */
  revenueLatestQuarterYoy?: number;
  netIncomeCagr3y?: number;
  netIncomeGrowthFy?: number;
  netIncomeAvgQuarterlyYoy?: number;
  epsCagr3y?: number;
  epsGrowthFy?: number;
}

export type GrowthMetricKey = keyof GrowthMetrics;

/** One row of an income statement for a period. */
export interface IncomePeriod {
  /** Period end date, ISO yyyy-mm-dd. */
  date: string;
  totalRevenue?: number;
  netIncome?: number;
  dilutedEPS?: number;
  operatingIncome?: number;
}

/** Ratios and profile data that need the (slower) per-symbol quoteSummary call. */
export interface Fundamentals {
  priceToSales?: number;
  forwardPE?: number;
  pegRatio?: number;
  priceToBook?: number;
  evToEbitda?: number;
  profitMargin?: number;
  operatingMargin?: number;
  /** Yahoo's own latest-quarter YoY numbers. */
  yahooRevenueGrowth?: number;
  yahooEarningsGrowth?: number;
  totalRevenueTtm?: number;
  freeCashflow?: number;
  dividendYield?: number;
  nextEarningsDate?: string;
  website?: string;
  summary?: string;
  employees?: number;
  /** Sector/industry as Yahoo reports them (may differ from GICS in the universe file). */
  industry?: string;
  sector?: string;
  growth: GrowthMetrics;
  annual: IncomePeriod[];
  quarterly: IncomePeriod[];
  /** Set when enrichment failed; the row is still usable for P/E screening. */
  error?: string;
  fetchedAt: number;
}

/** What the screener table shows. Quote fields are always present; `fundamentals` arrives as enrichment completes. */
export interface ScreenerRow extends UniverseEntry {
  price?: number;
  currency?: string;
  marketCap?: number;
  trailingPE?: number;
  forwardPE?: number;
  epsTtm?: number;
  fiftyTwoWeekChange?: number;
  analystRating?: string;
  fundamentals?: Fundamentals;
}

export type SortKey = "pe" | "ps" | "forwardPE" | "marketCap" | "growth";

export interface ScreenParams {
  minMarketCap: number;
  sortBy: SortKey;
  growthMetric: GrowthMetricKey;
  /** Fraction, e.g. 0.1 for 10%. */
  minGrowth?: number;
  maxPE?: number;
  maxPS?: number;
  sector?: string;
  limit: number;
}

export interface ScreenResponse {
  rows: ScreenerRow[];
  /** How many universe symbols have fundamentals loaded so far. */
  enriched: number;
  total: number;
  /** Count of rows that matched the quote-level filters but are still waiting on fundamentals. */
  pendingMatches: number;
  quotesUpdatedAt: number | null;
  error?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: string;
  thumbnail?: string;
  /** Why this article may matter to growth/revenue/profit, e.g. ["earnings", "guidance"]. */
  tags: string[];
}

export interface SignificantDevelopment {
  date: string;
  headline: string;
}

export interface CompetitorRow {
  symbol: string;
  name: string;
  marketCap?: number;
  trailingPE?: number;
  forwardPE?: number;
  priceToSales?: number;
  pegRatio?: number;
  profitMargin?: number;
  revenueGrowth?: number;
  /** "yahoo" = Yahoo's similar-stocks list, "industry" = same GICS industry fallback. */
  source: "yahoo" | "industry";
}

export interface CompanyDetail {
  row: ScreenerRow;
  news: NewsItem[];
  developments: SignificantDevelopment[];
  competitors: CompetitorRow[];
  fetchedAt: number;
}
