/**
 * Reusable LocalStorage helper with TTL (Time To Live) support.
 */

export function setWithTTL(key: string, ttlMs: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    key,
    JSON.stringify({
      expiry: Date.now() + ttlMs,
    })
  );
}

export function hasExpired(key: string): boolean {
  if (typeof window === "undefined") return true;
  const item = localStorage.getItem(key);

  if (!item) return true;

  try {
    const { expiry } = JSON.parse(item);

    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return true;
    }

    return false;
  } catch (e) {
    // In case of invalid JSON, consider it expired (or never set) and clean up
    localStorage.removeItem(key);
    return true;
  }
}
