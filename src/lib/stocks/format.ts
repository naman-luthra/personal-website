/** Client-safe number formatters for the stock pages. */

export function fmtMoney(n?: number, currency = "USD"): string {
  if (n === undefined || n === null || !Number.isFinite(n)) return "–";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const unit = abs >= 1e12 ? [1e12, "T"] : abs >= 1e9 ? [1e9, "B"] : abs >= 1e6 ? [1e6, "M"] : abs >= 1e3 ? [1e3, "K"] : [1, ""];
  const symbol = currency === "USD" ? "$" : currency + " ";
  return `${sign}${symbol}${(abs / (unit[0] as number)).toFixed(abs / (unit[0] as number) >= 100 ? 0 : 1)}${unit[1]}`;
}

export function fmtRatio(n?: number, digits = 1): string {
  if (n === undefined || n === null || !Number.isFinite(n)) return "–";
  return n.toFixed(digits);
}

export function fmtPct(n?: number, digits = 1): string {
  if (n === undefined || n === null || !Number.isFinite(n)) return "–";
  const v = n * 100;
  return `${v > 0 ? "+" : ""}${v.toFixed(digits)}%`;
}

export function fmtPrice(n?: number, currency = "USD"): string {
  if (n === undefined || n === null || !Number.isFinite(n)) return "–";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
}

export function fmtDate(iso?: string): string {
  if (!iso) return "–";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "–";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function timeAgo(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff)) return "";
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : fmtDate(iso);
}

/** Tailwind text colour for a growth/percentage value. */
export function pctClass(n?: number): string {
  if (n === undefined || !Number.isFinite(n)) return "text-zinc-500";
  return n >= 0 ? "text-emerald-400" : "text-rose-400";
}

export const MARKET_CAP_OPTIONS: { label: string; value: number }[] = [
  { label: "Any", value: 0 },
  { label: "$2B+ (mid cap)", value: 2e9 },
  { label: "$10B+ (large cap)", value: 10e9 },
  { label: "$50B+", value: 50e9 },
  { label: "$200B+ (mega cap)", value: 200e9 },
];
