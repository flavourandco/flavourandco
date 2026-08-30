import React from "react";
import { getAppBaseUrl, getAdminEmailAddress } from "./resend";
import { sendTransactionalEmail } from "./send";
import type { Order, OrderItem, ShippingAddress } from "@/lib/types";
import type { EmailOrderData, FormattedAddress, OrderEmailEvent } from "./types";
import { getTrackingUrl } from "@/lib/tracking";

// Template Components
import { CustomerOrderConfirmation } from "./templates/CustomerOrderConfirmation";
import { AdminNewOrder } from "./templates/AdminNewOrder";
import { OrderProcessing } from "./templates/OrderProcessing";
import { OrderShipped } from "./templates/OrderShipped";
import { OrderDelivered } from "./templates/OrderDelivered";
import { OrderCancelled } from "./templates/OrderCancelled";
import { OrderRefunded } from "./templates/OrderRefunded";

export { getTrackingUrl };

/**
 * Normalizes shipping address from string or object to standard formatted object.
 */
function normalizeShippingAddress(addr: ShippingAddress | string | any): FormattedAddress {
  if (typeof addr === "string") {
    return {
      street: addr,
      city: "Sydney",
      state: "NSW",
      postalCode: "2000",
      country: "Australia",
      formatted: addr,
    };
  }

  const street = addr?.street || addr?.address || "124 George Street";
  const unit = addr?.unit ? `Unit ${addr.unit}, ` : "";
  const city = addr?.city || "Sydney";
  const state = addr?.state || "NSW";
  const postalCode = addr?.postalCode || addr?.postcode || "2000";
  const country = addr?.country || "Australia";

  return {
    street: `${unit}${street}`.trim(),
    city,
    state,
    postalCode,
    country,
    formatted: `${unit}${street}, ${city}, ${state} ${postalCode}, ${country}`,
  };
}

/**
 * Normalizes raw order item array into clean typed OrderItem[].
 */
function normalizeOrderItems(rawItems: any[], appBaseUrl?: string): OrderItem[] {
  if (!Array.isArray(rawItems)) return [];
  const base = appBaseUrl || getAppBaseUrl();

  return rawItems.map((it) => {
    const id = it.id || it.productId || it.product_id || it.product?.id || "";
    const name = it.name || it.product?.name || "Gourmet Pie";
    const slug = (name || "pie")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const productUrl = id ? `${base}/shop/${slug}/${id}#reviews` : `${base}/shop`;

    return {
      id,
      name,
      price: typeof it.price === "number" ? it.price : (typeof it.unitPrice === "number" ? it.unitPrice : 0),
      quantity: typeof it.quantity === "number" ? it.quantity : 1,
      image: it.image || it.product?.image || it.product?.images?.[0] || "",
      variant: it.variant || it.variantName || undefined,
      productUrl,
    };
  });
}

/**
 * Converts generic or database Order object to rich EmailOrderData.
 */
