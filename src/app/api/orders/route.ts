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

      const trackingNumber =
        o.tracking_number ||
        (typeof shippingAddr === "object" ? shippingAddr.tracking_number || shippingAddr.trackingNumber : undefined) ||
        undefined;

      const courierName =
        o.courier_name ||
        (typeof shippingAddr === "object" ? shippingAddr.courier_name || shippingAddr.courierName : undefined) ||
        (trackingNumber ? "Australia Post Express" : undefined);

      const trackingUrl =
        getTrackingUrl(
          trackingNumber,
          courierName,
          o.tracking_url || (typeof shippingAddr === "object" ? shippingAddr.tracking_url || shippingAddr.trackingUrl : undefined)
        );

      const estimatedDelivery =
        o.estimated_delivery ||
        (typeof shippingAddr === "object" ? shippingAddr.estimated_delivery || shippingAddr.estimatedDelivery : undefined) ||
        undefined;

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
        estimatedDelivery,
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

    // 1. Fetch existing order by UUID or order_number to ensure accurate targeting
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
    let targetOrder: any = null;

    if (isUuid) {
      const { data: byId } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      targetOrder = byId;
    }
    if (!targetOrder) {
      const { data: byOrderNum } = await supabase.from("orders").select("*").eq("order_number", id).maybeSingle();
      targetOrder = byOrderNum;
    }

    if (!targetOrder) {
      return NextResponse.json(
        { success: false, error: "Order record not found in database." },
        { status: 404 }
      );
    }

    // 2. Prepare safe JSONB shipping_address updates to ensure tracking data persists permanently
    const currentShippingAddr =
      typeof targetOrder.shipping_address === "object" && targetOrder.shipping_address
        ? { ...targetOrder.shipping_address }
        : {};

    if (trackingNumber !== undefined) currentShippingAddr.tracking_number = trackingNumber;
    if (courierName !== undefined) currentShippingAddr.courier_name = courierName;
    if (trackingUrl !== undefined) currentShippingAddr.tracking_url = trackingUrl;
    if (estimatedDelivery !== undefined) currentShippingAddr.estimated_delivery = estimatedDelivery;

    // 3. Build update payload targeting first-class database columns
    const updatePayload: Record<string, any> = {
      shipping_address: currentShippingAddr,
    };
    if (status) updatePayload.status = status;
    if (fulfillmentNotes !== undefined) updatePayload.fulfillment_notes = fulfillmentNotes;
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;
    if (courierName !== undefined) updatePayload.courier_name = courierName;
    if (trackingUrl !== undefined) updatePayload.tracking_url = trackingUrl;
    if (estimatedDelivery !== undefined) updatePayload.estimated_delivery = estimatedDelivery;
    if (refundAmount !== undefined) updatePayload.refund_amount = refundAmount;

    // 4. Update the order in database
    let updatedOrder: any = null;

    const { data: updatedData, error: updateErr } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", targetOrder.id)
      .select()
      .maybeSingle();

    if (updateErr) {
      console.error("[ORDER PATCH DB ERROR]", updateErr.message);
      return NextResponse.json(
        { success: false, error: updateErr.message },
        { status: 400 }
      );
    }

    updatedOrder = updatedData || { ...targetOrder, ...updatePayload };

    // Invalidate caches
    revalidatePath("/api/orders");
    revalidatePath("/profile");
    revalidatePath("/admin/orders");

    // 5. Trigger Status Update Email Notification ONLY AFTER database update was successful
    if (status) {
      try {
        const effectiveTrackingNumber = trackingNumber || updatedOrder.tracking_number || currentShippingAddr.tracking_number;
        const effectiveCourierName = courierName || updatedOrder.courier_name || currentShippingAddr.courier_name || (effectiveTrackingNumber ? "Australia Post Express" : undefined);
        const effectiveTrackingUrl = trackingUrl || updatedOrder.tracking_url || currentShippingAddr.tracking_url || getTrackingUrl(effectiveTrackingNumber, effectiveCourierName);
        const effectiveEstimatedDelivery = estimatedDelivery || updatedOrder.estimated_delivery || currentShippingAddr.estimated_delivery;

        const emailRes = await sendStatusUpdateNotification(
          {
            ...updatedOrder,
            trackingNumber: effectiveTrackingNumber,
            trackingUrl: effectiveTrackingUrl,
            courierName: effectiveCourierName,
            estimatedDelivery: effectiveEstimatedDelivery,
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

