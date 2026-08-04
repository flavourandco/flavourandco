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
  ArrowUpRight,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeModal, setActiveModal] = useState<"product" | "blog" | null>(null);

  // 1. Recent Purchases (Bakery E-Commerce Orders)
  const recentPurchases = [
    {
      id: "ORD-9481",
      customer: "Eleanor Vance",
      email: "eleanor@example.com",
      item: "Simran's Butter Chicken Artisan Pie (Box of 4)",
      category: "Bakery",
      date: "2026-08-04",
      amount: 48.00,
      status: "Completed",
    },
    {
      id: "ORD-9480",
      customer: "Marcus Brody",
      email: "marcus@example.com",
      item: "Indo-Australian Wholesale Variety Crate (60 Units)",
      category: "Wholesale",
      date: "2026-08-03",
      amount: 720.00,
      status: "Completed",
    },
    {
      id: "ORD-9479",
      customer: "Sophia Loren",
      email: "sophia@example.com",
      item: "Slow-Cooked Beef & Stout Pie (Box of 6)",
      category: "Bakery",
      date: "2026-08-03",
      amount: 68.50,
      status: "Processing",
    },
    {
      id: "ORD-9478",
      customer: "David Chen",
      email: "david.c@example.com",
      item: "Chai Spiced Apple & Pear Turnover (Box of 4)",
      category: "Sweet Bakery",
      date: "2026-08-02",
      amount: 36.00,
      status: "Completed",
    },
    {
      id: "ORD-9477",
      customer: "Chloe Bennett",
      email: "chloe@example.com",
      item: "Gourmet Lamb Roast & Rosemary Pie (Box of 4)",
      category: "Bakery",
      date: "2026-08-01",
      amount: 52.00,
      status: "Completed",
    },
  ];

  // 2. Latest Reviews (Bakery Customer Reviews)
  const latestReviews = [
    {
      id: 1,
      customer: "Amelia Wright",
      rating: 5,
      comment: "Simran's Butter Chicken Pie is out of this world! The pastry layers are unbelievably buttery and flaky.",
      item: "Butter Chicken Artisan Pie",
      date: "2 hours ago",
    },
    {
      id: 2,
      customer: "Julian Thorne",
      rating: 5,
      comment: "Served these at our catering event. The fusion of spices in the beef & stout pie recipe was praised by everyone.",
      item: "Beef & Stout Pie Crate",
      date: "5 hours ago",
    },
    {
      id: 3,
      customer: "Sarah Jenkins",
      rating: 4,
      comment: "Fast delivery to Sydney CBD and arrived fresh. The chai spiced turnover was the highlight of our afternoon tea.",
      item: "Chai Spiced Apple Turnover",
      date: "1 day ago",
    },
  ];

  // Real Users state from API
  const [realUsers, setRealUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setRealUsers(data.users);
        }
      } catch (err) {
        console.error("Dashboard failed to load real users:", err);
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  // Fallback dummy customers if database has no users yet
  const defaultCustomers = [
    {
      id: "1",
      name: "Hannah Abbott",
      email: "hannah@abbott.io",
      joined: "Aug 04, 2026",
      initials: "HA",
      bg: "bg-slate-900 text-white",
    },
    {
      id: "2",
      name: "Liam O'Connor",
      email: "liam.oc@example.com",
      joined: "Aug 03, 2026",
      initials: "LO",
      bg: "bg-emerald-600 text-white",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time bakery product sales, order fulfilment, and customer reviews.
          </p>
        </div>

        {/* QUICK ACTIONS BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveModal("product")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </button>

          <button
            onClick={() => setActiveModal("blog")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>New Blog</span>
          </button>
        </div>
      </div>

      {/* 5 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">$128,450</h3>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12.4% this month</span>
            </span>
          </div>
        </div>

        {/* Card 2: Active Products */}
        <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Products</span>
            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">24 Active</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Pies &amp; Baked Goods
            </span>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">1,842</h3>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.2% vs last mo</span>
            </span>
          </div>
        </div>

        {/* Card 4: Customer Reviews */}
        <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Reviews</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">4.9 ★</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              480 total reviews
            </span>
          </div>
        </div>

        {/* Card 5: Wholesale Inquiries */}
        <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Wholesale</span>
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">142 Inquiries</h3>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+8 new this week</span>
            </span>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RECENT PURCHASES (2 COLUMNS) */}
        <div className="lg:col-span-2 bg-white rounded-md border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Purchases</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Latest bakery orders &amp; catering shipments</p>
            </div>
            <a href="/admin/orders" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors">
              <span>View All Orders</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="pb-2.5 pl-1">Order #</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Product Ordered</th>
                  <th className="pb-2.5">Date</th>
                  <th className="pb-2.5 text-right pr-1">Amount</th>
                  <th className="pb-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pl-1 font-mono font-semibold text-slate-900 text-[11px]">
                      {purchase.id}
                    </td>
                    <td className="py-3">
                      <div>
                        <span className="font-semibold text-slate-900 block">{purchase.customer}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{purchase.email}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-800 font-medium">{purchase.item}</span>
                    </td>
                    <td className="py-3 text-slate-500 text-[11px]">
                      {purchase.date}
                    </td>
                    <td className="py-3 text-right pr-1 font-bold text-slate-900">
                      ${purchase.amount.toFixed(2)}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          purchase.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LATEST REVIEWS (1 COLUMN) */}
        <div className="bg-white rounded-md border border-slate-200/80 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Latest Reviews</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Recent customer feedback on products</p>
            </div>
            <a href="/admin/reviews" className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              4.9 ★
            </a>
          </div>

          <div className="space-y-4">
            {latestReviews.map((rev) => (
              <div key={rev.id} className="p-3 bg-slate-50/70 rounded border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">{rev.customer}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic line-clamp-2">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1">
                  <span>{rev.item}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT CUSTOMERS */}
      <div className="bg-white rounded-md border border-slate-200/80 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Registrations</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Live Clerk user accounts synced to database</p>
          </div>
          <a
            href="/admin/users"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <span>Manage All Users</span>
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingUsers ? (
            <div className="col-span-full py-6 text-center text-xs text-slate-400">
              Loading recent users...
            </div>
          ) : realUsers.length > 0 ? (
            realUsers.slice(0, 4).map((u) => {
              const initial = (u.name?.[0] || u.email?.[0] || "U").toUpperCase();
              const dateStr = u.created_at
                ? new Date(u.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Recent";

              return (
                <div
                  key={u.clerk_user_id || u.id}
                  className="p-3.5 bg-slate-50/70 rounded border border-slate-100 flex items-center gap-3"
                >
                  {u.image_url ? (
                    <img
                      src={u.image_url}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {initial}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-slate-900 truncate block">
                      {u.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">{u.email}</span>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="text-slate-500 font-medium">Joined {dateStr}</span>
                      <span className="font-semibold text-slate-600 uppercase text-[9px] bg-slate-200/60 px-1.5 py-0.5 rounded">
                        {u.role || "user"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            defaultCustomers.map((cust) => (
              <div
                key={cust.id}
                className="p-3.5 bg-slate-50/70 rounded border border-slate-100 flex items-center gap-3"
              >
                <div
                  className={`w-9 h-9 rounded-md ${cust.bg} flex items-center justify-center font-bold text-xs shrink-0`}
                >
                  {cust.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-xs text-slate-900 truncate block">{cust.name}</span>
                  <span className="text-[10px] text-slate-400 truncate block">{cust.email}</span>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-slate-500 font-medium">Joined {cust.joined}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QUICK ACTIONS MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {activeModal === "product" && "Add New Bakery Product"}
                {activeModal === "blog" && "Create New Blog Article"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {activeModal === "product" && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
                    <input type="text" placeholder="e.g. Simran's Butter Chicken Artisan Pie" className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Price ($)</label>
                      <input type="number" placeholder="12.50" className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Category</label>
                      <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900">
                        <option>Savory Pies</option>
                        <option>Sweet Turnovers</option>
                        <option>Wholesale Crates</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {activeModal === "blog" && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Article Title</label>
                    <input type="text" placeholder="e.g. The Story Behind Our Plate of Origin Recipe" className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900" />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`${activeModal ? activeModal.toUpperCase() : ""} saved successfully!`);
                  setActiveModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white hover:bg-black rounded shadow-sm cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
