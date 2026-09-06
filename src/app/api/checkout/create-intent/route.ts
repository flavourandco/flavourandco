import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { calculateAuthoritativeOrderTotals } from "@/lib/orders";

export async function POST(req: Request) {
  try {
    // 1. Authenticate Clerk Session
    const { userId } = await auth();

    const body = await req.json();
    const { items, customer, discountCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!customer || !customer.email || !customer.fullName || !customer.address) {
      return NextResponse.json(
        { error: "Missing required contact or delivery address details." },
        { status: 400 }
      );
    }

    if (!customer.postcode || !/^\d{4}$/.test(String(customer.postcode).trim())) {
      return NextResponse.json(
        { error: "Please provide a valid 4-digit Australian postcode." },
        { status: 400 }
      );
    }

    // 2. Calculate Authoritative Total using DB prices (ignoring client unitPrices) with discount validation
    const totals = await calculateAuthoritativeOrderTotals(
      items,
      customer.postcode,
      customer.email,
      discountCode
    );

    // 3. Generate Unique Order ID and Idempotency Key
    const orderNumber = `FC-ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const idempotencyKey = `SQ_IDEM_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database configuration missing on server." },
        { status: 500 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Failed to initialize database client." },
        { status: 500 }
      );
    }

    // 4. Create Pending Order in Supabase with automatic schema compatibility fallback
    const baseOrderPayload: Record<string, any> = {
      order_number: orderNumber,
      customer_name: customer.fullName,
      customer_email: customer.email,
      customer_phone: customer.phone || null,
      shipping_address: {
        street: customer.address,
        unit: customer.unit || "",
        city: customer.city || "Sydney",
        state: customer.state || "NSW",
        postalCode: customer.postcode || "2000",
        country: "Australia",
        notes: customer.notes || "",
        ...(totals.discountCode
          ? { discountCode: totals.discountCode, discountAmount: totals.discountAmount }
          : {}),
      },
      shipping_method: "Standard Express Delivery",
      payment_method: "Square Credit Card",
      payment_status: "pending",
      items: totals.validatedItems.map((it) => ({
        id: it.id,
        name: it.name,
        image: it.image,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        variantName: it.variantName,
      })),
      subtotal: totals.subtotal,
      shipping_fee: totals.shippingFee,
      tax_amount: totals.taxAmount,
      total_amount: totals.totalAmount,
      status: "pending",
      fulfillment_notes: totals.discountCode
        ? `${customer.notes ? customer.notes + " | " : ""}Coupon applied: ${totals.discountCode} (-$${totals.discountAmount})`
        : customer.notes || "Order pending payment",
    };

    // Construct full payload including optional/extended fields if present
    const fullPayload: Record<string, any> = {
      ...baseOrderPayload,
      items_count: totals.itemsCount,
      user_id: userId || null,
      idempotency_key: idempotencyKey,
    };

    if (totals.discountAmount && totals.discountAmount > 0) {
      fullPayload.discount_amount = totals.discountAmount;
    }
    if (totals.discountCode) {
      fullPayload.discount_code = totals.discountCode;
    }

    let orderData = null;

    // Step 1: Attempt full payload insert
    const { data: d1, error: e1 } = await supabase
      .from("orders")
      .insert(fullPayload)
      .select()
      .single();

    if (!e1 && d1) {
      orderData = d1;
    } else {
      console.warn("Retrying order insert without optional extended columns:", e1?.message);
      
      // Step 2: Attempt insert without discount columns
      const withoutDiscounts = { ...fullPayload };
      delete withoutDiscounts.discount_amount;
      delete withoutDiscounts.discount_code;

      const { data: d2, error: e2 } = await supabase
        .from("orders")
        .insert(withoutDiscounts)
        .select()
        .single();

      if (!e2 && d2) {
        orderData = d2;
      } else {
        console.warn("Retrying order insert with minimum required core columns:", e2?.message);
        
        // Step 3: Attempt minimal base payload insert
        const { data: d3, error: e3 } = await supabase
          .from("orders")
          .insert(baseOrderPayload)
          .select()
          .single();

        if (e3 || !d3) {
          console.error("Order creation database error:", e3);
          return NextResponse.json(
            { error: e3?.message || "Failed to create order intent record." },
            { status: 500 }
          );
        }
        orderData = d3;
      }
    }

    // 5. Create Payment Attempt Record (if payment_attempts table exists)
    try {
      await supabase.from("payment_attempts").insert({
        order_id: orderData.id,
        order_number: orderNumber,
        user_id: userId || null,
        idempotency_key: idempotencyKey,
        amount: totals.totalAmount,
        currency: "AUD",
        status: "pending",
      });
    } catch (attemptErr) {
      console.warn("Payment attempt log skipped:", attemptErr);
    }

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      orderNumber,
      idempotencyKey,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      discountCode: totals.discountCode,
      discountReason: totals.discountReason,
      shippingFee: totals.shippingFee,
      totalAmount: totals.totalAmount,
      totalAmountCents: totals.totalAmountCents,
      currency: "AUD",
    });
  } catch (err: any) {
    console.error("Create intent error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create payment intent." },
      { status: 500 }
    );
  }
}
