export function setWithTTL(key: string, ttlMs: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        expiry: Date.now() + ttlMs,
      })
    );
  } catch {}
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
  } catch {
    localStorage.removeItem(key);
    return true;
  }
}
