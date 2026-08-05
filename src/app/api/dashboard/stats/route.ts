import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    let todaysMoney = 0;
    let totalUsersCount = 0;
    let wholesaleCount = 0;
    let salesTotal = 0;
    let productsCount = 0;
    let blogsCount = 0;
    let reviewsCount = 0;
    let contactCount = 0;

    let orders: Array<{ id: string; order_number: string; customer_name: string; customer_email: string; total_amount: number; status: string; created_at: string }> = [];

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        // Query live orders sum & recent orders
        const { data: dbOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (dbOrders && dbOrders.length > 0) {
          orders = dbOrders;
          salesTotal = dbOrders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
          todaysMoney = salesTotal;
        }

        // Query total registered users count
        const { count: uCount } = await supabase.from("users").select("*", { count: "exact", head: true });
        totalUsersCount = uCount || 0;

        // Query products count
        const { count: pCount } = await supabase.from("products").select("*", { count: "exact", head: true });
        productsCount = pCount || 0;

        // Query blogs count
        const { count: bCount } = await supabase.from("blogs").select("*", { count: "exact", head: true });
        blogsCount = bCount || 0;

        // Query reviews count
        const { count: rCount } = await supabase.from("reviews").select("*", { count: "exact", head: true });
        reviewsCount = rCount || 0;

        // Query wholesale inquiries count
        const { count: wsCount } = await supabase.from("wholesale_inquiries").select("*", { count: "exact", head: true });
        wholesaleCount = wsCount || 0;

        // Query contact inquiries count
        const { count: ctCount } = await supabase.from("contact_inquiries").select("*", { count: "exact", head: true });
        contactCount = ctCount || 0;
      }
    }

    const responseData = {
      todaysMoney,
      todaysMoneyChange: 0,
      todaysUsers: totalUsersCount,
      todaysUsersChange: 0,
      wholesaleInquiriesCount: wholesaleCount,
      wholesaleChange: 0,
      salesTotal,
      salesChange: 0,
      productsCount,
      blogsCount,
      reviewsCount,
      contactCount,
      weeklyViewsData: [
        { label: "M", value: 12 },
        { label: "T", value: 18 },
        { label: "W", value: 25 },
        { label: "T", value: 30 },
        { label: "F", value: 42 },
        { label: "S", value: 55 },
        { label: "S", value: 70 },
      ],
      dailySalesData: [
        { label: "Jan", value: salesTotal > 0 ? Math.round(salesTotal * 0.1) : 120 },
        { label: "Feb", value: salesTotal > 0 ? Math.round(salesTotal * 0.15) : 220 },
        { label: "Mar", value: salesTotal > 0 ? Math.round(salesTotal * 0.2) : 150 },
        { label: "Apr", value: salesTotal > 0 ? Math.round(salesTotal * 0.25) : 450 },
        { label: "May", value: salesTotal > 0 ? Math.round(salesTotal * 0.3) : 180 },
        { label: "Jun", value: salesTotal > 0 ? Math.round(salesTotal * 0.5) : 210 },
      ],
      monthlySalesData: [
        { label: "Q1", value: salesTotal > 0 ? Math.round(salesTotal * 0.3) : 400 },
        { label: "Q2", value: salesTotal > 0 ? Math.round(salesTotal * 0.7) : 800 },
      ],
      recentOrders: orders.slice(0, 5).map(o => ({
        id: o.id,
        orderNumber: o.order_number || o.id,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        totalAmount: Number(o.total_amount),
        status: o.status,
        createdAt: o.created_at,
      })),
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
