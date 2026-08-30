import React from "react";
import { BaseLayout } from "./BaseLayout";
import type { EmailOrderData } from "../types";

export const OrderShipped: React.FC<{ order: EmailOrderData }> = ({ order }) => {
  const firstName = order.customerName ? order.customerName.split(" ")[0] : "there";
  const hasTracking = Boolean(order.trackingNumber || order.trackingUrl);

  return (
    <BaseLayout
      previewText={`Your Flavour & Co. order #${order.orderNumber} is on its way to you!`}
      badgeText="Dispatched &amp; On Its Way"
      badgeColor="#0284c7"
      badgeBg="#f0f9ff"
      title={`Your Pies Are On The Way, ${firstName}! 🚚`}
      subtitle={`Great news! Your order #${order.orderNumber} has been dispatched and is en route to your delivery address.`}
    >
      <div style={{ color: "#1c1410", fontSize: "14px", lineHeight: "1.6" }}>
        {/* Shipping Status Callout */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "6px" }}>🚚 🥧</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "bold", color: "#0369a1" }}>
            Express Refrigerated Transport
          </div>
          <p style={{ fontSize: "12px", color: "#0c4a6e", margin: "4px 0 0 0" }}>
            Your order is packaged in temperature-controlled insulated packaging to ensure maximum freshness upon arrival.
          </p>
        </div>

        {/* Tracking Information if available */}
        {hasTracking && (
          <table
            role="presentation"
            cellPadding="0"
            cellSpacing="0"
            border={0}
            width="100%"
            style={{
              backgroundColor: "#faf6f0",
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
                    Courier / Tracking Details
                  </span>
                  {order.courierName && (
                    <div style={{ fontSize: "13px", color: "#1c1410", marginTop: "4px" }}>
                      Carrier: <strong>{order.courierName}</strong>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <div style={{ fontSize: "13px", color: "#1c1410", marginTop: "4px", fontFamily: "monospace" }}>
                      Tracking Number: <strong>{order.trackingNumber}</strong>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div style={{ fontSize: "12px", color: "#57534e", marginTop: "4px" }}>
                      Estimated Delivery: {order.estimatedDelivery}
                    </div>
                  )}
                  {order.trackingUrl && (
                    <div style={{ marginTop: "10px" }}>
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#6b1e30", fontWeight: "bold", textDecoration: "underline", fontSize: "12px" }}
                      >
                        Click here to track your package live &rarr;
                      </a>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Delivery Address Summary */}
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
                  Delivery Destination
                </span>
                <div style={{ fontSize: "13px", color: "#1c1410", marginTop: "6px", lineHeight: "1.5" }}>
                  <strong>{order.customerName}</strong>
                  <br />
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
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
            View Order &amp; Delivery Progress &rarr;
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};
