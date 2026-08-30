"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Download,
  X,
  CheckCircle,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  FileText,
} from "lucide-react";
import type { Order } from "@/lib/types";

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderReceiptModal({
  order,
  isOpen,
  onClose,
}: OrderReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !order || !mounted) return null;

  const handlePrint = () => {
    window.print();
  };

  // Safe formatting helpers
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const subtotal =
    typeof order.subtotal === "number"
      ? order.subtotal
      : Array.isArray(order.items)
      ? order.items.reduce((acc, it: any) => {
          const price =
            typeof it.price === "number"
              ? it.price
              : typeof it.unitPrice === "number"
              ? it.unitPrice
              : 0;
          const qty = it.quantity || 1;
          return acc + price * qty;
        }, 0)
      : order.totalAmount;

  const shippingFee = order.shippingFee ?? 0;
  const totalAmount = order.totalAmount ?? subtotal + shippingFee;
  // Australian GST is 10% included in total price (total / 11)
  const gstAmount = order.taxAmount ?? (totalAmount * 10) / 110;

  const shippingAddressString =
    typeof order.shippingAddress === "object" && order.shippingAddress
      ? [
          order.shippingAddress.street,
          order.shippingAddress.city,
          order.shippingAddress.state,
          order.shippingAddress.postalCode,
          order.shippingAddress.country || "Australia",
        ]
          .filter(Boolean)
          .join(", ")
      : String(order.shippingAddress || "Sydney, NSW, Australia");

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-5xl xl:max-w-6xl w-[95vw] h-[88vh] sm:h-[88vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
        {/* TOP HEADER TOOLBAR (Hidden during print) */}
        <div className="no-print px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-200 flex items-center justify-between gap-2 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[8.5px] sm:text-[9.5px] font-bold uppercase rounded-sm whitespace-nowrap shrink-0">
              Tax Invoice &amp; Receipt
            </span>
            <h2 className="text-[11px] sm:text-sm font-bold text-slate-900 font-mono whitespace-nowrap">
              {order.orderNumber}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* PRINTABLE RECEIPT CONTAINER */}
        <div
          ref={receiptRef}
          id="printable-receipt"
          className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 md:p-10 bg-white text-stone-900 font-sans space-y-6 overscroll-contain select-text"
          data-lenis-prevent
        >
          {/* RECEIPT HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 pb-5 border-b-2 border-stone-800">
            {/* Brand Information */}
            <div className="space-y-1.5">
              <div className="min-w-0">
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[#07402b] tracking-tight leading-none whitespace-nowrap">
                  FLAVOUR &amp; CO.
                </h1>
                <p className="text-[10px] sm:text-[11px] font-serif italic text-[#6b1e30] font-semibold mt-0.5 whitespace-nowrap">
                  Handcrafted Gourmet Indo-Australian Pies
                </p>
              </div>

              <div className="text-[10px] sm:text-[11px] text-stone-600 space-y-0.5 pt-1 leading-relaxed">
                <p className="font-semibold text-stone-800 whitespace-nowrap">Flavour &amp; Co. Pty Ltd</p>
                <p className="whitespace-nowrap">Sydney, New South Wales, Australia</p>
                <p className="whitespace-nowrap">
                  <span className="font-semibold">ABN:</span> 84 629 104 883
                </p>
                <p className="whitespace-nowrap">
                  <span className="font-semibold">Email:</span> help@flavourandco.com.au
                </p>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="sm:text-right space-y-1.5 bg-[#faf6f0] sm:bg-transparent p-3 sm:p-0 rounded-md border sm:border-0 border-stone-200">
              <div className="inline-block sm:block">
                <span className="bg-[#07402b] text-[#E3A72B] font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded whitespace-nowrap">
                  TAX INVOICE &amp; RECEIPT
                </span>
              </div>

              <div className="space-y-1 text-xs text-stone-700 pt-1">
                <p className="flex items-center justify-between sm:justify-end gap-2 whitespace-nowrap">
                  <span className="text-stone-500 font-semibold">Receipt No:</span>
                  <span className="font-mono font-bold text-stone-900">
                    REC-{order.orderNumber}
                  </span>
                </p>
                <p className="flex items-center justify-between sm:justify-end gap-2 whitespace-nowrap">
                  <span className="text-stone-500 font-semibold">Order Ref:</span>
                  <span className="font-mono font-semibold text-stone-800">
                    #{order.orderNumber}
                  </span>
                </p>
                <p className="flex items-center justify-between sm:justify-end gap-2 whitespace-nowrap">
                  <span className="text-stone-500 font-semibold">Date:</span>
                  <span className="font-mono text-stone-800">{formattedDate}</span>
                </p>
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider whitespace-nowrap">
                    <CheckCircle className="w-3 h-3 shrink-0" />
                    PAID IN FULL (AUD)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOMER & PAYMENT DETAILS (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-1">
            {/* Bill / Ship To */}
            <div className="bg-[#faf6f0] p-3.5 sm:p-4 rounded-md border border-stone-200/80 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-[#07402b] font-bold pb-1.5 border-b border-stone-200">
                <MapPin className="w-3.5 h-3.5 text-[#6b1e30] shrink-0" />
                <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">Billed &amp; Delivered To</span>
              </div>
              <p className="font-bold text-stone-900 text-sm pt-1">{order.customerName}</p>
              <p className="text-stone-600 break-all">{order.customerEmail}</p>
              {order.customerPhone && (
                <p className="text-stone-600 font-mono text-[11px] whitespace-nowrap">Tel: {order.customerPhone}</p>
              )}
              <p className="text-stone-700 font-medium pt-1 leading-relaxed">
                {shippingAddressString}
              </p>
            </div>

            {/* Payment & Fulfillment Summary */}
            <div className="bg-[#faf6f0] p-3.5 sm:p-4 rounded-md border border-stone-200/80 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-[#07402b] font-bold pb-1.5 border-b border-stone-200">
                <CreditCard className="w-3.5 h-3.5 text-[#6b1e30] shrink-0" />
                <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">Payment &amp; Dispatch</span>
              </div>
              <div className="space-y-1 pt-1">
                <p className="flex items-center justify-between gap-2 whitespace-nowrap">
                  <span className="text-stone-500">Payment Gateway:</span>
                  <span className="font-medium text-stone-900">{order.paymentMethod || "Square Online Payment"}</span>
                </p>
                <p className="flex items-center justify-between gap-2 whitespace-nowrap">
                  <span className="text-stone-500">Transaction ID:</span>
                  <span className="font-mono text-[11px] text-stone-800 truncate max-w-[150px] sm:max-w-none">
                    {order.squarePaymentId || order.squareTransactionId || `SQ-${order.orderNumber}`}
                  </span>
                </p>
                <p className="flex items-center justify-between gap-2 whitespace-nowrap">
                  <span className="text-stone-500">Delivery Service:</span>
                  <span className="font-medium text-stone-900">{order.shippingMethod || "Sydney Express Delivery"}</span>
                </p>
                <p className="flex items-center justify-between gap-2 whitespace-nowrap">
                  <span className="text-stone-500">Status:</span>
                  <span className="font-bold text-emerald-800">Confirmed / Paid</span>
                </p>
              </div>
            </div>
          </div>

          {/* ITEMIZED TABLE */}
          <div className="space-y-2">
            <div className="overflow-x-auto rounded-md border border-stone-300">
              <table className="w-full text-left text-xs border-collapse min-w-[480px]">
                <thead>
                  <tr className="bg-[#07402b] text-white font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-4">Item &amp; Description</th>
                    <th className="py-2.5 px-3">Variant / Option</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center w-14">Qty</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item: any, idx: number) => {
                      const itemPrice =
                        typeof item.price === "number"
                          ? item.price
                          : typeof item.unitPrice === "number"
                          ? item.unitPrice
                          : 0;
                      const itemQty = item.quantity || 1;
                      const lineTotal = itemPrice * itemQty;
                      const variantLabel =
                        item.variantName || item.variant || "Standard";

                      return (
                        <tr key={idx} className="hover:bg-stone-50/80">
                          <td className="py-2.5 px-3 text-center text-stone-400 font-mono text-[11px] whitespace-nowrap">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="font-serif font-bold text-stone-900 text-sm block">
                              {item.name || item.product?.name || "Gourmet Pie"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600 font-medium whitespace-nowrap">
                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
                              {variantLabel}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-stone-700 whitespace-nowrap">
                            A${itemPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold font-mono text-stone-900 whitespace-nowrap">
                            {itemQty}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-stone-900 whitespace-nowrap">
                            A${lineTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 px-4 text-center text-stone-500">
                        Order item details recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PRICE BREAKDOWN & TOTALS */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1 items-start">
            {/* Notes & Special Instructions */}
            <div className="sm:col-span-6 space-y-2.5">
              {order.fulfillmentNotes ? (
                <div className="bg-[#faf6f0] p-3.5 rounded-md border border-stone-200 text-xs space-y-1">
                  <span className="font-bold text-[#07402b] text-[11px] uppercase tracking-wider block whitespace-nowrap">
                    Special Delivery Instructions
                  </span>
                  <p className="text-stone-700 italic">{order.fulfillmentNotes}</p>
                </div>
              ) : (
                <div className="bg-[#faf6f0] p-3.5 rounded-md border border-stone-200 text-xs space-y-1 text-stone-600">
                  <span className="font-bold text-[#07402b] text-[11px] uppercase tracking-wider block whitespace-nowrap">
                    Gourmet Care &amp; Handling
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    Freshly baked artisanal pies. Please refrigerate below 4°C upon arrival. Reheat in a preheated oven at 180°C for 15–20 minutes for the crispiest crust.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-500 pt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="whitespace-nowrap">Digitally verified payment receipt via Flavour &amp; Co.</span>
              </div>
            </div>

            {/* Financial Totals Box */}
            <div className="sm:col-span-6 bg-[#faf6f0] p-4 rounded-md border border-stone-300 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-700 whitespace-nowrap">
                <span className="font-medium">Items Subtotal</span>
                <span className="font-mono font-bold">A${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-stone-700 whitespace-nowrap">
                <span className="font-medium">Express Courier Shipping</span>
                <span className="font-mono font-bold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                      FREE
                    </span>
                  ) : (
                    `A$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-500 text-[11px] pt-1 border-t border-stone-200 whitespace-nowrap">
                <span>Includes GST (10% Tax)</span>
                <span className="font-mono">A${gstAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t-2 border-[#07402b] whitespace-nowrap">
                <span className="font-serif font-extrabold uppercase tracking-wider text-stone-900 text-sm">
                  Total Paid:
                </span>
                <span className="font-mono text-lg sm:text-xl font-black text-[#6b1e30]">
                  A${totalAmount.toFixed(2)} AUD
                </span>
              </div>
            </div>
          </div>

          {/* OFFICIAL RECEIPT FOOTER */}
          <div className="pt-5 border-t-2 border-stone-200 text-center space-y-1.5">
            <p className="font-serif font-bold text-stone-800 text-sm">
              Thank you for ordering with Flavour &amp; Co.!
            </p>
            <p className="text-[11px] text-stone-500 max-w-md mx-auto leading-relaxed">
              If you have any questions regarding this tax invoice, please contact{" "}
              <a
                href="mailto:help@flavourandco.com.au"
                className="text-[#07402b] underline font-semibold"
              >
                help@flavourandco.com.au
              </a>
              .
            </p>
            <p className="text-[10px] text-stone-400 font-mono pt-1">
              Flavour &amp; Co. Pty Ltd • ABN 84 629 104 883 • Generated on {formattedDate}
            </p>
          </div>
        </div>

        {/* BOTTOM ACTION MODAL FOOTER (Hidden during print) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#07402b] hover:bg-[#6b1e30] text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#E3A72B]" />
            <span>Download Invoice / Print</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
