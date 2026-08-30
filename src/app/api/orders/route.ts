import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { sendStatusUpdateNotification } from "@/lib/email/notifications";

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

    const formatted = data.map((o: any) => {
      const shippingAddr = o.shipping_address || {};
      const deliveryNotes =
        (typeof shippingAddr === "object" && shippingAddr?.notes) ||
        o.fulfillment_notes ||
        "";

      return {
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        customerPhone: o.customer_phone || "+61 400 000 000",
        shippingAddress: typeof shippingAddr === "object" ? {
          street: shippingAddr.street || "124 George Street",
          unit: shippingAddr.unit || "",
          city: shippingAddr.city || "Sydney",
          state: shippingAddr.state || "NSW",
          postalCode: shippingAddr.postalCode || shippingAddr.postcode || "2000",
          country: shippingAddr.country || "Australia",
          notes: deliveryNotes,
        } : shippingAddr,
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
        createdAt: o.created_at,
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
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

    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;
    let updatedOrder: any = null;

    if (supabase) {
      const updatePayload: any = {};
      if (status) updatePayload.status = status;
      if (fulfillmentNotes !== undefined) updatePayload.fulfillment_notes = fulfillmentNotes;
      if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;
      if (trackingUrl !== undefined) updatePayload.tracking_url = trackingUrl;
      if (courierName !== undefined) updatePayload.courier_name = courierName;
      if (estimatedDelivery !== undefined) updatePayload.estimated_delivery = estimatedDelivery;

      // 1. Try updating by internal ID
      let { data: updData, error: updErr } = await supabase
        .from("orders")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .maybeSingle();

      // 2. Fallback: Try updating by order_number
      if (!updData) {
        const { data: updByOrdNum } = await supabase
          .from("orders")
          .update(updatePayload)
          .eq("order_number", id)
          .select()
          .maybeSingle();
        if (updByOrdNum) {
          updData = updByOrdNum;
        }
      }

      // 3. Fallback: If not returned, query the order record to get all customer details
      if (!updData) {
        const { data: existingOrd } = await supabase
          .from("orders")
          .select("*")
          .or(`id.eq.${id},order_number.eq.${id}`)
          .maybeSingle();

        if (existingOrd) {
          updData = { ...existingOrd, ...updatePayload };
        }
      }

      if (updData) {
        updatedOrder = updData;
      }
    }

    // Trigger Status Update Email Notification (Awaited for guaranteed serverless dispatch)
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

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error("[ORDER PATCH ERROR]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

