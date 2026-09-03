"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  MailCheck,
  Trash2,
  Download,
  Plus,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  RefreshCw,
  X,
  Loader2,
} from "lucide-react";
import { Subscriber } from "@/lib/types";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useUIStore } from "@/store/ui.store";
import { BoneyardTableSkeleton } from "@/components/ui/BoneyardSkeleton";
import { exportSubscribersToCSV } from "@/lib/csv-export";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "used">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newSource, setNewSource] = useState("manual_admin");
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const addToast = useUIStore((s) => s.addToast);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribers");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSubscribers(json.data);
      }
    } catch (e) {
      console.error("Error fetching subscribers:", e);
      addToast("Failed to load subscribers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const id = deletingId;
    setDeletingId(null);
    try {
      const res = await fetch(`/api/subscribers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers((prev) => prev.filter((item) => item.id !== id));
        addToast("Subscriber removed successfully.", "info");
      } else {
        addToast(data.error || "Failed to delete subscriber", "error");
      }
    } catch {
      addToast("Failed to delete subscriber", "error");
    }
  };

  const handleToggleDiscountStatus = async (subscriber: Subscriber) => {
    if (togglingId) return;
    setTogglingId(subscriber.id);
    const newStatus = !subscriber.discountUsed;

    try {
      const res = await fetch("/api/subscribers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subscriber.id,
          discountUsed: newStatus,
          firstOrderId: newStatus ? (subscriber.firstOrderId || "MANUAL-OVERRIDE") : null,
        }),
      });

      if (res.ok) {
        setSubscribers((prev) =>
          prev.map((s) =>
            s.id === subscriber.id
              ? { ...s, discountUsed: newStatus, firstOrderId: newStatus ? (s.firstOrderId || "MANUAL-OVERRIDE") : null }
              : s
          )
        );
        addToast(
          newStatus
            ? "Marked discount as redeemed."
            : "Reactivated 10% first-order discount.",
          "success"
        );
      }
    } catch {
      addToast("Failed to update status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      addToast("Please enter a valid email address.", "error");
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, source: newSource }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        addToast(data.message || "Subscriber added.", "success");
        setIsAddModalOpen(false);
        setNewEmail("");
        fetchSubscribers();
      } else {
        addToast(data.error || "Failed to add subscriber.", "error");
      }
    } catch {
      addToast("Failed to add subscriber.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    addToast(`Copied ${email} to clipboard.`, "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const listToExport = filteredSubscribers.length > 0 ? filteredSubscribers : subscribers;
    if (listToExport.length === 0) {
      addToast("No subscribers to export.", "error");
      return;
    }

    exportSubscribersToCSV(listToExport);
    addToast(`Exported ${listToExport.length} subscriber(s) to formatted CSV.`, "success");
  };

  const totalCount = subscribers.length;
  const activeCount = subscribers.filter((s) => !s.discountUsed).length;
  const redeemedCount = subscribers.filter((s) => s.discountUsed).length;

  const filteredSubscribers = subscribers.filter((item) => {
    const matchesSearch = item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? !item.discountUsed
        : item.discountUsed;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            Subscribers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage email subscribers and discount redemption status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchSubscribers}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Subscribers</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl lg:text-3xl font-black text-slate-900">{totalCount}</span>
            <MailCheck className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-500">Collected from website offer modal</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">10% First Order Available</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl lg:text-3xl font-black text-emerald-800">{activeCount}</span>
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-emerald-600/80">Pending their first purchase</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">10% Redeemed</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl lg:text-3xl font-black text-purple-900">{redeemedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-[11px] text-purple-600/80">Completed first order (second order standard)</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subscriber email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-slate-400 transition-colors w-full sm:w-auto"
          >
            <option value="all">All Subscribers ({totalCount})</option>
            <option value="active">10% Available / Pending ({activeCount})</option>
            <option value="used">10% Redeemed ({redeemedCount})</option>
          </select>
        </div>
      </div>

      {/* Subscribers Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <BoneyardTableSkeleton rows={5} />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <MailCheck className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No subscribers found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? `No email matches "${searchTerm}". Try resetting your search.`
                : "No subscribers have filled the popup form yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 lg:px-6">Subscriber Email</th>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Status</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Subscribed Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredSubscribers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Email with copy button */}
                    <td className="py-3.5 px-4 lg:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 select-all">{item.email}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(item.email, item.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                          title="Copy email address"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Discount Code */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded">
                        {item.discountCode || "PIECLUB10"}
                      </span>
                    </td>

                    {/* Discount Status */}
                    <td className="py-3.5 px-4">
                      {item.discountUsed ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                            Redeemed
                          </span>
                          {item.firstOrderId && (
                            <span className="block text-[10px] font-mono text-slate-400">
                              {item.firstOrderId}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          10% First Order Ready
                        </span>
                      )}
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-slate-500 capitalize">
                        {item.source === "offer_modal" ? "Offer Popup" : item.source || "Website"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleDiscountStatus(item)}
                          disabled={togglingId === item.id}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          title="Toggle discount used state"
                        >
                          {item.discountUsed ? "Reactivate 10%" : "Mark Used"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add Subscriber Manually</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="customer@example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Signup Source</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-slate-500"
                >
                  <option value="manual_admin">Manual Admin Entry</option>
                  <option value="in_store_event">In-Store / Market Event</option>
                  <option value="partner_inquiry">Partner Referral</option>
                  <option value="offer_modal">Offer Modal</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Adding this email will automatically create a subscriber record with discount code <strong>PIECLUB10</strong> eligible for 10% off their first order.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isAdding && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Subscriber</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deletingId)}
        title="Remove Subscriber?"
        message="Are you sure you want to delete this subscriber? They will no longer appear in your marketing list."
        confirmText="Delete Subscriber"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
