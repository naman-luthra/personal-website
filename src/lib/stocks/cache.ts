/**
 * Tiny in-memory TTL cache with in-flight de-duplication.
 * Lives on globalThis so it survives Next dev-mode hot reloads. It does not
 * survive a server restart or a serverless cold start - fine for a personal tool.
 */
interface Entry<T> {
  value: T;
  expiresAt: number;
}

interface Store {
  entries: Map<string, Entry<unknown>>;
  inflight: Map<string, Promise<unknown>>;
}

const g = globalThis as unknown as { __stockCache?: Store };
const store: Store = g.__stockCache ?? (g.__stockCache = { entries: new Map(), inflight: new Map() });

export function cacheGet<T>(key: string): T | undefined {
  const e = store.entries.get(key);
  if (!e) return undefined;
  if (e.expiresAt < Date.now()) {
    store.entries.delete(key);
    return undefined;
  }
  return e.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number) {
  store.entries.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Return the cached value, or compute it once even if called concurrently. */
export async function cached<T>(key: string, ttlMs: number, compute: () => Promise<T>): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return hit;
  const pending = store.inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;
  const p = compute()
    .then((v) => {
      cacheSet(key, v, ttlMs);
      return v;
    })
    .finally(() => store.inflight.delete(key));
  store.inflight.set(key, p);
  return p;
}

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
