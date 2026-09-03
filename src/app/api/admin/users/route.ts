import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Supabase not configured", users: [], count: 0 },
        { status: 500 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Failed to initialize Supabase client", users: [], count: 0 },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, clerk_user_id, email, name, role, image_url, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error.message);
      return NextResponse.json(
        { success: false, error: error.message, users: [], count: 0 },
        { status: 500 }
      );
    }

    // Fetch orders to calculate customer order history, spend, and phone
    let enrichedUsers = data || [];
    try {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("user_id, customer_email, customer_phone, total_amount, status, created_at");

      if (Array.isArray(ordersData) && ordersData.length > 0) {
        enrichedUsers = (data || []).map((u: any) => {
          const userEmail = (u.email || "").toLowerCase();
          const userClerkId = u.clerk_user_id || "";

          const matchedOrders = ordersData.filter((o: any) => {
            const ordEmail = (o.customer_email || "").toLowerCase();
            const ordUserId = o.user_id || "";
            return (userClerkId && ordUserId === userClerkId) || (userEmail && ordEmail === userEmail);
          });

          const validOrders = matchedOrders.filter((o: any) => o.status !== "cancelled");
          const totalSpent = validOrders.reduce((acc: number, curr: any) => acc + (Number(curr.total_amount) || 0), 0);
          
          // Sort by creation date descending to find latest phone & date
          const sortedOrders = [...matchedOrders].sort(
            (a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );

          const latestPhone = sortedOrders.find((o: any) => Boolean(o.customer_phone))?.customer_phone;
          const latestOrderDate = sortedOrders[0]?.created_at;

          return {
            ...u,
            orders_count: validOrders.length,
            total_spent: Math.round(totalSpent * 100) / 100,
            phone: latestPhone || undefined,
            last_order_date: latestOrderDate || undefined,
          };
        });
      }
    } catch (orderErr) {
      console.error("Non-critical error enriching users with order stats:", orderErr);
    }

    return NextResponse.json(
      {
        success: true,
        users: enrichedUsers,
        source: "database",
        count: enrichedUsers.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users", users: [], count: 0 },
      { status: 500 }
    );
  }
}
