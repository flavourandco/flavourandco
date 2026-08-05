"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Filter } from "lucide-react";
import type { ReviewItem } from "@/lib/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
      } else {
        alert(json.error || "Failed to update review status");
      }
    } catch {
      alert("Error updating review status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(json.error || "Failed to delete review");
      }
    } catch {
      alert("Error deleting review");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Reviews &amp; Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">
            View, approve, reject, and moderate ratings &amp; reviews from buyers.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400 mr-2" />
        {["all", "approved", "pending", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-semibold">
            Loading reviews from Supabase...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Star className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900">{r.name}</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                      r.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : r.status === "rejected"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {r.status || "approved"}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed">&ldquo;{r.comment}&rdquo;</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600">{r.productName}</span>
                    <span>•</span>
                    <span>{r.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {r.status !== "approved" && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, "approved")}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {r.status !== "rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(r.id, "rejected")}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100/80 rounded-lg transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
