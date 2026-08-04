"use client";

import React, { useEffect, useState } from "react";
import { Search, FileSpreadsheet, CheckCircle, Clock, Archive, Trash2, Eye, X } from "lucide-react";
import { WholesaleInquiry } from "@/lib/types";

export default function AdminWholesalePage() {
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<WholesaleInquiry | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wholesale");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data);
      }
    } catch (e) {
      console.error("Error fetching wholesale inquiries", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: WholesaleInquiry["status"]) => {
    try {
      const res = await fetch("/api/wholesale", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/wholesale?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      }
    } catch {
      alert("Failed to delete inquiry");
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: WholesaleInquiry["status"]) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase">Pending</span>;
      case "reviewed":
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase">Reviewed</span>;
      case "contacted":
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase">Contacted</span>;
      case "archived":
        return <span className="bg-slate-100 text-slate-600 border border-slate-300 px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase">Archived</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Wholesale &amp; Foodservice Inquiries</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review partnership requests from hotel venues, cafés, and corporate caterers.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search business name, contact, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#c69c40]/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["all", "pending", "reviewed", "contacted", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                statusFilter === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading wholesale inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No wholesale inquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">BUSINESS / VENUE</th>
                  <th className="py-3.5 px-4">CONTACT NAME</th>
                  <th className="py-3.5 px-4">BUSINESS TYPE</th>
                  <th className="py-3.5 px-4">VOLUME</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredInquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {item.businessName}
                      <span className="block text-[10px] text-slate-400 font-normal">{item.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{item.contactName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.businessType}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.estimatedVolume || "N/A"}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedInquiry(item)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors inline-block"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-block"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Wholesale Inquiry Details</span>
                <h3 className="text-lg font-bold text-slate-800">{selectedInquiry.businessName}</h3>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">CONTACT</span>
                  <span className="font-semibold text-slate-800">{selectedInquiry.contactName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">PHONE</span>
                  <span className="font-semibold text-slate-800">{selectedInquiry.phone || "N/A"}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] font-bold text-slate-400 block">EMAIL</span>
                  <span className="font-semibold text-slate-800">{selectedInquiry.email}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] font-bold text-slate-400 block">BUSINESS TYPE</span>
                  <span className="font-semibold text-slate-800">{selectedInquiry.businessType}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">MESSAGE / REQUEST</span>
                <p className="bg-slate-50 p-3 rounded-xl text-slate-700 leading-relaxed font-sans border border-slate-100">
                  {selectedInquiry.message || "No message provided."}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5">UPDATE STATUS</span>
                <div className="flex gap-2">
                  {(["pending", "reviewed", "contacted", "archived"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                        selectedInquiry.status === st
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
