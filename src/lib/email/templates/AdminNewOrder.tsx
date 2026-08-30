import React from "react";
import { BaseLayout } from "./BaseLayout";
import type { EmailOrderData } from "../types";

export const AdminNewOrder: React.FC<{ order: EmailOrderData }> = ({ order }) => {
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-AU", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  return (
    <BaseLayout
      previewText={`New Order #${order.orderNumber} received for $${order.totalAmount.toFixed(2)} AUD from ${order.customerName}`}
      badgeText="Admin Notification"
      badgeColor="#c69c40"
      badgeBg="#fbf5e6"
      title={`🛒 New Order Received (#${order.orderNumber})`}
      subtitle={`A new paid customer order has been placed on Flavour & Co. Online Store.`}
    >
      <div style={{ color: "#1c1410", fontSize: "14px", lineHeight: "1.6" }}>
        {/* Quick Summary Highlights */}
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
              <td style={{ verticalAlign: "top", width: "50%" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#78716c", fontWeight: "bold", display: "block" }}>
                  Customer Details
                </span>
                <strong style={{ fontSize: "14px", color: "#1c1410" }}>{order.customerName}</strong>
                <div style={{ fontSize: "12px", color: "#44403c", marginTop: "2px" }}>
                  <a href={`mailto:${order.customerEmail}`} style={{ color: "#6b1e30", textDecoration: "underline" }}>
                    {order.customerEmail}
                  </a>
                </div>
                {order.customerPhone && (
                  <div style={{ fontSize: "12px", color: "#78716c", marginTop: "2px" }}>
                    Phone: {order.customerPhone}
                  </div>
                )}
              </td>
              <td style={{ verticalAlign: "top", width: "50%", paddingLeft: "16px", borderLeft: "1px solid #ede3d7" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#78716c", fontWeight: "bold", display: "block" }}>
                  Order &amp; Payment Status
                </span>
                <div style={{ fontSize: "12px", color: "#1c1410", marginTop: "2px" }}>
                  Date: <strong>{formattedDate}</strong>
                </div>
                <div style={{ fontSize: "12px", color: "#1c1410", marginTop: "2px" }}>
                  Status: <span style={{ display: "inline-block", backgroundColor: "#e6f4ea", color: "#07402b", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", padding: "1px 6px", borderRadius: "3px" }}>PAID</span>
                </div>
                {order.squarePaymentId && (
                  <div style={{ fontSize: "11px", color: "#78716c", marginTop: "4px", fontFamily: "monospace" }}>
                    Square ID: {order.squarePaymentId}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Itemized Order Breakdown */}
        <h3
          style={{
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#6b1e30",
            margin: "0 0 12px 0",
            fontWeight: "bold",
          }}
        >
          Items to Fulfil
        </h3>

        <table
          role="presentation"
          cellPadding="0"
          cellSpacing="0"
          border={0}
          width="100%"
          style={{
            border: "1px solid #ede3d7",
            borderRadius: "6px",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#faf6f0", borderBottom: "1px solid #ede3d7" }}>
              <th align="left" style={{ padding: "10px 14px", fontSize: "11px", color: "#78716c", textTransform: "uppercase" }}>Product</th>
              <th align="center" style={{ padding: "10px 14px", fontSize: "11px", color: "#78716c", textTransform: "uppercase" }}>Qty</th>
              <th align="right" style={{ padding: "10px 14px", fontSize: "11px", color: "#78716c", textTransform: "uppercase" }}>Unit Price</th>
              <th align="right" style={{ padding: "10px 14px", fontSize: "11px", color: "#78716c", textTransform: "uppercase" }}>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => {
                const unitPrice = item.price ?? 0;
                const qty = item.quantity ?? 1;
                const lineTotal = (unitPrice * qty).toFixed(2);
                const variantText = item.variant || "";

                return (
                  <tr key={idx} style={{ borderBottom: idx < order.items.length - 1 ? "1px solid #f5efe6" : "none" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <strong style={{ color: "#1c1410", fontSize: "13px" }}>
                        {item.name}
                      </strong>
                      {variantText && variantText !== "Standard" && (
                        <div style={{ fontSize: "11px", color: "#78716c", marginTop: "2px" }}>
                          Variant: <em>{variantText}</em>
                        </div>
                      )}
                    </td>
                    <td align="center" style={{ padding: "12px 14px", fontSize: "13px", fontWeight: "bold", color: "#6b1e30" }}>
                      {qty}
                    </td>
                    <td align="right" style={{ padding: "12px 14px", fontSize: "12px", fontFamily: "monospace", color: "#57534e" }}>
                      ${unitPrice.toFixed(2)}
                    </td>
                    <td align="right" style={{ padding: "12px 14px", fontSize: "13px", fontWeight: "bold", fontFamily: "monospace", color: "#1c1410" }}>
                      ${lineTotal}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: "14px", textAlign: "center", color: "#78716c" }}>
                  Items recorded in database
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Financial Calculation */}
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
              <td style={{ padding: "4px 0", fontSize: "13px", color: "#57534e" }}>Subtotal:</td>
              <td align="right" style={{ padding: "4px 0", fontSize: "13px", fontFamily: "monospace", color: "#1c1410" }}>
                ${order.subtotal.toFixed(2)} AUD
              </td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", fontSize: "13px", color: "#57534e" }}>Shipping Fee:</td>
              <td align="right" style={{ padding: "4px 0", fontSize: "13px", fontFamily: "monospace", color: "#1c1410" }}>
                ${order.shippingFee.toFixed(2)} AUD
              </td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", fontSize: "11px", color: "#78716c" }}>GST Included:</td>
              <td align="right" style={{ padding: "4px 0", fontSize: "11px", fontFamily: "monospace", color: "#78716c" }}>
                ${order.taxAmount.toFixed(2)} AUD
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: "8px 0 0 0", borderTop: "1px solid #ede3d7" }} />
            </tr>
            <tr>
              <td style={{ padding: "4px 0", fontSize: "15px", fontWeight: "bold", color: "#07402b" }}>
                Total Paid Amount:
              </td>
              <td align="right" style={{ padding: "4px 0", fontSize: "17px", fontWeight: "bold", fontFamily: "monospace", color: "#07402b" }}>
                ${order.totalAmount.toFixed(2)} AUD
              </td>
            </tr>
          </tbody>
        </table>

        {/* Delivery Address & Customer Instructions */}
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
            marginBottom: "28px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ verticalAlign: "top", width: "50%" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b1e30", fontWeight: "bold" }}>
                  Delivery Destination
                </h4>
                <div style={{ fontSize: "13px", color: "#1c1410", lineHeight: "1.5" }}>
                  <strong>{order.customerName}</strong>
                  <br />
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                  {order.customerPhone && (
                    <div style={{ marginTop: "4px", color: "#78716c", fontSize: "12px" }}>
                      Phone: {order.customerPhone}
                    </div>
                  )}
                </div>
              </td>
              <td style={{ verticalAlign: "top", width: "50%", paddingLeft: "16px", borderLeft: "1px solid #ede3d7" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b1e30", fontWeight: "bold" }}>
                  Fulfilment &amp; Customer Notes
                </h4>
                <div style={{ fontSize: "12px", color: "#57534e", lineHeight: "1.5", fontStyle: "italic" }}>
                  {order.fulfillmentNotes || "No special instructions attached to this order."}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* View Order in Admin CTA */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <a
            href={order.adminOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: "#07402b",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "14px 28px",
              borderRadius: "6px",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(7, 64, 43, 0.25)",
            }}
          >
            Open Order in Admin Dashboard &rarr;
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};
