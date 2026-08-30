import React from "react";
import { BaseLayout } from "./BaseLayout";
import type { EmailOrderData } from "../types";

export const OrderDelivered: React.FC<{ order: EmailOrderData }> = ({ order }) => {
  const firstName = order.customerName ? order.customerName.split(" ")[0] : "there";

  return (
    <BaseLayout
      previewText={`Your Flavour & Co. order #${order.orderNumber} has been successfully delivered!`}
      badgeText="Delivered"
      badgeColor="#07402b"
      badgeBg="#e6f4ea"
      title={`Your Order Has Arrived, ${firstName}! 🎉`}
      subtitle={`Your fresh gourmet bakery package for order #${order.orderNumber} has been delivered.`}
    >
      <div style={{ color: "#1c1410", fontSize: "14px", lineHeight: "1.6" }}>
        {/* Celebration Callout */}
        <div
          style={{
            backgroundColor: "#e6f4ea",
            border: "1px solid #b7e1cd",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "6px" }}>🎉 🥧 ✨</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "bold", color: "#07402b" }}>
            Delivered Fresh &amp; Ready to Enjoy
          </div>
          <p style={{ fontSize: "12px", color: "#137333", margin: "4px 0 0 0" }}>
            We hope you love every bite of your handcrafted Indo-Australian gourmet pies!
          </p>
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
            <li>Bake for <strong>20 to 25 minutes</strong> (chilled) or <strong>35 to 40 minutes</strong> (frozen) until the pastry is deep golden brown and the filling is piping hot.</li>
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
            View Order &amp; Receipt &rarr;
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};
