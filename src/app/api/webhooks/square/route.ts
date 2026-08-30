import { NextResponse } from "next/server";
import { verifySquareWebhookSignature } from "@/lib/square";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { sendOrderConfirmationNotifications } from "@/lib/email/notifications";
import { getAppBaseUrl } from "@/lib/email/resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature");
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL || `${getAppBaseUrl()}/api/webhooks/square`;

    // 1. Webhook Signature Verification
    if (signatureKey && signature) {
      const isValid = verifySquareWebhookSignature({
        signatureHeader: signature,
        signatureKey,
        notificationUrl,
        rawBody,
      });
      if (!isValid) {
        console.error("Square Webhook signature verification failed.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.warn("Square Webhook signature key not configured. Processing without verification.");
    }

    const event = JSON.parse(rawBody);
    console.log(`[SQUARE WEBHOOK] Received event: ${event.type} (${event.event_id})`);

    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;

    // 2. Handle Payment Updated Event
    if (event.type === "payment.updated" || event.type === "payment.created") {
      const payment = event.data?.object?.payment;
      if (!payment) {
        return NextResponse.json({ success: true, message: "No payment object found." });
      }

      const paymentId = payment.id;
      const orderId = payment.order_id;
      const status = payment.status; // e.g., 'COMPLETED', 'APPROVED', 'FAILED'
      const note = payment.note || "";
      const receiptUrl = payment.receipt_url;

      console.log(`[SQUARE WEBHOOK] Payment ${paymentId} status: ${status}, Order ID: ${orderId}`);

      if (status === "COMPLETED" && supabase) {
        // Find existing order in Supabase
        let { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("square_payment_id", paymentId)
          .maybeSingle();

        if (!order && orderId) {
          const { data: ordByOrderId } = await supabase
            .from("orders")
            .select("*")
            .eq("square_transaction_id", orderId)
            .maybeSingle();
          if (ordByOrderId) order = ordByOrderId;
        }

        // Try extracting custom order number from note (e.g., "Order: ORD-1234")
        if (!order && note) {
          const match = note.match(/ORD-[A-Z0-9]+/i);
          if (match) {
            const { data: ordByNumber } = await supabase
              .from("orders")
              .select("*")
              .eq("order_number", match[0])
              .maybeSingle();
            if (ordByNumber) order = ordByNumber;
          }
        }

        if (order) {
          // Update order payment status to paid
          const { error: updateErr } = await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              square_receipt_url: receiptUrl || order.square_receipt_url,
              status: order.status === "pending" ? "processing" : order.status,
            })
            .eq("id", order.id);

          if (updateErr) {
            console.error("Error updating order payment status in Supabase:", updateErr.message);
          } else {
            console.log(`[SQUARE WEBHOOK] Order #${order.order_number} marked as PAID.`);
            // Trigger confirmation emails
            await sendOrderConfirmationNotifications(order).catch((e) =>
              console.error("Webhook email notification error:", e)
            );
          }
        } else {
          console.warn(`[SQUARE WEBHOOK] No matching local order found for payment ${paymentId}`);
        }
      }
    }

    // 3. Handle Refund Updated Event
    if (event.type === "refund.updated" || event.type === "refund.created") {
      const refund = event.data?.object?.refund;
      if (refund && refund.status === "COMPLETED" && supabase) {
        const paymentId = refund.payment_id;
        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("square_payment_id", paymentId)
          .maybeSingle();

        if (order) {
          await supabase
            .from("orders")
            .update({
              payment_status: "refunded",
              status: "refunded",
            })
            .eq("id", order.id);
          console.log(`[SQUARE WEBHOOK] Order #${order.order_number} marked as REFUNDED.`);
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    console.error("[SQUARE WEBHOOK ERROR]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
