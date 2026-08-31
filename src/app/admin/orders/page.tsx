"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Eye,
  X,
  CreditCard,
  Truck,
  User,
  CheckCircle,
  Clock,
  ExternalLink,
  PackageCheck,
  FileText,
  Download,
  Printer,
  Loader2,
} from "lucide-react";
import type { Order } from "@/lib/types";
import { useUIStore } from "@/store/ui.store";
import { BoneyardTableSkeleton } from "@/components/ui/BoneyardSkeleton";
import OrderReceiptModal from "@/components/orders/OrderReceiptModal";
import { notifyContentUpdated, subscribeToRealtimeUpdates } from "@/lib/realtime";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stagedStatus, setStagedStatus] = useState<Order["status"] | null>(null);
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setStagedStatus(order.status);
    setCourierName(order.courierName || "Australia Post Express");
    setTrackingNumber(order.trackingNumber || "");
    setEstimatedDelivery(order.estimatedDelivery || "");
  };

  const handleCloseOrder = () => {
    if (updatingOrderId) return;
    setSelectedOrder(null);
    setStagedStatus(null);
    setCourierName("");
    setTrackingNumber("");
    setEstimatedDelivery("");
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const unsubscribe = subscribeToRealtimeUpdates((type) => {
      if (type === "orders") {
        fetchOrders();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Order["status"]) => {
    if (updatingOrderId) return;
    setUpdatingOrderId(id);

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: newStatus,
          courierName: courierName.trim() || undefined,
          trackingNumber: trackingNumber.trim() || undefined,
          estimatedDelivery: estimatedDelivery.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                ...o,
                status: newStatus,
                courierName: courierName.trim() || o.courierName,
                trackingNumber: trackingNumber.trim() || o.trackingNumber,
                estimatedDelivery: estimatedDelivery.trim() || o.estimatedDelivery,
              }
              : o
          )
        );
        notifyContentUpdated("orders");
        handleCloseOrder();
        addToast(`Order status updated to ${newStatus}.`, "success");
      } else {
        const errorMsg = json.error || "Failed to update order status in database.";
        addToast(errorMsg, "error");
      }
    } catch (err: any) {
      addToast(err?.message || "Failed to update order status.", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search) ||
      o.customerName.toLowerCase().includes(search) ||
      o.customerEmail.toLowerCase().includes(search) ||
      (o.squarePaymentId && o.squarePaymentId.toLowerCase().includes(search));
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase">
            <CheckCircle className="w-2.5 h-2.5" /> Completed
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase">
            <Clock className="w-2.5 h-2.5" /> Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200/60 px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase">
            <Truck className="w-2.5 h-2.5" /> Shipped
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200/60 px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase">
            Pending
          </span>
        );
    }
  };

  const hasOrderFormChanges = Boolean(
    selectedOrder &&
    ((stagedStatus && stagedStatus !== selectedOrder.status) ||
      courierName.trim() !== (selectedOrder.courierName || "Australia Post Express").trim() ||
      trackingNumber.trim() !== (selectedOrder.trackingNumber || "").trim() ||
      estimatedDelivery.trim() !== (selectedOrder.estimatedDelivery || "").trim())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Fulfilment &amp; Transactions</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View customer purchases, Square payment details, delivery addresses, and status updates.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-3 rounded-sm border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search order #, customer, email, payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-sm py-1.5 pl-9 pr-3 text-xs text-slate-700 focus:outline-none focus:border-slate-900"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "processing", "shipped", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-sm text-[11px] font-semibold uppercase tracking-wider cursor-pointer transition-colors ${statusFilter === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-sm border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <BoneyardTableSkeleton rows={5} columns={7} />
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No orders found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Total Amount ($ AUD)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{o.customerName}</span>
                        <span className="text-[10px] text-slate-400">{o.customerEmail}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                        <CreditCard className="w-2.5 h-2.5 text-slate-500" />
                        {o.paymentMethod || "Square Credit Card"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ${o.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(o.status)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {/* VIEW ORDER BUTTON */}
                      <button
                        onClick={() => handleOpenOrder(o)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm border border-slate-200/80 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-slate-500" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* READ-ONLY ORDER DETAILS MODAL (FIXED BIGGER SHAPE & STABLE RECTANGLE) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="relative bg-white w-full max-w-4xl lg:max-w-5xl max-h-[88vh] sm:max-h-[85vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">

            {/* MINIMAL IN-MODAL RECTANGULAR LOADER OVERLAY */}
            {updatingOrderId && (
              <div className="absolute inset-0 z-50 bg-white/75 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white border border-slate-300 shadow-lg px-4 py-2.5 rounded-none flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 tracking-tight">Updating fulfilment...</span>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Order Details</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold uppercase rounded-sm">
                    PAID via Square
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900">{selectedOrder.orderNumber}</h2>
              </div>
              <button
                onClick={handleCloseOrder}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 text-xs text-slate-700 overscroll-contain" data-lenis-prevent>

              {/* Status Controls (Positioned on Top) */}
              <div className="p-3.5 bg-slate-100/80 border border-slate-200 rounded-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-900">UPDATE FULFILMENT STATUS</span>
                  <div className="flex flex-wrap gap-2">
                    {(["processing", "shipped", "completed", "cancelled"] as const).map((st) => {
                      const isSelected = (stagedStatus || selectedOrder.status) === st;
                      const isUpdating = updatingOrderId === selectedOrder.id;

                      return (
                        <button
                          key={st}
                          type="button"
                          disabled={isUpdating}
                          onClick={() => setStagedStatus(st)}
                          className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all cursor-pointer ${isSelected
                              ? "bg-slate-900 text-white shadow-xs"
                              : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                            } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking & Courier Fields (Shown when Shipped or Editing Tracking) */}
                {(stagedStatus === "shipped" || selectedOrder.status === "shipped" || trackingNumber) && (
                  <div className="pt-2.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-white p-3 rounded-sm border border-slate-200">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Carrier / Courier</label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g. Australia Post Express"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Tracking Number</label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. AP-EXP-9928172AU"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm font-mono focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Estimated Delivery</label>
                      <input
                        type="text"
                        value={estimatedDelivery}
                        onChange={(e) => setEstimatedDelivery(e.target.value)}
                        placeholder="e.g. Tomorrow by 2 PM"
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Top Row: Customer & Delivery Info + Square Payment Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Customer & Delivery Card */}
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold border-b border-slate-200/60 pb-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Customer &amp; Delivery Information</span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{selectedOrder.customerEmail}</p>
                    <p className="text-slate-600 font-mono text-[11px]">{selectedOrder.customerPhone || "+61 400 000 000"}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">SHIPPING ADDRESS</span>
                    <p className="font-semibold text-slate-800 leading-relaxed">
                      {typeof selectedOrder.shippingAddress === "object" && selectedOrder.shippingAddress
                        ? `${selectedOrder.shippingAddress.street || ""}, ${selectedOrder.shippingAddress.city || ""}, ${selectedOrder.shippingAddress.state || ""} ${selectedOrder.shippingAddress.postalCode || ""}, ${selectedOrder.shippingAddress.country || "Australia"}`
                        : String(selectedOrder.shippingAddress || "124 George Street, Sydney NSW 2000, Australia")}
                    </p>
                    <span className="text-[10px] font-bold text-slate-500 block pt-1">
                      Method: <span className="text-slate-900">{selectedOrder.shippingMethod || "Standard Express Delivery"}</span>
                    </span>
                  </div>

                  {/* Dedicated Delivery Instructions Callout Box */}
                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Delivery Instructions / Doorstep Note</span>
                    </div>
                    <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-sm text-xs text-amber-950 font-medium leading-relaxed">
                      {(() => {
                        const notes =
                          (typeof selectedOrder.shippingAddress === "object" && selectedOrder.shippingAddress?.notes) ||
                          selectedOrder.fulfillmentNotes ||
                          "";
                        const isSystemPlaceholder =
                          notes.toLowerCase().includes("paid & confirmed via") ||
                          notes.toLowerCase().includes("order pending payment") ||
                          notes.toLowerCase().includes("order fulfilled successfully");
                        return notes && !isSystemPlaceholder ? (
                          <p className="font-semibold text-slate-900 break-words">"{notes}"</p>
                        ) : (
                          <p className="text-slate-400 italic text-[11px]">No special delivery instructions provided for this order.</p>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Square Payment Gateway Card */}
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                      <CreditCard className="w-4 h-4 text-slate-500" />
                      <span>Square Payment Details</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm">
                      {selectedOrder.paymentStatus || "PAID"}
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">PAYMENT METHOD</span>
                      <span className="font-semibold text-slate-900 font-sans">{selectedOrder.paymentMethod || "Square Credit Card"}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">SQUARE PAYMENT ID</span>
                      <span className="bg-white px-2 py-1 rounded border border-slate-200 block text-slate-800 truncate">
                        {selectedOrder.squarePaymentId || `sq_pay_${selectedOrder.orderNumber.toLowerCase()}`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">TRANSACTION ID</span>
                      <span className="bg-white px-2 py-1 rounded border border-slate-200 block text-slate-800 truncate">
                        {selectedOrder.squareTransactionId || `sq_tx_${selectedOrder.orderNumber.toLowerCase()}`}
                      </span>
                    </div>

                    {selectedOrder.squareReceiptUrl && (
                      <div className="pt-1 font-sans">
                        <a
                          href={selectedOrder.squareReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-900 font-bold hover:underline"
                        >
                          View Square Digital Receipt <ExternalLink className="w-3 h-3 text-amber-600" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Itemized Order Breakdown Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Order Items Breakdown</h4>

                <div className="border border-slate-200 rounded-sm overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3">Variant</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item: any, idx: number) => {
                          const itemPrice = typeof item.price === "number" ? item.price : (typeof item.unitPrice === "number" ? item.unitPrice : 0);
                          const itemQty = item.quantity || 1;
                          const lineTotal = itemPrice * itemQty;
                          const variantLabel = item.variant || item.variantName || "Standard Pack";
                          const itemImg = item.image || item.product?.image || item.product?.images?.[0];

                          return (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  {itemImg ? (
                                    <div className="relative w-8 h-8 rounded-sm overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                      <Image src={itemImg} alt={item.name || "Pie"} fill className="object-cover" sizes="32px" />
                                    </div>
                                  ) : (
                                    <PackageCheck className="w-5 h-5 text-slate-400" />
                                  )}
                                  <span className="font-semibold text-slate-900">{item.name || item.product?.name || "Gourmet Pie"}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 font-medium">{variantLabel}</td>
                              <td className="py-2.5 px-3 text-right font-mono">${itemPrice.toFixed(2)}</td>
                              <td className="py-2.5 px-3 text-center font-bold">{itemQty}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                                ${lineTotal.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-3 px-3 text-center text-slate-400">Standard Bakery Order Package</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary Calculation Card */}
              <div className="bg-slate-50 p-4 rounded-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">ORDER STATUS &amp; CARE</span>
                  <p className="text-slate-700 text-xs italic">
                    Current Status: <strong className="text-slate-900 uppercase font-sans">{selectedOrder.status}</strong>
                  </p>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-200/80 sm:pl-4 pt-3 sm:pt-0 shrink-0 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal:</span>
                    <span className="font-mono">${(selectedOrder.subtotal || selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee:</span>
                    <span className="font-mono">${(selectedOrder.shippingFee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (Includes 10%):</span>
                    <span className="font-mono">${(selectedOrder.taxAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold pt-1.5 border-t border-slate-200 text-sm">
                    <span>Total Paid:</span>
                    <span className="font-mono">${selectedOrder.totalAmount.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setReceiptOrder(selectedOrder)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs rounded-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-[#6b1e30]" />
                <span>Download Receipt</span>
              </button>

              <div className="flex items-center gap-2">
                {hasOrderFormChanges && (
                  <button
                    type="button"
                    disabled={Boolean(updatingOrderId)}
                    onClick={() => handleUpdateStatus(selectedOrder.id, stagedStatus || selectedOrder.status)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {updatingOrderId === selectedOrder.id && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    )}
                    <span>{updatingOrderId === selectedOrder.id ? "Saving..." : "Save Changes"}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCloseOrder}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-sm transition-colors cursor-pointer border border-slate-300"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      <OrderReceiptModal
        order={receiptOrder}
        isOpen={Boolean(receiptOrder)}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}

