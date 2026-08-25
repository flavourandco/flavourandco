import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createSquarePayment } from "@/lib/square";

export async function POST(req: Request) {
  try {
    // 1. Validate Clerk Session
    const { userId } = await auth();

    const body = await req.json();
    const { orderId, idempotencyKey, sourceId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing order identifier." },
        { status: 400 }
      );
    }

    if (!sourceId) {
      return NextResponse.json(
        { error: "Payment source token missing from client." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured." },
        { status: 500 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database client unavailable." },
        { status: 500 }
      );
    }

    // 2. Fetch Order from Database
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: "Order record not found." },
        { status: 404 }
      );
    }

    // 3. User Authorization Check (If order belongs to an authenticated user, verify match)
    if (order.user_id && userId && order.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to order payment." },
        { status: 403 }
      );
    }

    // Reuse persistent idempotency key stored on order if not provided
    const finalIdempotencyKey = idempotencyKey || order.idempotency_key || `SQ_IDEM_${order.id}_${Date.now()}`;
    const amountCents = Math.round(Number(order.total_amount) * 100);
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "";

    // 4. Call Square Payments API Server-Side
    const squareResult = await createSquarePayment({
      sourceId,
      idempotencyKey: finalIdempotencyKey,
      amountCents,
      currency: "AUD",
      locationId,
      referenceId: order.order_number,
      buyerEmail: order.customer_email,
      note: `Flavour & Co. Order ${order.order_number}`,
    });

    if (!squareResult.success) {
      // Safely attempt recording failed payment attempt
      try {
        await supabase
          .from("payment_attempts")
          .update({
            status: "failed",
            raw_response: squareResult.raw || { error: squareResult.error },
            updated_at: new Date().toISOString(),
          })
          .eq("idempotency_key", finalIdempotencyKey);
      } catch (attemptErr) {
        console.warn("Payment attempt log skipped:", attemptErr);
      }

      return NextResponse.json(
        { error: squareResult.error || "Payment transaction declined by Square." },
        { status: 400 }
      );
    }

    const paymentId = squareResult.paymentId || "";
    const receiptUrl = squareResult.receiptUrl || `https://squareupsandbox.com/receipt/preview/${order.order_number}`;
    const paymentStatus = squareResult.status || "APPROVED";

    // 5. Safely Log Payment Attempt in Database
    try {
      await supabase
        .from("payment_attempts")
        .upsert(
          {
            order_id: order.id,
            order_number: order.order_number,
            user_id: userId || order.user_id || null,
            idempotency_key: finalIdempotencyKey,
            square_payment_id: paymentId,
            amount: order.total_amount,
            currency: "AUD",
            status: paymentStatus === "COMPLETED" ? "completed" : "processing",
            raw_response: squareResult.raw || {},
            updated_at: new Date().toISOString(),
          },
          { onConflict: "idempotency_key" }
        );
    } catch (attemptErr) {
      console.warn("Payment attempt log skipped:", attemptErr);
    }

    // 6. Update Order Initial Payment Metadata
    await supabase
      .from("orders")
      .update({
        square_payment_id: paymentId,
        square_transaction_id: paymentId,
        square_receipt_url: receiptUrl,
        payment_status: paymentStatus === "COMPLETED" ? "paid" : "pending",
        status: paymentStatus === "COMPLETED" ? "completed" : "processing",
        fulfillment_notes: paymentStatus === "COMPLETED" 
          ? "Paid & Confirmed via Square" 
          : "Payment accepted, pending webhook confirmation",
      })
      .eq("id", order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      paymentId,
      status: paymentStatus,
      totalAmount: order.total_amount,
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
      message: "Payment processed successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Square checkout handler error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
