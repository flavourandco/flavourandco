import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;
    if (!supabase) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders from Supabase:", error.message);
      return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const formatted = data.map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      customerPhone: o.customer_phone || "+61 400 000 000",
      shippingAddress: o.shipping_address || {
        street: "124 George Street",
        city: "Sydney",
        state: "NSW",
        postalCode: "2000",
        country: "Australia",
      },
      shippingMethod: o.shipping_method || "Standard Express Delivery",
      paymentMethod: o.payment_method || "Square Credit Card",
      paymentStatus: o.payment_status || "paid",
      squarePaymentId: o.square_payment_id || `sq_pay_${o.order_number?.toLowerCase() || "ord"}`,
      squareTransactionId: o.square_transaction_id || `sq_tx_${o.order_number?.toLowerCase() || "ord"}`,
      squareReceiptUrl: o.square_receipt_url || `https://squareupsandbox.com/receipt/preview/${o.order_number || "ord"}`,
      items: o.items || [],
      subtotal: Number(o.subtotal || o.total_amount || 0),
      shippingFee: Number(o.shipping_fee || 0),
      taxAmount: Number(o.tax_amount || 0),
      totalAmount: Number(o.total_amount || 0),
      status: o.status || "completed",
      itemsCount: o.items_count || (Array.isArray(o.items) ? o.items.length : 1),
      fulfillmentNotes: o.fulfillment_notes || "Order fulfilled successfully.",
      createdAt: o.created_at,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, fulfillmentNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Order ID is required." }, { status: 400 });
    }

    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;
    if (supabase) {
      const updatePayload: any = {};
      if (status) updatePayload.status = status;
      if (fulfillmentNotes !== undefined) updatePayload.fulfillment_notes = fulfillmentNotes;

      await supabase.from("orders").update(updatePayload).eq("id", id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
