import { HOUR, MINUTE, cached } from "./cache";
import { UNIVERSE, getFundamentals, getScreenerRow, industryPeers } from "./screener";
import type { CompanyDetail, CompetitorRow, NewsItem, SignificantDevelopment } from "./types";
import { getYahoo, lenient } from "./yahoo";

const NEWS_TTL = 30 * MINUTE;
const COMPETITORS_TTL = 12 * HOUR;

/**
 * Keyword tags that flag news likely to move revenue, growth or profit.
 * Order matters only for display; a headline can carry several tags.
 */
const NEWS_TAGS: { tag: string; pattern: RegExp }[] = [
  { tag: "earnings", pattern: /\b(earnings|eps|quarter(ly)? results|q[1-4]\b|beats?|misses?|reported)/i },
  { tag: "revenue", pattern: /\b(revenue|sales|bookings|top[- ]line)\b/i },
  { tag: "guidance", pattern: /\b(guidance|outlook|forecast|raises?|lowers?|cuts? (its )?(outlook|forecast))\b/i },
  { tag: "profit", pattern: /\b(profit|margin|net income|bottom[- ]line|loss(es)?)\b/i },
  { tag: "growth", pattern: /\b(growth|expan(d|sion)|demand|ramp)\b/i },
  { tag: "M&A", pattern: /\b(acqui(re|sition)|merger|buyout|takeover|deal|divest)/i },
  { tag: "analyst", pattern: /\b(upgrade|downgrade|price target|rating|analyst|overweight|underweight)\b/i },
  { tag: "costs", pattern: /\b(layoffs?|job cuts|restructur|cost[- ]cut|tariff|inflation|supply chain)\b/i },
  { tag: "legal/regulatory", pattern: /\b(lawsuit|antitrust|regulator|fda|probe|investigation|fine|settlement|recall)\b/i },
  { tag: "product", pattern: /\b(launch(es)?|unveils?|new product|contract|partnership|wins?)\b/i },
  { tag: "capital", pattern: /\b(dividend|buyback|repurchase|debt|offering|split)\b/i },
];

function tagHeadline(title: string): string[] {
  return NEWS_TAGS.filter((t) => t.pattern.test(title)).map((t) => t.tag);
}

async function getNews(symbol: string, name: string): Promise<{ news: NewsItem[]; developments: SignificantDevelopment[] }> {
  return cached(`news:${symbol}`, NEWS_TTL, async () => {
    const yf = getYahoo();
    const [search, insights] = await Promise.all([
      yf.search(symbol, { newsCount: 20, quotesCount: 0 }, lenient).catch((e: Error) => {
        console.error(`[stocks] news for ${symbol} failed: ${e.message}`);
        return null;
      }) as Promise<any>,
      yf.insights(symbol, {}, lenient).catch(() => null) as Promise<any>,
    ]);

    const items: NewsItem[] = ((search?.news ?? []) as any[])
      .filter((n) => n?.title && n?.link)
      .map((n) => {
        const thumbs = n.thumbnail?.resolutions as { url: string; width: number }[] | undefined;
        const published = n.providerPublishTime instanceof Date ? n.providerPublishTime : new Date(n.providerPublishTime);
        return {
          id: n.uuid ?? n.link,
          title: n.title,
          publisher: n.publisher ?? "",
          link: n.link,
          publishedAt: isNaN(published.getTime()) ? "" : published.toISOString(),
          thumbnail: thumbs?.slice().sort((a, b) => a.width - b.width)[0]?.url,
          tags: tagHeadline(n.title),
        };
      })
      // Articles that merely mention the ticker in a market round-up are less useful
      // than ones about the company: rank tagged articles first, then newest.
      .sort((a, b) => Number(b.tags.length > 0) - Number(a.tags.length > 0) || b.publishedAt.localeCompare(a.publishedAt));

    const developments: SignificantDevelopment[] = ((insights?.sigDevs ?? []) as any[])
      .filter((d) => d?.headline)
      .map((d) => ({
        headline: d.headline,
        date: (d.date instanceof Date ? d.date : new Date(d.date)).toISOString().slice(0, 10),
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);

    return { news: items, developments };
  });
}

async function competitorRow(symbol: string, source: CompetitorRow["source"]): Promise<CompetitorRow | null> {
  const yf = getYahoo();
  const known = UNIVERSE.find((u) => u.symbol === symbol);
  try {
    const [quote, f] = await Promise.all([yf.quote(symbol, undefined, lenient) as Promise<any>, getFundamentals(symbol)]);
    if (!quote) return null;
    return {
      symbol,
      name: known?.name ?? quote.longName ?? quote.shortName ?? symbol,
      marketCap: quote.marketCap,
      trailingPE: quote.trailingPE,
      forwardPE: quote.forwardPE ?? f.forwardPE,
      priceToSales: f.priceToSales,
      pegRatio: f.pegRatio,
      profitMargin: f.profitMargin,
      revenueGrowth: f.growth.revenueGrowthFy ?? f.yahooRevenueGrowth,
      source,
    };
  } catch (err) {
    console.error(`[stocks] competitor ${symbol} failed: ${(err as Error).message}`);
    return null;
  }
}

/**
 * Top 5 competitors: Yahoo's "similar stocks" list first (it reflects how the
 * market groups the company), topped up with same-industry names from the universe.
 */
async function getCompetitors(symbol: string, industry: string): Promise<CompetitorRow[]> {
  return cached(`competitors:${symbol}`, COMPETITORS_TTL, async () => {
    const yf = getYahoo();
    const picks: { symbol: string; source: CompetitorRow["source"] }[] = [];
    try {
      const rec = (await yf.recommendationsBySymbol(symbol, {}, lenient)) as any;
      for (const r of (rec?.recommendedSymbols ?? []) as { symbol: string; score: number }[]) {
        // Skip non-equity tickers (ETFs, indices) and duplicates.
        if (r.symbol && r.symbol !== symbol && !/[\^=.]/.test(r.symbol) && picks.length < 5) picks.push({ symbol: r.symbol, source: "yahoo" });
      }
    } catch (err) {
      console.error(`[stocks] recommendations for ${symbol} failed: ${(err as Error).message}`);
    }
    for (const peer of industryPeers(symbol, industry, 10)) {
      if (picks.length >= 5) break;
      if (!picks.some((p) => p.symbol === peer.symbol)) picks.push({ symbol: peer.symbol, source: "industry" });
    }
    const rows = await Promise.all(picks.map((p) => competitorRow(p.symbol, p.source)));
    return rows.filter((r): r is CompetitorRow => r !== null);
  });
}

export async function getCompanyDetail(symbol: string): Promise<CompanyDetail | null> {
  const row = await getScreenerRow(symbol);
  if (!row) return null;
  const [{ news, developments }, competitors] = await Promise.all([
    getNews(symbol, row.name),
    getCompetitors(symbol, row.industry),
  ]);
  return { row, news, developments, competitors, fetchedAt: Date.now() };
}
