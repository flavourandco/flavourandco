"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Filter } from "lucide-react";
import type { ReviewItem } from "@/lib/types";
import { useUIStore } from "@/store/ui.store";
import { formatCustomerError } from "@/lib/error-formatter";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { BoneyardReviewCardSkeleton } from "@/components/ui/BoneyardSkeleton";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?status=${statusFilter}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        addToast(
          newStatus === "approved" ? "Customer review approved!" : "Customer review rejected.",
          newStatus === "approved" ? "success" : "info"
        );
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const id = deletingId;
    setDeletingId(null);
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        addToast("Review deleted successfully.", "info");
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Reviews &amp; Moderation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View, approve, reject, and moderate buyer ratings and comments.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-sm border border-slate-200/80 shadow-2xs flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
        {["all", "approved", "pending", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-sm text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-sm border border-slate-200/80 p-5 shadow-2xs">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <BoneyardReviewCardSkeleton key={i} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Star className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No reviews found matching status.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-slate-50 hover:bg-slate-100/60 rounded-sm border border-slate-200/60 space-y-3 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-slate-900">{r.name}</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border self-start sm:self-auto ${
                      r.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                        : r.status === "rejected"
                        ? "bg-rose-50 text-rose-700 border-rose-200/60"
                        : "bg-amber-50 text-amber-700 border-amber-200/60"
                    }`}
                  >
                    {r.status || "approved"}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">&ldquo;{r.comment}&rdquo;</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="font-medium text-slate-600">{r.productName}</span>
                    <span>•</span>
                    <span>{r.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {r.status !== "approved" && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, "approved")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-sm border border-emerald-200/80 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3 h-3" /> Approve
                      </button>
                    )}

                    {r.status !== "rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, "rejected")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm border border-slate-200/80 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    )}

                    <button
                      onClick={() => setDeletingId(r.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-sm border border-rose-200/80 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL FOR DELETION */}
      <AdminConfirmModal
        isOpen={Boolean(deletingId)}
        title="Confirm Review Deletion"
        message="Are you sure you want to delete this customer review? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
