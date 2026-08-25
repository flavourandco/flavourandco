import { getSupabaseServerClient, isSupabaseConfigured } from "./supabase/server";

const DEFAULT_FREE_DELIVERY_THRESHOLD = 200;

// In-memory fallback cache for server runtime
let memoryStore: Record<string, any> = {
  free_delivery_threshold: DEFAULT_FREE_DELIVERY_THRESHOLD,
};

export async function getFreeDeliveryThresholdServer(): Promise<number> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "free_delivery_threshold")
          .single();

        if (!error && data && data.value) {
          const val = Number(data.value);
          if (!isNaN(val) && val >= 0) {
            memoryStore.free_delivery_threshold = val;
            return val;
          }
        }
      }
    }
  } catch (err) {
    console.error("Error fetching site_settings from Supabase:", err);
  }

  return memoryStore.free_delivery_threshold ?? DEFAULT_FREE_DELIVERY_THRESHOLD;
}

export async function setFreeDeliveryThresholdServer(amount: number): Promise<boolean> {
  if (isNaN(amount) || amount < 0) return false;

  memoryStore.free_delivery_threshold = amount;

  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("site_settings").upsert(
          {
            key: "free_delivery_threshold",
            value: String(amount),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );

        if (error) {
          console.warn("Could not save to site_settings table (table may not exist yet), fallback memory used:", error.message);
        }
      }
    }
    return true;
  } catch (err) {
    console.error("Error setting free delivery threshold:", err);
    return true; // Fallback memory store succeeded
  }
}
