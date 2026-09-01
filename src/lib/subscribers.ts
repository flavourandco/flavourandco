import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Subscriber } from "@/lib/types";

// In-memory cache / fallback for resilience if Supabase is temporarily unreachable
const memorySubscribers: Subscriber[] = [];

export async function getAllSubscribersServer(): Promise<Subscriber[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          email: item.email,
          discountCode: item.discount_code || "PIECLUB10",
          discountUsed: Boolean(item.discount_used),
          firstOrderId: item.first_order_id || null,
          source: item.source || "offer_modal",
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || item.created_at,
        }));
      }
    }
  }

  return memorySubscribers;
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) return null;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          discountCode: data.discount_code || "PIECLUB10",
          discountUsed: Boolean(data.discount_used),
          firstOrderId: data.first_order_id || null,
          source: data.source || "offer_modal",
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || data.created_at,
        };
      }
    }
  }

  const found = memorySubscribers.find((s) => s.email.toLowerCase() === cleanEmail);
  return found || null;
}

export async function addSubscriberServer(
  email: string,
  source = "offer_modal",
  discountCode = "PIECLUB10"
): Promise<{ success: boolean; subscriber?: Subscriber; isExisting?: boolean; error?: string }> {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // Check if existing
  const existing = await getSubscriberByEmail(cleanEmail);
  if (existing) {
    return {
      success: true,
      subscriber: existing,
      isExisting: true,
    };
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const payload = {
        email: cleanEmail,
        discount_code: discountCode,
        discount_used: false,
        source: source,
      };

      const { data, error } = await supabase
        .from("subscribers")
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        const newSub: Subscriber = {
          id: data.id,
          email: data.email,
          discountCode: data.discount_code || discountCode,
          discountUsed: Boolean(data.discount_used),
          firstOrderId: data.first_order_id || null,
          source: data.source || source,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || data.created_at,
        };
        return { success: true, subscriber: newSub, isExisting: false };
      }

      if (error) {
        console.warn("Supabase subscriber insert warning:", error.message);
      }
    }
  }

  // Fallback in-memory
  const mockSub: Subscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    discountCode,
    discountUsed: false,
    firstOrderId: null,
    source,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memorySubscribers.unshift(mockSub);
  return { success: true, subscriber: mockSub, isExisting: false };
}

export async function deleteSubscriberServer(id: string): Promise<boolean> {
  if (!id) return false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from("subscribers").delete().eq("id", id);
      if (!error) return true;
    }
  }

  const idx = memorySubscribers.findIndex((s) => s.id === id);
  if (idx !== -1) {
    memorySubscribers.splice(idx, 1);
    return true;
  }
  return false;
}

export async function markSubscriberDiscountUsed(
  email: string,
  orderNumber: string
): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) return false;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase
        .from("subscribers")
        .update({
          discount_used: true,
          first_order_id: orderNumber,
          updated_at: new Date().toISOString(),
        })
        .ilike("email", cleanEmail);

      if (!error) return true;
      console.warn("Failed to mark subscriber discount in Supabase:", error.message);
    }
  }

  const sub = memorySubscribers.find((s) => s.email.toLowerCase() === cleanEmail);
  if (sub) {
    sub.discountUsed = true;
    sub.firstOrderId = orderNumber;
    sub.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

/**
 * Checks if a customer email is eligible for the 10% first-order discount.
 * 1. Must be subscribed in `subscribers`.
 * 2. `discount_used` must be FALSE.
 * 3. Must have ZERO prior paid/completed orders in `orders` table.
 */
export async function checkFirstOrderDiscountEligibility(
  email: string,
  code = "PIECLUB10"
): Promise<{
  eligible: boolean;
  discountPercent: number;
  discountCode: string;
  reason?: string;
}> {
  const cleanEmail = email.toLowerCase().trim();
  const normalizedCode = code.toUpperCase().trim();

  if (!cleanEmail || !cleanEmail.includes("@")) {
    return {
      eligible: false,
      discountPercent: 0,
      discountCode: normalizedCode,
      reason: "Please enter a valid email address.",
    };
  }

  if (normalizedCode !== "PIECLUB10") {
    return {
      eligible: false,
      discountPercent: 0,
      discountCode: normalizedCode,
      reason: "Coupon not applicable",
    };
  }

  const subscriber = await getSubscriberByEmail(cleanEmail);

  if (!subscriber) {
    return {
      eligible: false,
      discountPercent: 0,
      discountCode: normalizedCode,
      reason: "Coupon not applicable",
    };
  }

  if (subscriber.discountUsed) {
    return {
      eligible: false,
      discountPercent: 0,
      discountCode: normalizedCode,
      reason: "Coupon not applicable",
    };
  }

  // Check if there are any completed/paid prior orders under this email in the database
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data: pastOrders } = await supabase
        .from("orders")
        .select("id, order_number, payment_status, status")
        .ilike("customer_email", cleanEmail)
        .in("payment_status", ["paid", "completed"]);

      if (pastOrders && pastOrders.length > 0) {
        // Automatically sync subscriber status so future checks are quick
        await markSubscriberDiscountUsed(cleanEmail, pastOrders[0].order_number);
        return {
          eligible: false,
          discountPercent: 0,
          discountCode: normalizedCode,
          reason: "Coupon not applicable",
        };
      }
    }
  }

  return {
    eligible: true,
    discountPercent: 10,
    discountCode: "PIECLUB10",
    reason: "Applied",
  };
}
