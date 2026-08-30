import React from "react";
import { BaseLayout } from "./BaseLayout";
import type { EmailOrderData } from "../types";

export const OrderRefunded: React.FC<{ order: EmailOrderData }> = ({ order }) => {
  const firstName = order.customerName ? order.customerName.split(" ")[0] : "there";
  const refundAmount = order.refundAmount ?? order.totalAmount;

  return (
    <BaseLayout
      previewText={`Refund processed for Flavour & Co. order #${order.orderNumber} ($${refundAmount.toFixed(2)} AUD)`}
      badgeText="Refund Processed"
      badgeColor="#4f46e5"
      badgeBg="#eef2ff"
      title={`Refund Processed for Order #${order.orderNumber}`}
      subtitle={`Hello ${firstName}, a refund has been issued to your original payment method.`}
    >
      <div style={{ color: "#1c1410", fontSize: "14px", lineHeight: "1.6" }}>
        {/* Refund Details Box */}
        <div
          style={{
            backgroundColor: "#faf6f0",
            border: "1px solid #ede3d7",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
            <tbody>
              <tr>
                <td style={{ padding: "4px 0", fontSize: "13px", color: "#57534e" }}>Order Reference:</td>
                <td align="right" style={{ padding: "4px 0", fontSize: "13px", fontWeight: "bold", fontFamily: "monospace", color: "#1c1410" }}>
                  {order.orderNumber}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 0", fontSize: "13px", color: "#57534e" }}>Refunded Amount:</td>
                <td align="right" style={{ padding: "4px 0", fontSize: "15px", fontWeight: "bold", fontFamily: "monospace", color: "#6b1e30" }}>
                  ${refundAmount.toFixed(2)} AUD
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px 0", fontSize: "13px", color: "#57534e" }}>Payment Method:</td>
                <td align="right" style={{ padding: "4px 0", fontSize: "13px", color: "#1c1410" }}>
                  {order.paymentMethod || "Square Credit Card"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: "13px", color: "#57534e", lineHeight: "1.5" }}>
          Depending on your card issuer or financial institution, refunded funds typically reflect on your bank or credit card statement within <strong>3&ndash;5 business days</strong>.
        </p>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "24px", marginBottom: "20px" }}>
          <a
            href={order.viewOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: "#6b1e30",
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
            View Order Record
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};
