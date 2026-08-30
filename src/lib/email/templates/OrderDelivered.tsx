import React from "react";
import { BaseLayout } from "./BaseLayout";
import type { EmailOrderData } from "../types";

export const OrderDelivered: React.FC<{ order: EmailOrderData }> = ({ order }) => {
  const firstName = order.customerName ? order.customerName.split(" ")[0] : "there";

  return (
    <BaseLayout
      previewText={`A big thank you for your Flavour & Co. order #${order.orderNumber}! Please rate your pies ⭐`}
      badgeText="Order Completed"
      badgeColor="#07402b"
      badgeBg="#e6f4ea"
      title={`A Big Thank You, ${firstName}! 🎉`}
      subtitle={`Your order #${order.orderNumber} has been fulfilled and completed.`}
    >
      <div style={{ color: "#1c1410", fontSize: "14px", lineHeight: "1.6" }}>
        {/* Celebration & Big Thank You Callout */}
        <div
          style={{
            backgroundColor: "#faf6f0",
            border: "1px solid #ede3d7",
            borderRadius: "6px",
            padding: "20px 16px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🥧 ✨ ⭐</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: "bold", color: "#6b1e30" }}>
            Thank You for Supporting Flavour &amp; Co.!
          </div>
          <p style={{ fontSize: "13px", color: "#57534e", margin: "6px 0 0 0", lineHeight: "1.5" }}>
            We hope every bite of your handcrafted Indo-Australian gourmet pies brought rich flavours and joy to your table.
          </p>
        </div>

        {/* Rate & Review Products Section */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ede3d7",
            borderRadius: "6px",
            padding: "20px 16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#c69c40",
                fontWeight: "bold",
                display: "block",
              }}
            >
              Customer Feedback
            </span>
            <h3
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "17px",
                fontWeight: "bold",
                color: "#1c1410",
                margin: "4px 0",
              }}
            >
              How Were Your Gourmet Pies?
            </h3>
            <p style={{ fontSize: "12px", color: "#78716c", margin: 0, lineHeight: "1.4" }}>
              Your feedback means the world to our bakery! Click below to leave your rating:
            </p>
          </div>

          {/* Itemized Fluid Product Review Cards */}
          <div style={{ marginTop: "12px" }}>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => {
                const targetUrl = item.productUrl || `${order.viewOrderUrl}#reviews`;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#faf6f0",
                      border: "1px solid #ede3d7",
                      borderRadius: "6px",
                      padding: "14px",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1c1410", lineHeight: "1.3" }}>
                      {item.name}
                    </div>
                    {item.variant && (
                      <div style={{ fontSize: "12px", color: "#78716c", marginTop: "3px", marginBottom: "10px" }}>
                        Variant: {item.variant} &bull; Qty: {item.quantity}
                      </div>
                    )}
                    <div style={{ marginTop: item.variant ? "0px" : "10px" }}>
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          backgroundColor: "#c69c40",
                          color: "#ffffff",
                          fontSize: "12px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "10px 18px",
                          borderRadius: "4px",
                          textDecoration: "none",
                        }}
                      >
                        Rate This Pie ⭐ &rarr;
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <a
                  href={order.viewOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    backgroundColor: "#c69c40",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    padding: "12px 24px",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  Rate Your Items in Profile ⭐ &rarr;
                </a>
              </div>
            )}
          </div>

          {/* Minimal Instruction Note */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              backgroundColor: "#fdf8f3",
              border: "1px dashed #d5b895",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#6b1e30", fontWeight: "600", lineHeight: "1.4" }}>
              💡 <strong>Note:</strong> Click your pie link above and scroll down to the <em>Customer Reviews</em> section at the bottom of the page to leave your rating.
            </p>
          </div>
        </div>

        {/* Reheating Guidelines */}
        <div
          style={{
            backgroundColor: "#faf6f0",
            border: "1px solid #ede3d7",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b1e30", fontWeight: "bold" }}>
            Chef&apos;s Reheating Guide for the Perfect Crust
          </h4>
          <ol style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#44403c", lineHeight: "1.6" }}>
            <li>Preheat your fan-forced oven to <strong>180&deg;C (350&deg;F)</strong>.</li>
            <li>Place pies on a baking tray lined with baking paper.</li>
            <li>Bake for <strong>20 to 25 minutes</strong> (chilled) or <strong>35 to 40 minutes</strong> (frozen) until deep golden brown and piping hot.</li>
            <li>Allow to rest for 3 minutes before serving to let the rich gravy settle.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <a
            href={order.viewOrderUrl}
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
            }}
          >
            View Orders in Profile &rarr;
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};


