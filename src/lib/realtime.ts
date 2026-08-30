/**
 * Real-time content sync helper for cross-tab, in-memory, and database-level updates.
 */

import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type RealtimeUpdateType = "products" | "blogs" | "reviews" | "orders";

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

  // 1. BroadcastChannel listener
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

  // 2. Custom Event listener
  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent)?.detail;
    if (detail?.type) {
      onUpdate(detail.type);
    }
  };

  // 3. LocalStorage event listener
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key?.startsWith("flavour_sync_")) {
      const type = e.key.replace("flavour_sync_", "") as RealtimeUpdateType;
      onUpdate(type);
    }
  };

  window.addEventListener("flavour:content_updated", handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  // 4. Supabase Postgres Realtime Subscription for database changes across devices
  let supabaseSubscription: any = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabaseSubscription = supabase
          .channel("flavour_db_realtime_" + Math.random().toString(36).substring(2, 9))
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "orders" },
            () => {
              onUpdate("orders");
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "products" },
            () => {
              onUpdate("products");
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "reviews" },
            () => {
              onUpdate("reviews");
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "blogs" },
            () => {
              onUpdate("blogs");
            }
          )
          .subscribe();
      }
    } catch (err) {
      console.warn("Supabase Realtime subscription error:", err);
    }
  }

  return () => {
    if (channel) channel.close();
    window.removeEventListener("flavour:content_updated", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    if (supabaseSubscription && isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          supabase.removeChannel(supabaseSubscription);
        }
      } catch (_) {}
    }
  };
}
