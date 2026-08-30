import type { Order, OrderItem, ShippingAddress } from "@/lib/types";

export type OrderEmailEvent =
  | "order_confirmed_customer"
  | "order_confirmed_admin"
  | "order_processing"
  | "order_shipped"
  | "order_delivered"
  | "order_cancelled"
  | "order_refunded";

export type EmailNotificationStatus = "sent" | "failed" | "skipped";

export interface EmailNotificationRecord {
  id?: string;
  orderId?: string;
  orderNumber: string;
  channel: "email";
  event: OrderEmailEvent;
  recipient: string;
  template: string;
  status: EmailNotificationStatus;
  providerMessageId?: string | null;
  errorMessage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactNode;
  replyTo?: string | string[];
  orderId?: string;
  orderNumber?: string;
  event: OrderEmailEvent;
  templateName: string;
  idempotencyKey?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  skipped?: boolean;
}

export interface FormattedAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formatted: string;
}

export interface EmailOrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: FormattedAddress;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  squarePaymentId?: string;
  squareReceiptUrl?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  fulfillmentNotes?: string;
  createdAt: string;
  viewOrderUrl: string;
  adminOrderUrl: string;
  trackingNumber?: string;
  trackingUrl?: string;
  courierName?: string;
  estimatedDelivery?: string;
  refundAmount?: number;
  refundReason?: string;
}
