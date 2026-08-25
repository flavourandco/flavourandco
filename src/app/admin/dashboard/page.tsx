"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Star,
  Users,
  Plus,
  FileText,
  ChevronRight,
  FileSpreadsheet,
  Mail,
  Truck,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BoneyardStatCardSkeleton, BoneyardTableSkeleton } from "@/components/ui/BoneyardSkeleton";
import { dispatchSettingsUpdated } from "@/hooks/useFreeDeliveryThreshold";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    salesTotal: number;
    productsCount: number;
    todaysUsers: number;
    reviewsCount: number;
    wholesaleInquiriesCount: number;
    contactCount: number;
    recentOrders: any[];
  } | null>(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [realUsers, setRealUsers] = useState<any[]>([]);

  // Free delivery threshold state
  const [freeDeliveryAmount, setFreeDeliveryAmount] = useState<number | string>(200);
  const [savingThreshold, setSavingThreshold] = useState(false);
  const [thresholdMsg, setThresholdMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && typeof data.freeDeliveryThreshold === "number") {
          setFreeDeliveryAmount(data.freeDeliveryThreshold);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    loadSettings();
  }, []);

  const handleUpdateFreeDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingThreshold(true);
    setThresholdMsg(null);
    const numericAmount = Math.max(0, Number(freeDeliveryAmount) || 0);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freeDeliveryThreshold: numericAmount }),
      });
      const data = await res.json();
      if (data.success) {
        setFreeDeliveryAmount(numericAmount);
        dispatchSettingsUpdated(numericAmount);
        setThresholdMsg(`Free delivery threshold updated to $${numericAmount} AUD!`);
        setTimeout(() => setThresholdMsg(null), 5000);
      } else {
        alert(data.error || "Failed to update free delivery amount");
      }
    } catch (err: any) {
      alert("Error updating free delivery amount: " + err.message);
    } finally {
      setSavingThreshold(false);
    }
  };

  useEffect(() => {
    async function loadDashboardData() {
      setLoadingStats(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("/api/dashboard/stats", { cache: "no-store" }),
          fetch("/api/admin/users", { cache: "no-store" }),
        ]);

        const statsJson = await statsRes.json();
        if (statsJson.success) {
          setStats(statsJson.data);
        }

        const usersJson = await usersRes.json();
        if (usersJson.success && Array.isArray(usersJson.users)) {
          setRealUsers(usersJson.users);
        }
      } catch (err) {
        console.error("Dashboard failed to load stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time bakery product sales, order fulfilment, and database metrics.
          </p>
        </div>

        {/* QUICK ACTIONS BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => router.push("/admin/products")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors shadow-2xs cursor-pointer border border-slate-800"
          >
            <span>Manage Products</span>
          </button>

          <button
            onClick={() => router.push("/admin/blogs")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-sm transition-colors shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage Blogs</span>
          </button>
        </div>
      </div>

      {/* FREE DELIVERY THRESHOLD MANAGEMENT PANEL */}
      <div className="bg-white rounded-md p-5 border border-slate-200/90 shadow-2xs">
        <form onSubmit={handleUpdateFreeDelivery} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Free Delivery Minimum Order Amount
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set the minimum order amount ($ AUD) for site-wide free delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">$</span>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={freeDeliveryAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setFreeDeliveryAmount("");
                    return;
                  }
                  const num = Math.max(0, Number(val));
                  setFreeDeliveryAmount(num);
                }}
                onBlur={() => {
                  if (freeDeliveryAmount === "") {
                    setFreeDeliveryAmount(0);
                  }
                }}
                className="w-28 pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-mono"
                placeholder="0"
              />
            </div>
            <button
              type="submit"
              disabled={savingThreshold}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-sm shadow-2xs cursor-pointer transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingThreshold ? "Updating..." : "Update Amount"}</span>
            </button>
          </div>
        </form>

        {thresholdMsg && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-sm flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{thresholdMsg}</span>
          </div>
        )}
      </div>

      {/* 6 REAL SYNCED SUMMARY CARDS */}
      {loadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BoneyardStatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Total Revenue */}
          <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
              <div className="w-7 h-7 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                ${stats ? stats.salesTotal.toFixed(2) : "0.00"}
              </h3>
              <span className="text-[11px] font-medium text-emerald-600 block mt-1">
                Synced from Supabase Orders
              </span>
            </div>
          </div>

          {/* Card 2: Active Products */}
          <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Products</span>
              <div className="w-7 h-7 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {stats ? stats.productsCount : 0} Products
              </h3>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">
                Pies &amp; Baked Goods
              </span>
            </div>
          </div>

          {/* Card 3: Registered Users */}
          <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Registered Customers</span>
              <div className="w-7 h-7 rounded-sm bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {stats ? stats.todaysUsers : 0} Customers
              </h3>
              <span className="text-[11px] font-medium text-purple-600 block mt-1">
                Synced via Clerk &amp; DB
              </span>
            </div>
          </div>

          {/* Card 4: Customer Reviews */}
          <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Reviews</span>
              <div className="w-7 h-7 rounded-sm bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {stats ? stats.reviewsCount : 0} Reviews
              </h3>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">
                Customer Ratings
              </span>
            </div>
          </div>

          {/* Card 5: Wholesale Inquiries */}
          <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Wholesale</span>
              <div className="w-7 h-7 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {stats ? stats.wholesaleInquiriesCount : 0} Inquiries
              </h3>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">
                Commercial Requests
              </span>
            </div>
          </div>

          {/* Card 6: Contact Inquiries */}
          <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contact Messages</span>
              <div className="w-7 h-7 rounded-sm bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {stats ? stats.contactCount : 0} Messages
              </h3>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">
                Customer Store Inquiries
              </span>
            </div>
          </div>

        </div>
      )}

      {/* MAIN CONTENT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RECENT ORDERS (2 COLUMNS) */}
        <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Purchases</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Latest customer orders from Supabase database</p>
            </div>
            <a href="/admin/orders" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors">
              <span>View All Orders</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <div className="overflow-x-auto">
            {loadingStats ? (
              <BoneyardTableSkeleton rows={4} columns={5} />
            ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">No recent orders recorded in database.</div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <th className="pb-2.5 pl-1">Order #</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Date</th>
                    <th className="pb-2.5 text-right pr-1">Amount</th>
                    <th className="pb-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {stats.recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pl-1 font-mono font-semibold text-slate-900 text-[11px]">
                        {o.orderNumber}
                      </td>
                      <td className="py-3">
                        <div>
                          <span className="font-semibold text-slate-900 block">{o.customerName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{o.customerEmail}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-500 text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3 text-right pr-1 font-bold text-slate-900">
                        ${o.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RECENT USERS (1 COLUMN) */}
        <div className="bg-white rounded-sm border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Registered Customers</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Live accounts synced from Clerk</p>
            </div>
            <a href="/admin/users" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors">
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2.5">
            {loadingStats ? (
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-sm border border-slate-200/60 flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="h-3.5 bg-slate-200 rounded w-28" />
                      <div className="h-2.5 bg-slate-200/70 rounded w-36" />
                    </div>
                  </div>
                ))}
              </div>
            ) : realUsers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No users registered yet.</div>
            ) : (
              realUsers.slice(0, 4).map((u) => {
                const initial = (u.name?.[0] || u.email?.[0] || "U").toUpperCase();
                return (
                  <div key={u.clerk_user_id || u.id} className="p-3 bg-slate-50 rounded-sm border border-slate-200/60 flex items-center gap-3">
                    {u.image_url ? (
                      <img src={u.image_url} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {initial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-slate-900 truncate block">{u.name}</span>
                      <span className="text-[10px] text-slate-400 truncate block">{u.email}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
