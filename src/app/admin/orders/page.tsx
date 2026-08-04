"use client";

import React, { useState } from "react";
import { ShoppingBag, Search } from "lucide-react";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const orders = [
    { id: "ORD-9481", customer: "Eleanor Vance", item: "Artisan Baking Masterclass", amount: "$249.00", date: "Aug 04, 2026", status: "Completed" },
    { id: "ORD-9480", customer: "Marcus Brody", item: "Indo-Australian Pie Bundle", amount: "$890.50", date: "Aug 03, 2026", status: "Completed" },
    { id: "ORD-9479", customer: "Sophia Loren", item: "Culinary Spice Pairing Workshop", amount: "$175.00", date: "Aug 03, 2026", status: "Processing" },
  ];

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track and manage customer program enrolments and retail purchases.</p>
        </div>

        {/* Embedded Page Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200/80 p-5 space-y-4 shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <th className="pb-2 pl-1">Order #</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Item / Program</th>
              <th className="pb-2">Date</th>
              <th className="pb-2 text-right pr-1">Amount</th>
              <th className="pb-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="py-3 pl-1 font-mono font-bold text-slate-900">{o.id}</td>
                <td className="py-3 font-semibold text-slate-900">{o.customer}</td>
                <td className="py-3">{o.item}</td>
                <td className="py-3 text-slate-500">{o.date}</td>
                <td className="py-3 text-right pr-1 font-bold text-slate-900">{o.amount}</td>
                <td className="py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${o.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
