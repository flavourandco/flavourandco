/**
 * Real-time content sync helper for cross-tab and store updates.
 */

export type RealtimeUpdateType = "products" | "blogs" | "reviews";

const CHANNEL_NAME = "flavour_co_realtime";

export function notifyContentUpdated(type: RealtimeUpdateType) {
  if (typeof window === "undefined") return;

  const timestamp = Date.now();

  // 1. BroadcastChannel for cross-tab real-time sync
  if ("BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type, timestamp });
      channel.close();
    } catch (err) {
      console.warn("BroadcastChannel error:", err);
    }
  }

  // 2. Custom Window Event for current tab components
  window.dispatchEvent(
    new CustomEvent("flavour:content_updated", { detail: { type, timestamp } })
  );

  // 3. Fallback localStorage event for legacy tab sync
  try {
    localStorage.setItem(`flavour_sync_${type}`, String(timestamp));
  } catch (_) {}
}

export function subscribeToRealtimeUpdates(
  onUpdate: (type: RealtimeUpdateType) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  // BroadcastChannel listener
  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type) {
          onUpdate(event.data.type);
        }
      };
    } catch (_) {}
  }

  // Custom Event listener
  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent)?.detail;
    if (detail?.type) {
      onUpdate(detail.type);
    }
  };

  // LocalStorage event listener
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key?.startsWith("flavour_sync_")) {
      const type = e.key.replace("flavour_sync_", "") as RealtimeUpdateType;
      onUpdate(type);
    }
  };

  window.addEventListener("flavour:content_updated", handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    if (channel) channel.close();
    window.removeEventListener("flavour:content_updated", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
