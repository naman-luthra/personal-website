This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Stock value screener (`/stocks`)

A screener over the S&P 500 (`src/content/stocks/universe.json`) that ranks companies by P/E or P/S and filters by market cap, sector and multi-year growth. Each company page shows ratio cards, annual/quarterly income statements, tagged news, Yahoo's "significant developments" and the top 5 competitors with their ratios.

- Data comes from Yahoo Finance via [`yahoo-finance2`](https://github.com/gadicc/yahoo-finance2) — no API key needed.
- Quotes for the whole universe load in ~5 batch calls; per-company fundamentals (P/S, growth history) are fetched in the background, largest companies first, and cached in memory for 12 hours. The table fills in as they arrive.
- Because the cache is in-process, the screener suits `npm run dev` / `npm start` on a long-running server. On serverless hosts (Vercel) each cold start begins again and functions may time out before the universe is enriched.
- To change the universe, edit `universe.json` (fields: `symbol`, `name`, `sector`, `industry`). Dotted tickers use `-` (e.g. `BRK-B`), as Yahoo expects.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
