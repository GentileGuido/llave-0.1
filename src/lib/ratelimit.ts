const buckets = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 10_000; // 10s
const LIMIT = 50;

export function checkRate(key: string) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.ts > WINDOW_MS) {
    buckets.set(key, { count: 1, ts: now });
    return true;
  }
  if (b.count >= LIMIT) return false;
  b.count++;
  return true;
}