export function formatOrderForEmail(order: any): EmailOrderData {
  const appBaseUrl = getAppBaseUrl();
  const orderNumber = order.orderNumber || order.order_number || `FC-ORD-${order.id || Date.now()}`;

  const totalAmount = Number(order.totalAmount ?? order.total_amount ?? 0);
  const subtotal = Number(order.subtotal ?? (totalAmount - (order.shippingFee ?? order.shipping_fee ?? 0)));
  const shippingFee = Number(order.shippingFee ?? order.shipping_fee ?? 0);
  const taxAmount = Number(order.taxAmount ?? order.tax_amount ?? ((totalAmount * 10) / 110));

  const items = normalizeOrderItems(order.items, appBaseUrl);
  const shippingAddress = normalizeShippingAddress(order.shippingAddress || order.shipping_address);

  // Deep links
  const viewOrderUrl = `${appBaseUrl}/profile`;
  const adminOrderUrl = `${appBaseUrl}/admin/orders`;

  const trackingNumber = order.trackingNumber || order.tracking_number || undefined;
  const courierName = order.courierName || order.courier_name || (trackingNumber ? "Australia Post Express" : undefined);
  const trackingUrl = getTrackingUrl(trackingNumber, courierName, order.trackingUrl || order.tracking_url);

  return {
    orderNumber,
    customerName: order.customerName || order.customer_name || "Valued Customer",
    customerEmail: order.customerEmail || order.customer_email || "",
    customerPhone: order.customerPhone || order.customer_phone || undefined,
    shippingAddress,
    shippingMethod: order.shippingMethod || order.shipping_method || "Standard Express Delivery",
    paymentMethod: order.paymentMethod || order.payment_method || "Square Online Payment",
    paymentStatus: order.paymentStatus || order.payment_status || "paid",
    squarePaymentId: order.squarePaymentId || order.square_payment_id || undefined,
    squareReceiptUrl: order.squareReceiptUrl || order.square_receipt_url || undefined,
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    shippingFee: Math.round(shippingFee * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    status: order.status || "completed",
    fulfillmentNotes: order.fulfillmentNotes || order.fulfillment_notes || undefined,
    createdAt: order.createdAt || order.created_at || new Date().toISOString(),
    viewOrderUrl,
    adminOrderUrl,
    trackingNumber,
    trackingUrl,
    courierName,
    estimatedDelivery: order.estimatedDelivery || order.estimated_delivery || undefined,
    refundAmount: order.refundAmount || order.refund_amount || undefined,
    refundReason: order.refundReason || order.refund_reason || undefined,
  };
}

/**
 * Sends both Customer Order Confirmation and Admin New Order emails.
 * Called only upon verified authoritative payment confirmation.
 * Safe side effect with full idempotency.
 */
export async function sendOrderConfirmationNotifications(orderInput: any): Promise<{
  customer: { success: boolean; error?: string; skipped?: boolean };
  admin: { success: boolean; error?: string; skipped?: boolean };
}> {
  const order = formatOrderForEmail(orderInput);
  const orderId = orderInput.id || order.orderNumber;

  console.log(`[ORDER NOTIFICATIONS] Triggering order confirmation emails for #${order.orderNumber}...`);

  // 1. Send Customer Confirmation Email
  let customerResult: { success: boolean; error?: string; skipped?: boolean } = {
    success: false,
    error: "Not attempted",
  };
  try {
    if (order.customerEmail) {
      customerResult = await sendTransactionalEmail({
        to: order.customerEmail,
        subject: `Order #${order.orderNumber} Confirmed 🎉`,
        react: React.createElement(CustomerOrderConfirmation, { order }),
        orderId,
        orderNumber: order.orderNumber,
        event: "order_confirmed_customer",
        templateName: "CustomerOrderConfirmation",
        idempotencyKey: `idem_cust_conf_${order.orderNumber}`,
      });
    } else {
      customerResult = { success: false, error: "Customer email is missing." };
    }
  } catch (err: any) {
    console.error(`[CUSTOMER EMAIL ERROR] #${order.orderNumber}:`, err?.message || err);
    customerResult = { success: false, error: err?.message || "Customer email failed." };
  }

  // 2. Send Admin New Order Notification Email
  let adminResult: { success: boolean; error?: string; skipped?: boolean } = {
    success: false,
    error: "Not attempted",
  };

  try {
    const adminEmail = getAdminEmailAddress();
    if (adminEmail) {
      adminResult = await sendTransactionalEmail({
        to: adminEmail,
        subject: `🛒 New Order #${order.orderNumber} Received`,
        react: React.createElement(AdminNewOrder, { order }),
        replyTo: order.customerEmail || undefined,
        orderId,
        orderNumber: order.orderNumber,
        event: "order_confirmed_admin",
        templateName: "AdminNewOrder",
        idempotencyKey: `idem_admin_conf_${order.orderNumber}`,
      });
    }
  } catch (err: any) {
    console.error(`[ADMIN EMAIL ERROR] #${order.orderNumber}:`, err?.message || err);
    adminResult = { success: false, error: err?.message || "Admin email failed." };
  }

  return { customer: customerResult, admin: adminResult };
}

/**
 * Sends status update emails to the customer when admin transitions order status.
 * Supported events: processing, shipped, completed / delivered, cancelled, refunded.
 */
export async function sendStatusUpdateNotification(
  orderInput: any,
  newStatus: Order["status"] | string
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  const order = formatOrderForEmail(orderInput);
  const orderId = orderInput.id || order.orderNumber;

  if (!order.customerEmail) {
    console.warn(`[STATUS EMAIL SKIPPED] No customer email found for Order #${order.orderNumber}`);
    return { success: false, error: "Customer email missing" };
  }

  const normalizedStatus = String(newStatus).toLowerCase().trim();

  let subject = "";
  let templateComponent: React.ReactElement | null = null;
  let eventName: OrderEmailEvent = "order_processing";
  let templateName = "";

  switch (normalizedStatus) {
    case "processing":
      subject = `Your order #${order.orderNumber} is being prepared 👨‍🍳`;
      templateComponent = React.createElement(OrderProcessing, { order });
      eventName = "order_processing";
      templateName = "OrderProcessing";
      break;

    case "shipped":
      subject = `Your order #${order.orderNumber} has shipped! 🚚`;
      templateComponent = React.createElement(OrderShipped, { order });
      eventName = "order_shipped";
      templateName = "OrderShipped";
      break;

    case "completed":
    case "delivered":
      subject = `Thank you for your order! Please rate your pies (Order #${order.orderNumber}) ⭐`;
      templateComponent = React.createElement(OrderDelivered, { order });
      eventName = "order_delivered";
      templateName = "OrderDelivered";
      break;

    case "cancelled":
      subject = `Your order #${order.orderNumber} has been cancelled`;
      templateComponent = React.createElement(OrderCancelled, { order });
      eventName = "order_cancelled";
      templateName = "OrderCancelled";
      break;

    case "refunded":
      subject = `Your refund for order #${order.orderNumber} has been processed`;
      templateComponent = React.createElement(OrderRefunded, { order });
      eventName = "order_refunded";
      templateName = "OrderRefunded";
      break;

    default:
      console.log(`[STATUS EMAIL IGNORED] No email trigger defined for status "${newStatus}".`);
      return { success: true, skipped: true };
  }

  try {
    return await sendTransactionalEmail({
      to: order.customerEmail,
      subject,
      react: templateComponent,
      orderId,
      orderNumber: order.orderNumber,
      event: eventName,
      templateName,
      idempotencyKey: `idem_status_${eventName}_${order.orderNumber}`,
    });
  } catch (err: any) {
    console.error(`[STATUS NOTIFICATION ERROR] Order #${order.orderNumber} status ${newStatus}:`, err?.message || err);
    return { success: false, error: err?.message || "Status email failed" };
  }
}
