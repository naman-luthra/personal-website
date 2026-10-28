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

## Stock value screener (`public/stock-tracker.html`)

A self-contained, backend-free dashboard: open the file directly in a browser (or visit `/stock-tracker.html` on the site). It screens the S&P 500 (or any ticker list you paste) by P/E, P/S or PEG with minimum-market-cap, sector and multi-year growth filters, and each company page shows ratios, SEC-reported annual/quarterly results, tagged news and the top 5 competitors with their ratios.

- Data comes from [Finnhub](https://finnhub.io) (free API key, called straight from the browser). The key and all fetched data stay in your browser's `localStorage`; metrics are cached for 24 hours.
- The free tier allows 60 requests/minute, so the first full S&P 500 load takes about 9 minutes; the table fills in as rows arrive and you can stop/resume at any time.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
