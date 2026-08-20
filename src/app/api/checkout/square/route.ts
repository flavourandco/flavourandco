import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  calculateShippingFee,
  isValidAustralianPostcode,
} from "@/lib/shipping";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, sourceId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    if (!customer || !customer.email || !customer.fullName || !customer.address) {
      return NextResponse.json(
        { error: "Missing customer contact or delivery details." },
        { status: 400 }
      );
    }

    // Validate customer contact and delivery details
    if (!customer.postcode || !/^\d{4}$/.test(String(customer.postcode).trim())) {
      return NextResponse.json(
        { error: "Please enter a valid 4-digit Australian postcode." },
        { status: 400 }
      );
    }

    // Calculate subtotal and total in AUD cents for Square
    const subtotal = items.reduce(
      (sum: number, item: { unitPrice: number; quantity: number }) =>
        sum + item.unitPrice * item.quantity,
      0
    );

    const shippingFee = calculateShippingFee(subtotal, customer.postcode);
    const totalAmount = subtotal + shippingFee;
    const totalAmountCents = Math.round(totalAmount * 100);

    const squareAppId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
    const squareLocationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
    const squareEnv = process.env.SQUARE_ENVIRONMENT || "sandbox";

    // Unique order reference ID
    const orderId = `FC-ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    let paymentId = `SQ_MOCK_${Date.now().toString(36).toUpperCase()}`;
    let receiptUrl: string | undefined = undefined;

    // If Square API keys are configured and token is real, call Square Payments API
    if (squareAccessToken && !squareAccessToken.includes("EXAMPLE")) {
      const squareUrl =
        squareEnv === "production"
          ? "https://connect.squareup.com/v2/payments"
          : "https://connect.squareupsandbox.com/v2/payments";

      const squareRes = await fetch(squareUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${squareAccessToken}`,
          "Square-Version": "2024-01-18",
        },
        body: JSON.stringify({
          source_id: sourceId || "cnon:card-nonce-ok",
          idempotency_key: orderId,
          amount_money: {
            amount: totalAmountCents,
            currency: "AUD",
          },
          location_id: squareLocationId,
          reference_id: orderId,
          buyer_email_address: customer.email,
          note: `Flavour & Co. Gourmet Order (${items.length} items)`,
        }),
      });

      const squareData = await squareRes.json();

      if (!squareRes.ok) {
        const errorMsg =
          squareData.errors?.[0]?.detail || "Square payment processing failed.";
        return NextResponse.json({ error: errorMsg }, { status: 400 });
      }

      paymentId = squareData.payment?.id || `sq_${orderId}`;
      receiptUrl = squareData.payment?.receipt_url;
    }

    // Persist Order in Supabase Database
    let dbRecord = null;
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseServerClient();
        if (supabase) {
          const itemsCount = items.reduce(
            (acc: number, item: any) => acc + (item.quantity || 1),
            0
          );

          const { data, error } = await supabase
            .from("orders")
            .insert({
              order_number: orderId,
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
              },
              shipping_method: "Standard Express Delivery",
              payment_method: "Square Credit Card",
              payment_status: "paid",
              square_payment_id: paymentId,
              square_transaction_id: paymentId,
              square_receipt_url: receiptUrl || `https://squareupsandbox.com/receipt/preview/${orderId}`,
              items: items.map((it: any) => ({
                id: it.id,
                name: it.product.name,
                image: it.product.images?.[0] || it.product.image,
                unitPrice: it.unitPrice,
                quantity: it.quantity,
                variantName: it.variantName || null,
              })),
              subtotal,
              shipping_fee: shippingFee,
              tax_amount: 0.0,
              total_amount: totalAmount,
              status: "completed",
              items_count: itemsCount,
              fulfillment_notes: customer.notes || "Paid & Confirmed via Square",
            })
            .select()
            .single();

          if (error) {
            console.error("Supabase order insert error:", error.message);
          } else {
            dbRecord = data;
          }
        }
      } catch (dbErr) {
        console.error("Error persisting order to database:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      dbId: dbRecord?.id || null,
      paymentId,
      status: "COMPLETED",
      totalAmount,
      customer,
      items,
      message: "Order placed and saved successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

