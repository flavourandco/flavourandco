import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { verifySquareWebhookSignature } from "@/lib/square";
import { sendOrderConfirmationNotifications } from "@/lib/email/notifications";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Read Raw Body text for signature verification
    const rawBody = await req.text();
    const signatureHeader = req.headers.get("x-square-hmacsha256-signature");

    const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    const notificationUrl =
      process.env.SQUARE_WEBHOOK_NOTIFICATION_URL ||
      req.url ||
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/square`;

    // 2. Cryptographically Verify Signature if key is configured
    if (webhookSignatureKey && !webhookSignatureKey.includes("YOUR_WEBHOOK")) {
      const isValidSignature = verifySquareWebhookSignature({
        signatureHeader,
        signatureKey: webhookSignatureKey,
        notificationUrl,
        rawBody,
      });

      if (!isValidSignature) {
        console.warn("Square Webhook signature verification failed. Request rejected.");
        return NextResponse.json(
          { error: "Invalid webhook signature." },
          { status: 401 }
        );
      }
    } else {
      console.warn("Square Webhook signature key not configured. Signature verification skipped in development.");
    }

    // 3. Parse JSON Event Payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const eventId = payload.event_id || payload.id;
    const eventType = payload.type;

    if (!eventId || !eventType) {
      return NextResponse.json({ error: "Missing event metadata." }, { status: 400 });
    }

    // We focus on payment events
    if (eventType !== "payment.created" && eventType !== "payment.updated") {
      return NextResponse.json({ received: true, ignored: true, message: `Event '${eventType}' ignored.` });
    }

    if (!isSupabaseConfigured()) {
      console.error("Webhook processing failed: Supabase not configured.");
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database client unavailable." }, { status: 500 });
    }

    // 4. Webhook Event Deduplication Check (Idempotency)
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id, status")
      .eq("event_id", eventId)
      .single();

    if (existingEvent) {
      // Event already processed safely, return 200 immediately
      return NextResponse.json({
        received: true,
        duplicate: true,
        message: "Webhook event already processed.",
      });
    }

    // 5. Extract Payment Object
    const payment = payload?.data?.object?.payment;
    if (!payment) {
      return NextResponse.json({ error: "Missing payment object in event data." }, { status: 400 });
    }

    const squarePaymentId = payment.id;
    const referenceId = payment.reference_id; // Order Number or Order ID
    const paymentStatus = (payment.status || "").toUpperCase(); // e.g., 'COMPLETED', 'FAILED', 'CANCELED'
    const receiptUrl = payment.receipt_url;

    // 6. Locate Corresponding Order in Database
    let orderRecord = null;

    if (referenceId) {
      const { data: byOrderNumber } = await supabase
        .from("orders")
        .select("*")
        .or(`order_number.eq.${referenceId},id.eq.${referenceId}`)
        .single();
      orderRecord = byOrderNumber;
    }

    if (!orderRecord && squarePaymentId) {
      const { data: bySquareId } = await supabase
        .from("orders")
        .select("*")
        .eq("square_payment_id", squarePaymentId)
        .single();
      orderRecord = bySquareId;
    }

    // 7. Safe State Machine Transition & Database Updates
    if (orderRecord) {
      if (paymentStatus === "COMPLETED") {
        // Prevent stale webhooks from overwriting an already confirmed order needlessly
        if (orderRecord.payment_status !== "paid") {
          const currentNotes = orderRecord.fulfillment_notes || orderRecord.shipping_address?.notes || "";
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              status: "completed",
              square_payment_id: squarePaymentId,
              square_transaction_id: squarePaymentId,
              square_receipt_url: receiptUrl || orderRecord.square_receipt_url,
              fulfillment_notes: currentNotes || "Paid & Confirmed via Authoritative Square Webhook",
            })
            .eq("id", orderRecord.id);

          // Update corresponding Payment Attempt
          await supabase
            .from("payment_attempts")
            .update({
              status: "completed",
              square_payment_id: squarePaymentId,
              raw_response: payment,
              updated_at: new Date().toISOString(),
            })
            .eq("order_id", orderRecord.id);

          console.log(
            `[AUTHORITATIVE PAYMENT CONFIRMED] Order #${orderRecord.order_number} marked PAID via Webhook ${eventId}.`
          );

          // Trigger Post-Payment Notifications (Idempotent: deduplicated if checkout handler already sent)
          const updatedSnapshot = {
            ...orderRecord,
            payment_status: "paid",
            status: "completed",
            square_payment_id: squarePaymentId,
            square_receipt_url: receiptUrl || orderRecord.square_receipt_url,
          };

          sendOrderConfirmationNotifications(updatedSnapshot).catch((err) => {
            console.error("[WEBHOOK EMAIL DISPATCH ERROR]", err);
          });
        }
      } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELED") {
        if (orderRecord.payment_status !== "paid") {
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              status: "pending",
              fulfillment_notes: `Square Payment ${paymentStatus.toLowerCase()}`,
            })
            .eq("id", orderRecord.id);

          await supabase
            .from("payment_attempts")
            .update({
              status: paymentStatus.toLowerCase(),
              raw_response: payment,
              updated_at: new Date().toISOString(),
            })
            .eq("order_id", orderRecord.id);
        }
      }
    } else {
      console.warn(
        `Square Webhook received for payment ${squarePaymentId} / reference ${referenceId}, but no matching order was found.`
      );
    }

    // 8. Record Event ID in Database to guarantee event processing idempotency
    try {
      await supabase.from("webhook_events").insert({
        event_id: eventId,
        event_type: eventType,
        status: "processed",
        payload,
      });
    } catch (evtErr) {
      console.warn("Webhook event logging skipped:", evtErr);
    }

    return NextResponse.json({
      received: true,
      processed: true,
      eventId,
      status: paymentStatus,
    });
  } catch (err: any) {
    console.error("Square webhook processing error:", err);
    return NextResponse.json(
      { error: err?.message || "Webhook handling internal error" },
      { status: 500 }
    );
  }
}
