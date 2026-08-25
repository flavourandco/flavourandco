"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Filter, Plus, X, Sparkles } from "lucide-react";
import type { ReviewItem, Product } from "@/lib/types";
import { useUIStore } from "@/store/ui.store";
import { formatCustomerError } from "@/lib/error-formatter";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { BoneyardReviewCardSkeleton } from "@/components/ui/BoneyardSkeleton";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      const res = await fetch(`/api/reviews?status=${statusFilter}&t=${Date.now()}`);
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
      const res = await fetch(`/api/products?t=${Date.now()}`);
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
          newStatus === "approved" ? "Review approved!" : "Review rejected.",
          newStatus === "approved" ? "success" : "info"
        );
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured?: boolean) => {
    const nextFeatured = !currentFeatured;
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
        addToast(
          nextFeatured ? "Review set as Featured on Homepage!" : "Review removed from Homepage featured.",
          "success"
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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Reviews &amp; Moderation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer feedback, toggle homepage featured testimonials, and add manual reviews.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-all shadow-2xs cursor-pointer border border-slate-800 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Manual Review</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-sm border border-slate-200/80 shadow-2xs flex items-center gap-2 overflow-x-auto">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
        {["all", "approved", "pending", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-sm text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
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
            <p className="text-xs font-semibold text-slate-600">No reviews found matching status filter.</p>
            <p className="text-[11px] text-slate-400">Click &ldquo;Add Manual Review&rdquo; above to create a new review entry.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-slate-50 hover:bg-slate-100/60 rounded-sm border border-slate-200/60 space-y-3 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-xs text-slate-900">{r.name}</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {r.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-sm">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Featured on Home
                      </span>
                    )}
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
                    <span className="font-semibold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-sm">{r.productName || "General Review"}</span>
                    <span>•</span>
                    <span>{r.date}</span>
                    {r.isVerified && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">Verified Buyer</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Toggle Featured Button */}
                    <button
                      onClick={() => handleToggleFeatured(r.id, r.isFeatured)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-sm border transition-colors cursor-pointer ${
                        r.isFeatured
                          ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                      title="Toggle show on Homepage testimonial slider"
                    >
                      <Sparkles className={`w-3 h-3 ${r.isFeatured ? "text-amber-600 fill-amber-500" : "text-slate-400"}`} />
                      <span>{r.isFeatured ? "Featured" : "Feature on Home"}</span>
                    </button>

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

      {/* ADMIN MANUAL ADD REVIEW MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="bg-white w-full max-w-xl rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900">Add Manual Review</h2>
                <p className="text-[11px] text-slate-500">Create a new customer review for a specific product or catering service.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddManualReviewSubmit} className="p-6 space-y-4 text-xs">
              {/* Target Type Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">* Review Target / Subject</label>
                <div className="flex gap-4 p-2 bg-slate-50 border border-slate-200 rounded-sm">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="targetType"
                      checked={addForm.targetType === "product"}
                      onChange={() => setAddForm((prev) => ({ ...prev, targetType: "product" }))}
                      className="text-slate-900"
                    />
                    <span>Specific Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="targetType"
                      checked={addForm.targetType === "custom"}
                      onChange={() => setAddForm((prev) => ({ ...prev, targetType: "custom" }))}
                      className="text-slate-900"
                    />
                    <span>Catering &amp; General Service</span>
                  </label>
                </div>
              </div>

              {/* Product Dropdown OR Custom Service Dropdown */}
              {addForm.targetType === "product" ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">* Select Product</label>
                  <select
                    value={addForm.productId}
                    onChange={(e) => setAddForm({ ...addForm, productId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)} AUD)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">* Service / Catering Subject</label>
                  <select
                    value={addForm.customSubject}
                    onChange={(e) => setAddForm({ ...addForm, customSubject: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-medium"
                  >
                    <option value="Event & Function Catering">Event &amp; Function Catering</option>
                    <option value="Wholesale Partnership">Wholesale &amp; Foodservice Partnership</option>
                    <option value="General Store & Brand Experience">General Store &amp; Brand Experience</option>
                    <option value="Corporate Office Catering">Corporate Office Catering</option>
                  </select>
                </div>
              )}

              {/* Customer Name & Rating Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">* Customer Name</label>
                  <input
                    type="text"
                    required
                    value={addForm.customerName}
                    onChange={(e) => setAddForm({ ...addForm, customerName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">* Star Rating (1 to 5)</label>
                  <select
                    value={addForm.rating}
                    onChange={(e) => setAddForm({ ...addForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-bold"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </div>
              </div>

              {/* Review Text Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">* Review Comment</label>
                <textarea
                  rows={4}
                  required
                  value={addForm.comment}
                  onChange={(e) => setAddForm({ ...addForm, comment: e.target.value })}
                  placeholder="Enter detailed customer review comment..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                />
              </div>

              {/* Checkboxes: Featured & Verified */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addForm.isFeatured}
                    onChange={(e) => setAddForm({ ...addForm, isFeatured: e.target.checked })}
                    className="rounded text-slate-900 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 text-[11px]">Feature on Homepage Slider</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addForm.isVerified}
                    onChange={(e) => setAddForm({ ...addForm, isVerified: e.target.checked })}
                    className="rounded text-slate-900 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 text-[11px]">Mark as Verified Buyer</span>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-sm cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Adding..." : "Add Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR DELETION */}
      <AdminConfirmModal
        isOpen={Boolean(deletingId)}
        title="Confirm Review Deletion"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
