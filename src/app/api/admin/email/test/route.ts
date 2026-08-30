import React from "react";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { isResendConfigured } from "@/lib/email/resend";
import { sendTransactionalEmail } from "@/lib/email/send";
import { formatOrderForEmail } from "@/lib/email/notifications";
import type { OrderEmailEvent, EmailOrderData } from "@/lib/email/types";

// Templates
import { CustomerOrderConfirmation } from "@/lib/email/templates/CustomerOrderConfirmation";
import { AdminNewOrder } from "@/lib/email/templates/AdminNewOrder";
import { OrderProcessing } from "@/lib/email/templates/OrderProcessing";
import { OrderShipped } from "@/lib/email/templates/OrderShipped";
import { OrderDelivered } from "@/lib/email/templates/OrderDelivered";
import { OrderCancelled } from "@/lib/email/templates/OrderCancelled";
import { OrderRefunded } from "@/lib/email/templates/OrderRefunded";

const SAMPLE_MOCK_ORDER: EmailOrderData = {
  orderNumber: "FC-ORD-TEST-SAMPLE",
  customerName: "Simran Gourmet Tester",
  customerEmail: "tester@example.com",
  customerPhone: "+61 412 345 678",
  shippingAddress: {
    street: "Unit 4, 124 George Street",
    city: "The Rocks, Sydney",
    state: "NSW",
    postalCode: "2000",
    country: "Australia",
    formatted: "Unit 4, 124 George Street, The Rocks, Sydney, NSW 2000, Australia",
  },
  shippingMethod: "Sydney Fresh Express Delivery",
  paymentMethod: "Square Online Credit Card",
  paymentStatus: "paid",
  squarePaymentId: "sq_pay_test_preview_9876",
  squareReceiptUrl: "https://squareupsandbox.com/receipt/preview/FC-ORD-TEST",
  items: [
    {
      id: "prod-butter-chicken",
      name: "Smoked Butter Chicken Gourmet Pie",
      price: 15.0,
      quantity: 4,
      variant: "Family Pack (4 pcs)",
    },
    {
      id: "prod-samosa-pie",
      name: "Spiced Potato & Pea Samosa Pie",
      price: 12.5,
      quantity: 2,
      variant: "Chilli Flakes Glaze",
    },
  ],
  subtotal: 85.0,
  shippingFee: 0.0,
  taxAmount: 7.73,
  totalAmount: 85.0,
  status: "completed",
  fulfillmentNotes: "Please leave at front door if no answer. Ring bell twice.",
  createdAt: new Date().toISOString(),
  viewOrderUrl: "http://localhost:3000/profile",
  adminOrderUrl: "http://localhost:3000/admin/orders",
  trackingNumber: "AP-EXP-9928172AU",
  trackingUrl: "https://auspost.com.au/mypost/track/#/details/AP-EXP-9928172AU",
  courierName: "Australia Post Express",
  estimatedDelivery: "Tomorrow by 2:00 PM",
  refundAmount: 85.0,
};

export async function POST(req: Request) {
  // 1. Strict Admin Authentication Guard
  const { error: authError } = await requireAdminApi();
  if (authError) {
    return authError;
  }

  try {
    const body = await req.json();
    const { event, recipientEmail, customOrder } = body as {
      event: OrderEmailEvent;
      recipientEmail?: string;
      customOrder?: any;
    };

    if (!isResendConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not configured or is invalid in server environment.",
          configured: false,
        },
        { status: 400 }
      );
    }

    const orderData: EmailOrderData = formatOrderForEmail(
      customOrder || {
        ...SAMPLE_MOCK_ORDER,
        customerEmail: recipientEmail || SAMPLE_MOCK_ORDER.customerEmail,
      }
    );

    const targetEmail = recipientEmail || orderData.customerEmail;
    if (!targetEmail) {
      return NextResponse.json(
        { success: false, error: "Recipient email is required for testing." },
        { status: 400 }
      );
    }

    let subject = "";
    let templateComponent: React.ReactElement | null = null;
    let templateName = "";

    switch (event) {
      case "order_confirmed_customer":
        subject = `[TEST] Order #${orderData.orderNumber} Confirmed 🎉`;
        templateComponent = React.createElement(CustomerOrderConfirmation, { order: orderData });
        templateName = "CustomerOrderConfirmation";
        break;

      case "order_confirmed_admin":
        subject = `[TEST] 🛒 New Order #${orderData.orderNumber} Received`;
        templateComponent = React.createElement(AdminNewOrder, { order: orderData });
        templateName = "AdminNewOrder";
        break;

      case "order_processing":
        subject = `[TEST] Your order #${orderData.orderNumber} is being prepared 👨‍🍳`;
        templateComponent = React.createElement(OrderProcessing, { order: orderData });
        templateName = "OrderProcessing";
        break;

      case "order_shipped":
        subject = `[TEST] Your order #${orderData.orderNumber} has shipped! 🚚`;
        templateComponent = React.createElement(OrderShipped, { order: orderData });
        templateName = "OrderShipped";
        break;

      case "order_delivered":
        subject = `[TEST] Thank you for your order! Please rate your pies (Order #${orderData.orderNumber}) ⭐`;
        templateComponent = React.createElement(OrderDelivered, { order: orderData });
        templateName = "OrderDelivered";
        break;

      case "order_cancelled":
        subject = `[TEST] Your order #${orderData.orderNumber} has been cancelled`;
        templateComponent = React.createElement(OrderCancelled, { order: orderData });
        templateName = "OrderCancelled";
        break;

      case "order_refunded":
        subject = `[TEST] Your refund for order #${orderData.orderNumber} has been processed`;
        templateComponent = React.createElement(OrderRefunded, { order: orderData });
        templateName = "OrderRefunded";
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Invalid event type "${event}". Must be one of: order_confirmed_customer, order_confirmed_admin, order_processing, order_shipped, order_delivered, order_cancelled, order_refunded`,
          },
          { status: 400 }
        );
    }

    const testIdempotencyKey = `test_idem_${event}_${Date.now()}`;

    const sendResult = await sendTransactionalEmail({
      to: targetEmail,
      subject,
      react: templateComponent,
      orderId: orderData.orderNumber,
      orderNumber: orderData.orderNumber,
      event,
      templateName,
      idempotencyKey: testIdempotencyKey,
      replyTo: event === "order_confirmed_admin" ? orderData.customerEmail : undefined,
    });

    if (!sendResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: sendResult.error || "Resend email dispatch failed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: sendResult.messageId,
      recipient: targetEmail,
      event,
      template: templateName,
      message: `Test email for '${event}' dispatched successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal server error during email test.",
      },
      { status: 500 }
    );
  }
}
