import React from "react";
import { BaseLayout } from "./BaseLayout";
import type { EmailOrderData } from "../types";

export const OrderCancelled: React.FC<{ order: EmailOrderData }> = ({ order }) => {
  const firstName = order.customerName ? order.customerName.split(" ")[0] : "there";

  return (
    <BaseLayout
      previewText={`Update regarding your Flavour & Co. order #${order.orderNumber} - Order Cancelled.`}
      badgeText="Order Cancelled"
      badgeColor="#e11d48"
      badgeBg="#ffe4e6"
      title={`Order #${order.orderNumber} Cancelled`}
      subtitle={`Hello ${firstName}, your order has been cancelled.`}
    >
      <div style={{ color: "#1c1410", fontSize: "14px", lineHeight: "1.6" }}>
        {/* Callout Notice */}
        <div
          style={{
            backgroundColor: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#9f1239", marginBottom: "4px" }}>
            Cancellation Notice
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#881337" }}>
            {order.fulfillmentNotes || "Your order was cancelled per your request or due to fulfillment constraints."}
          </p>
        </div>

        {/* Support Callout */}
        <p style={{ fontSize: "13px", color: "#57534e", lineHeight: "1.5" }}>
          If you did not request this cancellation or have questions about a refund or replacement order, please reply directly to this email or contact us at{" "}
          <a href="mailto:help@flavourandco.com.au" style={{ color: "#6b1e30", fontWeight: "bold", textDecoration: "underline" }}>
            help@flavourandco.com.au
          </a>.
        </p>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "24px", marginBottom: "20px" }}>
          <a
            href={order.viewOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: "#1c1410",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Review Order Status
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};
