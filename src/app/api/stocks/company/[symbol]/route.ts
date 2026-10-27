import { NextRequest, NextResponse } from "next/server";
import { getCompanyDetail } from "@/lib/stocks/company";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  if (!/^[A-Z0-9.-]{1,10}$/.test(symbol)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }
  try {
    const detail = await getCompanyDetail(symbol);
    if (!detail) return NextResponse.json({ error: `No data for ${symbol}` }, { status: 404 });
    return NextResponse.json(detail);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message ?? "Unknown error" }, { status: 502 });
  }
}
