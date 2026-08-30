"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Filter, Plus, X, Sparkles, Loader2 } from "lucide-react";
import type { ReviewItem, Product } from "@/lib/types";
import { useUIStore } from "@/store/ui.store";
import { formatCustomerError } from "@/lib/error-formatter";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { BoneyardReviewCardSkeleton } from "@/components/ui/BoneyardSkeleton";
import { notifyContentUpdated, subscribeToRealtimeUpdates } from "@/lib/realtime";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  // Manual Add Review Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useUIStore((s) => s.addToast);

  const [addForm, setAddForm] = useState({
    targetType: "product" as "product" | "custom",
    productId: "",
    customSubject: "Event & Function Catering",
    customerName: "",
    rating: 5,
    comment: "",
    isVerified: true,
    isFeatured: true,
    status: "approved" as "approved" | "pending" | "rejected",
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?status=${statusFilter}&t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
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

  const fetchProductsList = async () => {
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
        if (json.data.length > 0) {
          setAddForm((prev) => ({ ...prev, productId: json.data[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching products list:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchProductsList();

    const unsubscribe = subscribeToRealtimeUpdates((type) => {
      if (type === "reviews") {
        fetchReviews();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [statusFilter]);

  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    const current = reviews.find((r) => r.id === id);
    if (current && current.status === newStatus) return;
    if (updatingReviewId) return;
    setUpdatingReviewId(id);

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
        notifyContentUpdated("reviews");
        addToast(
          newStatus === "approved" ? "Review approved!" : "Review rejected.",
          newStatus === "approved" ? "success" : "info"
        );
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    } finally {
      setUpdatingReviewId(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured?: boolean) => {
    if (togglingFeaturedId) return;
    const nextFeatured = !currentFeatured;
    setTogglingFeaturedId(id);
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: nextFeatured }),
      });
      const json = await res.json();
      if (json.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isFeatured: nextFeatured } : r))
        );
        notifyContentUpdated("reviews");
        addToast(
          nextFeatured ? "Review featured on Home!" : "Review unfeatured from Home.",
          "success"
        );
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    } finally {
      setTogglingFeaturedId(null);
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
        notifyContentUpdated("reviews");
        addToast("Review deleted successfully.", "info");
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    }
  };

  const handleAddManualReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.customerName.trim()) {
      addToast("Please enter customer name.", "error");
      return;
    }
    if (!addForm.comment.trim()) {
      addToast("Please write a review comment.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalProductId: string | null = null;
      let finalProductName = "General Review";

      if (addForm.targetType === "product") {
        const selectedProd = products.find((p) => p.id === addForm.productId);
        if (selectedProd) {
          finalProductId = selectedProd.id;
          finalProductName = selectedProd.name;
        }
      } else {
        finalProductId = null;
        finalProductName = addForm.customSubject;
      }

      const payload = {
        productId: finalProductId,
        productName: finalProductName,
        name: addForm.customerName.trim(),
        rating: addForm.rating,
        comment: addForm.comment.trim(),
        isVerified: addForm.isVerified,
        isFeatured: addForm.isFeatured,
        status: addForm.status,
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        addToast("Manual review added successfully!", "success");
        setIsAddModalOpen(false);
        setAddForm({
          targetType: "product",
          productId: products[0]?.id || "",
          customSubject: "Event & Function Catering",
          customerName: "",
          rating: 5,
          comment: "",
          isVerified: true,
          isFeatured: true,
          status: "approved",
        });
        notifyContentUpdated("reviews");
        fetchReviews();
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Review Moderation &amp; Testimonials</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Approve, feature, and manage customer reviews for your products and home carousel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-sm p-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent text-slate-700 focus:outline-none pr-2 cursor-pointer"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-sm transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6 space-y-4">
            <BoneyardReviewCardSkeleton />
            <BoneyardReviewCardSkeleton />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No reviews found matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Customer &amp; Rating</th>
                  <th className="py-3 px-4">Target Product / Service</th>
                  <th className="py-3 px-4">Comment</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Featured on Home</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rev.name}</div>
                      <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{rev.date}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{rev.productName || "General Catering"}</span>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="line-clamp-2 text-slate-600 text-xs">{rev.comment}</p>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rev.status === "approved"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : rev.status === "rejected"
                            ? "bg-rose-50 text-rose-800 border border-rose-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {rev.status || "approved"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(rev.id, rev.isFeatured)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          rev.isFeatured
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{rev.isFeatured ? "Featured" : "Not Featured"}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {rev.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(rev.id, "approved")}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-sm transition-colors cursor-pointer"
                          title="Approve Review"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {rev.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(rev.id, "rejected")}
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded-sm transition-colors cursor-pointer"
                          title="Reject Review"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeletingId(rev.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
                        title="Delete Review"
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

      {/* ADD MANUAL TESTIMONIAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-md shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">Add Manual Testimonial</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualReviewSubmit} className="p-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={addForm.customerName}
                  onChange={(e) => setAddForm({ ...addForm, customerName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Target</label>
                <select
                  value={addForm.targetType}
                  onChange={(e) => setAddForm({ ...addForm, targetType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-800 bg-white"
                >
                  <option value="product">Product Specific</option>
                  <option value="custom">Custom Service (e.g. Catering)</option>
                </select>
              </div>

              {addForm.targetType === "product" ? (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Product</label>
                  <select
                    value={addForm.productId}
                    onChange={(e) => setAddForm({ ...addForm, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-800 bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custom Service Name</label>
                  <input
                    type="text"
                    required
                    value={addForm.customSubject}
                    onChange={(e) => setAddForm({ ...addForm, customSubject: e.target.value })}
                    placeholder="e.g. Corporate Event Catering"
                    className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rating</label>
                <select
                  value={addForm.rating}
                  onChange={(e) => setAddForm({ ...addForm, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-800 bg-white"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Comment</label>
                <textarea
                  rows={3}
                  required
                  value={addForm.comment}
                  onChange={(e) => setAddForm({ ...addForm, comment: e.target.value })}
                  placeholder="Paste customer testimonial feedback here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={addForm.isFeatured}
                    onChange={(e) => setAddForm({ ...addForm, isFeatured: e.target.checked })}
                    className="rounded-xs"
                  />
                  <span>Feature on Home Carousel</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-sm font-semibold cursor-pointer"
                >
                  {isSubmitting ? "Adding..." : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <AdminConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
