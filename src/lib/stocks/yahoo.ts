import YahooFinance from "yahoo-finance2";

/**
 * Single shared Yahoo Finance client. yahoo-finance2 keeps a cookie/crumb
 * session on the instance, so reusing one avoids re-authenticating per call.
 * Stored on globalThis so Next's dev-mode module reloads don't create duplicates.
 */
const g = globalThis as unknown as { __yahooFinance?: InstanceType<typeof YahooFinance> };

export function getYahoo() {
  if (!g.__yahooFinance) {
    g.__yahooFinance = new YahooFinance({
      suppressNotices: ["yahooSurvey", "ripHistorical"],
      // Yahoo occasionally returns fields that don't match the library's schema;
      // keep the data instead of throwing, but don't spam the console.
      validation: { logErrors: false, logOptionsErrors: false },
      queue: { concurrency: 4 },
    });
  }
  return g.__yahooFinance;
}

/** Shared module options: keep going on schema drift rather than failing a whole request. */
export const lenient = { validateResult: false as const };
