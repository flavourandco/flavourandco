"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function ToastContainer() {
  const pathname = usePathname();
  const isAdmin = Boolean(pathname && pathname.startsWith("/admin"));

  // Admin Dashboard Toast Options (Sharp edges, no borders, Geist Sans font, solid white & dark slate)
  const adminToastOptions = {
    duration: 4000,
    style: {
      fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "#0f172a",
      color: "#ffffff",
      borderRadius: "2px",
      border: "none",
      padding: "12px 18px",
      fontSize: "13px",
      fontWeight: 600,
      boxShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.15)",
    },
    success: {
      iconTheme: {
        primary: "#0f172a",
        secondary: "#ffffff",
      },
      style: {
        fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#ffffff",
        color: "#0f172a",
        borderRadius: "2px",
        border: "none",
        padding: "12px 18px",
        fontSize: "13px",
        fontWeight: 700,
        boxShadow: "0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)",
      },
    },
    error: {
      iconTheme: {
        primary: "#ffffff",
        secondary: "#0f172a",
      },
      style: {
        fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#0f172a",
        color: "#ffffff",
        borderRadius: "2px",
        border: "none",
        padding: "12px 18px",
        fontSize: "13px",
        fontWeight: 700,
        boxShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.15)",
      },
    },
  };

  // Main Store Toast Options (Sharp edges, no borders, solid gourmet brand green/gold/burgundy background)
  const storeToastOptions = {
    duration: 4000,
    style: {
      background: "#07402b",
      color: "#ffffff",
      borderRadius: "2px",
      border: "none",
      padding: "12px 20px",
      fontSize: "13px",
      fontWeight: 600,
      letterSpacing: "0.025em",
      boxShadow: "0 12px 30px -5px rgba(7, 64, 43, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
    },
    success: {
      iconTheme: {
        primary: "#c69c40",
        secondary: "#07402b",
      },
      style: {
        background: "#07402b",
        color: "#ffffff",
        border: "none",
      },
    },
    error: {
      iconTheme: {
        primary: "#f59e0b",
        secondary: "#ffffff",
      },
      style: {
        background: "#6b1e30",
        color: "#ffffff",
        border: "none",
      },
    },
  };

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 24,
        right: 24,
        zIndex: 999999,
      }}
      toastOptions={isAdmin ? adminToastOptions : storeToastOptions}
    />
  );
}
