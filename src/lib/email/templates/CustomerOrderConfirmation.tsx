import React from "react";
import { BaseLayout } from "./BaseLayout";
import type { EmailOrderData } from "../types";

export const CustomerOrderConfirmation: React.FC<{ order: EmailOrderData }> = ({ order }) => {
  const firstName = order.customerName ? order.customerName.split(" ")[0] : "there";
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently placed";

  return (
    <BaseLayout
      previewText={`Order #${order.orderNumber} confirmed! Thank you for ordering from Flavour & Co.`}
      badgeText="Order Confirmed"
      badgeColor="#07402b"
      badgeBg="#e6f4ea"
      title={`Thank You For Your Order, ${firstName}!`}
      subtitle={`We've received your order #${order.orderNumber} and payment has been processed successfully.`}
    >
      <div style={{ color: "#1c1410", fontSize: "14px", lineHeight: "1.6" }}>
        {/* Order Meta Bar */}
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
            padding: "12px 16px",
            marginBottom: "24px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ verticalAlign: "middle" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#78716c", fontWeight: "bold", display: "block" }}>
                  Order Number
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "bold", color: "#6b1e30" }}>
                  {order.orderNumber}
                </span>
              </td>
              <td align="right" style={{ verticalAlign: "middle" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#78716c", fontWeight: "bold", display: "block" }}>
                  Order Date
                </span>
                <span style={{ fontSize: "12px", color: "#44403c" }}>
                  {formattedDate}
                </span>
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
          Order Summary
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
              <th align="left" style={{ padding: "10px 14px", fontSize: "11px", color: "#78716c", textTransform: "uppercase" }}>Item</th>
              <th align="center" style={{ padding: "10px 14px", fontSize: "11px", color: "#78716c", textTransform: "uppercase" }}>Qty</th>
              <th align="right" style={{ padding: "10px 14px", fontSize: "11px", color: "#78716c", textTransform: "uppercase" }}>Total</th>
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
                      <div style={{ fontWeight: "600", color: "#1c1410", fontSize: "13px" }}>
                        {item.name}
                      </div>
                      {variantText && variantText !== "Standard" && (
                        <div style={{ fontSize: "11px", color: "#78716c", marginTop: "2px" }}>
                          Variant: {variantText}
                        </div>
                      )}
                      <div style={{ fontSize: "11px", color: "#a8a29e", marginTop: "2px" }}>
                        ${unitPrice.toFixed(2)} each
                      </div>
                    </td>
                    <td align="center" style={{ padding: "12px 14px", fontSize: "13px", fontWeight: "bold", color: "#44403c" }}>
                      {qty}
                    </td>
                    <td align="right" style={{ padding: "12px 14px", fontSize: "13px", fontWeight: "bold", fontFamily: "monospace", color: "#1c1410" }}>
                      ${lineTotal}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: "14px", textAlign: "center", color: "#78716c" }}>
                  Gourmet Bakery Items
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Financial Totals Breakdown */}
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
              <td style={{ padding: "4px 0", fontSize: "13px", color: "#57534e" }}>Express Delivery:</td>
              <td align="right" style={{ padding: "4px 0", fontSize: "13px", fontFamily: "monospace", color: "#1c1410" }}>
                {order.shippingFee === 0 ? "FREE" : `$${order.shippingFee.toFixed(2)} AUD`}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", fontSize: "11px", color: "#78716c" }}>GST Included (10%):</td>
              <td align="right" style={{ padding: "4px 0", fontSize: "11px", fontFamily: "monospace", color: "#78716c" }}>
                ${order.taxAmount.toFixed(2)} AUD
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ padding: "8px 0 0 0", borderTop: "1px solid #ede3d7" }} />
            </tr>
            <tr>
              <td style={{ padding: "4px 0", fontSize: "15px", fontWeight: "bold", color: "#6b1e30" }}>
                Total Paid:
              </td>
              <td align="right" style={{ padding: "4px 0", fontSize: "17px", fontWeight: "bold", fontFamily: "monospace", color: "#6b1e30" }}>
                ${order.totalAmount.toFixed(2)} AUD
              </td>
            </tr>
          </tbody>
        </table>

        {/* Shipping Address & Delivery Details */}
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
              <td style={{ verticalAlign: "top" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#07402b", fontWeight: "bold" }}>
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
              <td style={{ verticalAlign: "top", width: "40%", borderLeft: "1px solid #ede3d7", paddingLeft: "16px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#07402b", fontWeight: "bold" }}>
                  Payment Method
                </h4>
                <div style={{ fontSize: "13px", color: "#1c1410", lineHeight: "1.5" }}>
                  {order.paymentMethod || "Square Online Payment"}
                  <div style={{ marginTop: "6px" }}>
                    <span style={{ display: "inline-block", backgroundColor: "#e6f4ea", color: "#07402b", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", padding: "2px 6px", borderRadius: "3px" }}>
                      Status: Paid
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Call to Action Button */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
              boxShadow: "0 2px 8px rgba(107, 30, 48, 0.25)",
            }}
          >
            View Your Order Details &rarr;
          </a>
        </div>

        {/* Storage & Reheating Instructions Note */}
        <div
          style={{
            backgroundColor: "#f7efe6",
            borderLeft: "4px solid #E3A72B",
            padding: "12px 16px",
            borderRadius: "0 6px 6px 0",
            fontSize: "12px",
            color: "#57534e",
            lineHeight: "1.5",
          }}
        >
          <strong style={{ color: "#1c1410" }}>Storage &amp; Reheating Tip:</strong> Keep your gourmet pies chilled upon arrival. Preheat oven to 180&deg;C and heat for 20&ndash;25 minutes until golden and piping hot for the ultimate flaky bakery experience!
        </div>
      </div>
    </BaseLayout>
  );
};
