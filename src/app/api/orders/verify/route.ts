import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId parameter." }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database client unavailable." }, { status: 500 });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Security Ownership Check (If order is tied to a user, ensure authorized caller or guest)
    if (order.user_id && userId && order.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden access to order." }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        paymentStatus: order.payment_status, // 'paid', 'pending', 'failed', 'canceled'
        status: order.status, // 'completed', 'pending', 'processing'
        totalAmount: Number(order.total_amount),
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shipping_fee),
        squarePaymentId: order.square_payment_id,
        squareReceiptUrl: order.square_receipt_url,
        createdAt: order.created_at,
        customer: {
          fullName: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          address: order.shipping_address?.street || "",
          city: order.shipping_address?.city || "",
          state: order.shipping_address?.state || "",
          postcode: order.shipping_address?.postalCode || "",
        },
        items: order.items || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to retrieve order status." },
      { status: 500 }
    );
  }
}
