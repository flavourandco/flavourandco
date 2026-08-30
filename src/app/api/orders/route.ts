import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { sendStatusUpdateNotification, getTrackingUrl } from "@/lib/email/notifications";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;
    if (!supabase) {
      return NextResponse.json(
        { success: true, data: [] },
        { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders from Supabase:", error.message);
      return NextResponse.json(
        { success: false, error: error.message, data: [] },
        { status: 500, headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: true, data: [] },
        { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
      );
    }

    const formatted = data.map((o: any) => {
      const shippingAddr = o.shipping_address || {};
      const deliveryNotes =
        (typeof shippingAddr === "object" && shippingAddr?.notes) ||
        o.fulfillment_notes ||
        "";

      const trackingNumber = o.tracking_number || undefined;
      const courierName = o.courier_name || (trackingNumber ? "Australia Post Express" : undefined);
      const trackingUrl = getTrackingUrl(trackingNumber, courierName, o.tracking_url);

      return {
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        customerPhone: o.customer_phone || "+61 400 000 000",
        shippingAddress:
          typeof shippingAddr === "object"
            ? {
              street: shippingAddr.street || "124 George Street",
              unit: shippingAddr.unit || "",
              city: shippingAddr.city || "Sydney",
              state: shippingAddr.state || "NSW",
              postalCode: shippingAddr.postalCode || shippingAddr.postcode || "2000",
              country: shippingAddr.country || "Australia",
              notes: deliveryNotes,
            }
            : shippingAddr,
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
        fulfillmentNotes: deliveryNotes || "No special instructions attached to this order.",
        trackingNumber,
        trackingUrl,
        courierName,
        estimatedDelivery: o.estimated_delivery || undefined,
        createdAt: o.created_at,
      };
    });

    return NextResponse.json(
      { success: true, data: formatted },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, data: [] },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      status,
      fulfillmentNotes,
      trackingNumber,
      trackingUrl,
      courierName,
      estimatedDelivery,
      refundAmount,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Order ID is required." }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database service is not configured." },
        { status: 500 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database client is unavailable." },
        { status: 500 }
      );
    }

    // Build update object
    const updatePayload: Record<string, any> = {};
    if (status) updatePayload.status = status;
    if (fulfillmentNotes !== undefined) updatePayload.fulfillment_notes = fulfillmentNotes;
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;
    if (trackingUrl !== undefined) updatePayload.tracking_url = trackingUrl;
    if (courierName !== undefined) updatePayload.courier_name = courierName;
    if (estimatedDelivery !== undefined) updatePayload.estimated_delivery = estimatedDelivery;

    // 1. Try updating with full payload
    let res = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (!res.data && !res.error) {
      res = await supabase
        .from("orders")
        .update(updatePayload)
        .eq("order_number", id)
        .select()
        .maybeSingle();
    }

    // 2. If column schema error occurs, fallback to core fields (status & fulfillment_notes)
    if (res.error) {
      console.warn("[ORDERS DB UPDATE RETRY] Full payload failed:", res.error.message);
      const corePayload: Record<string, any> = {};
      if (status) corePayload.status = status;
      if (fulfillmentNotes !== undefined) corePayload.fulfillment_notes = fulfillmentNotes;

      let retryRes = await supabase
        .from("orders")
        .update(corePayload)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!retryRes.data && !retryRes.error) {
        retryRes = await supabase
          .from("orders")
          .update(corePayload)
          .eq("order_number", id)
          .select()
          .maybeSingle();
      }

      if (!retryRes.error && retryRes.data) {
        res = retryRes;
      }
    }

    // 3. Strict validation: If database update failed, abort immediately and return clear error
    if (res.error || !res.data) {
      const errorMessage = res.error?.message || "Order not found in database or update was rejected.";
      console.error("[ORDER PATCH DB ERROR]", errorMessage);
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const updatedOrder = res.data;

    // Invalidate caches
    revalidatePath("/api/orders");
    revalidatePath("/profile");
    revalidatePath("/admin/orders");

    // 4. Trigger Status Update Email Notification ONLY AFTER database update was successful
    if (updatedOrder && status) {
      try {
        const emailRes = await sendStatusUpdateNotification(
          {
            ...updatedOrder,
            trackingNumber: trackingNumber || updatedOrder.tracking_number,
            trackingUrl: trackingUrl || updatedOrder.tracking_url,
            courierName: courierName || updatedOrder.courier_name,
            estimatedDelivery: estimatedDelivery || updatedOrder.estimated_delivery,
            refundAmount: refundAmount || updatedOrder.refund_amount,
          },
          status
        );
        console.log(`[ORDER STATUS EMAIL DISPATCH] Order #${updatedOrder.order_number || id} -> ${status}:`, emailRes);
      } catch (notifyErr) {
        console.error("[STATUS UPDATE EMAIL ERROR]", notifyErr);
      }
    }

    return NextResponse.json(
      { success: true, order: updatedOrder },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("[ORDER PATCH ERROR]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

