import { NextResponse } from "next/server";
import {
  sendOrderConfirmationNotifications,
  sendStatusUpdateNotification,
} from "@/lib/email/notifications";
import { getAppBaseUrl, getAdminEmailAddress, isResendConfigured } from "@/lib/email/resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    if (!isResendConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not configured or invalid. Please check your .env configuration.",
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { template, targetEmail } = body;

    const base = getAppBaseUrl();
    const adminEmail = getAdminEmailAddress();
    const customerEmail = targetEmail || adminEmail || "help@flavourandco.com.au";

    // Mock rich order payload for test email rendering
    const mockOrder = {
      id: "ord_test_" + Date.now(),
      orderNumber: "FC-TEST-" + Math.floor(1000 + Math.random() * 9000),
      customerName: "Simranjit Singh",
      customerEmail,
      customerPhone: "+61 400 123 456",
      shippingAddress: {
        unit: "4B",
        street: "88 George Street",
        city: "The Rocks, Sydney",
        state: "NSW",
        postalCode: "2000",
        country: "Australia",
      },
      shippingMethod: "Refrigerated Express Courier (Next-Day)",
      paymentMethod: "Square Online Card (•••• 4242)",
      paymentStatus: "paid",
      squarePaymentId: "sq_pay_test_9831720491",
      squareReceiptUrl: "https://squareupsandbox.com/receipt/preview/TEST-REC-1",
      items: [
        {
          id: "butter-chicken-pie",
          name: "Butter Chicken Pie",
          variant: "Pack of 4 (Family Size)",
          price: 36.0,
          quantity: 2,
          image: "/products/butter-chicken-pie.png",
          productUrl: `${base}/shop/butter-chicken-pie/butter-chicken-pie#reviews`,
        },
        {
          id: "palak-paneer-pie",
          name: "Palak Paneer Pie",
          variant: "Party Box (12 Mini Pies)",
          price: 48.0,
          quantity: 1,
          image: "/products/palak-paneer-pie.png",
          productUrl: `${base}/shop/palak-paneer-pie/palak-paneer-pie#reviews`,
        },
      ],
      subtotal: 120.0,
      shippingFee: 15.0,
      taxAmount: 13.5,
      totalAmount: 148.5,
      status: "processing",
      trackingNumber: "AP-EXP-8891240AU",
      courierName: "Australia Post Express",
      estimatedDelivery: "Tomorrow by 2:00 PM",
      fulfillmentNotes: "Thermal insulated box with food-grade dry ice packs.",
      createdAt: new Date().toISOString(),
      viewOrderUrl: `${base}/profile`,
      adminOrderUrl: `${base}/admin/orders`,
    };

    let result: any = null;

    if (template === "order_confirmed" || template === "confirmation") {
      result = await sendOrderConfirmationNotifications(mockOrder);
    } else if (template === "shipped") {
      result = await sendStatusUpdateNotification(mockOrder, "shipped");
    } else if (template === "delivered" || template === "completed") {
      result = await sendStatusUpdateNotification(mockOrder, "completed");
    } else if (template === "cancelled") {
      result = await sendStatusUpdateNotification(mockOrder, "cancelled");
    } else if (template === "refunded") {
      result = await sendStatusUpdateNotification(
        { ...mockOrder, refundAmount: 148.5, refundReason: "Customer request - schedule change" },
        "refunded"
      );
    } else {
      // Default: test processing email
      result = await sendStatusUpdateNotification(mockOrder, "processing");
    }

    return NextResponse.json({
      success: true,
      message: `Test email dispatched to ${customerEmail}`,
      result,
      mockOrderNumber: mockOrder.orderNumber,
    });
  } catch (err: any) {
    console.error("[TEST EMAIL ROUTE ERROR]", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to send test email" },
      { status: 500 }
    );
  }
}
