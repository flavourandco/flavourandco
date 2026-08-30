import React from "react";
import { BaseLayout } from "./BaseLayout";
import type { EmailOrderData } from "../types";

export const OrderProcessing: React.FC<{ order: EmailOrderData }> = ({ order }) => {
  const firstName = order.customerName ? order.customerName.split(" ")[0] : "there";

  return (
    <BaseLayout
      previewText={`Your Flavour & Co. order #${order.orderNumber} is now being prepared in our bakery.`}
      badgeText="Order Preparing"
      badgeColor="#c69c40"
      badgeBg="#fbf5e6"
      title={`Your Order Is In The Kitchen, ${firstName}!`}
      subtitle={`Our bakers have begun carefully crafting and packaging your gourmet pies.`}
    >
      <div style={{ color: "#1c1410", fontSize: "14px", lineHeight: "1.6" }}>
        {/* Status Highlight */}
        <div
          style={{
            backgroundColor: "#faf6f0",
            border: "1px solid #ede3d7",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>📦 👨‍🍳</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "bold", color: "#6b1e30" }}>
            Order #{order.orderNumber} is in Preparation
          </div>
          <p style={{ fontSize: "12px", color: "#57534e", margin: "4px 0 0 0" }}>
            Each recipe is prepared with fresh, premium Australian ingredients and baked to perfection.
          </p>
        </div>

        {/* Order Details Brief */}
        <table
          role="presentation"
          cellPadding="0"
          cellSpacing="0"
          border={0}
          width="100%"
          style={{
            border: "1px solid #ede3d7",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <tbody>
            <tr>
              <td>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#78716c", fontWeight: "bold", display: "block" }}>
                  Items Being Prepared
                </span>
                <div style={{ marginTop: "8px", fontSize: "13px", color: "#1c1410" }}>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((it, idx) => (
                      <div key={idx} style={{ padding: "4px 0", borderBottom: idx < order.items.length - 1 ? "1px solid #f5efe6" : "none" }}>
                        <strong>{it.quantity}x</strong> {it.name} {it.variant ? `(${it.variant})` : ""}
                      </div>
                    ))
                  ) : (
                    <div>Gourmet Bakery Items</div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* CTA Button */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
              padding: "14px 28px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Track Order Status &rarr;
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};
