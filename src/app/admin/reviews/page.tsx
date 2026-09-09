"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Filter, Plus, X, Loader2, Pencil } from "lucide-react";
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
    targetType: "product" as "product" | "custom" | "none",
    productId: "",
    customSubject: "Event & Function Catering",
    customerName: "",
    rating: 5,
    comment: "",
    isVerified: true,
    isFeatured: true,
    status: "approved" as "approved" | "pending" | "rejected",
  });

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [editForm, setEditForm] = useState({
    targetType: "product" as "product" | "custom" | "none",
    productId: "",
    customSubject: "",
    name: "",
    rating: 5,
    date: "",
    comment: "",
    isVerified: true,
    isFeatured: false,
    status: "approved" as "approved" | "pending" | "rejected",
  });

  const fetchReviews = async (isBackground = false) => {
    if (!isBackground && reviews.length === 0) {
      setLoading(true);
    }
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
        fetchReviews(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [statusFilter]);

  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);

  const getReviewTargetLabel = (rev: ReviewItem) => {
    if (rev.productId) {
      const match = products.find((p) => p.id === rev.productId);
      if (match) return match.name;
      if (rev.productName && rev.productName.trim() && rev.productName !== "Gourmet Pie") {
        return rev.productName;
      }
      return rev.productId;
    }
    if (rev.productName && rev.productName.trim() && rev.productName !== "Gourmet Pie" && rev.productName !== "General Catering") {
      return rev.productName;
    }
    return "N/A";
  };

  const handleOpenEdit = (rev: ReviewItem) => {
    setEditingReview(rev);
    let targetType: "product" | "custom" | "none" = "none";
    let prodId = "";
    let customSub = "";

    if (rev.productId) {
      targetType = "product";
      prodId = rev.productId;
    } else if (rev.productName && rev.productName.trim() && rev.productName !== "N/A" && rev.productName !== "Gourmet Pie") {
      targetType = "custom";
      customSub = rev.productName;
    } else {
      targetType = "none";
    }

    setEditForm({
      targetType,
      productId: prodId || (products[0]?.id ?? ""),
      customSubject: customSub,
      name: rev.name,
      rating: rev.rating,
      date: rev.date,
      comment: rev.comment,
      isVerified: rev.isVerified ?? true,
      isFeatured: rev.isFeatured ?? false,
      status: rev.status || "approved",
    });
  };

  const handleEditReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    if (!editForm.name.trim()) {
      addToast("Customer name is required.", "error");
      return;
    }
    if (!editForm.comment.trim()) {
      addToast("Review comment is required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalProductId: string | null = null;
      let finalProductName: string | null = null;

      if (editForm.targetType === "product") {
        finalProductId = editForm.productId || null;
        const selectedProd = products.find((p) => p.id === editForm.productId);
        finalProductName = selectedProd ? selectedProd.name : null;
      } else if (editForm.targetType === "custom") {
        finalProductId = null;
        finalProductName = editForm.customSubject.trim() || null;
      } else {
        finalProductId = null;
        finalProductName = null;
      }

      const payload = {
        id: editingReview.id,
        name: editForm.name.trim(),
        rating: editForm.rating,
        date: editForm.date.trim() || undefined,
        comment: editForm.comment.trim(),
        productId: finalProductId,
        productName: finalProductName,
        isVerified: editForm.isVerified,
        isFeatured: editForm.isFeatured,
        status: editForm.status,
      };

      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        addToast("Review updated successfully!", "success");
        setEditingReview(null);
        notifyContentUpdated("reviews");
        fetchReviews(true);
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        fetchReviews(true);
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
                  <th className="py-3 px-4">Target Product</th>
                  <th className="py-3 px-4">Comment</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
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
                      <span className="font-semibold text-slate-800">{getReviewTargetLabel(rev)}</span>
                    </td>

                    <td className="py-3.5 px-4 min-w-[280px] max-w-md">
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

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        disabled={togglingFeaturedId === rev.id}
                        onClick={() => handleToggleFeatured(rev.id, rev.isFeatured)}
                        className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-sm transition-all cursor-pointer select-none ${
                          rev.isFeatured
                            ? "bg-amber-100 text-amber-950 hover:bg-amber-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        } ${togglingFeaturedId === rev.id ? "opacity-75 cursor-not-allowed" : ""}`}
                        title={rev.isFeatured ? "Featured - click to disable" : "Not Featured - click to feature"}
                      >
                        <span className="text-[11px] font-medium">{rev.isFeatured ? "Featured" : "Off"}</span>

                        {/* Interactive On/Off Switch */}
                        <div
                          className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                            rev.isFeatured ? "bg-amber-600" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform flex items-center justify-center ${
                              rev.isFeatured ? "translate-x-3" : "translate-x-0"
                            }`}
                          >
                            {togglingFeaturedId === rev.id && (
                              <Loader2 className="w-2 h-2 text-slate-700 animate-spin" />
                            )}
                          </div>
                        </div>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* EDIT BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(rev)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer"
                          title="Edit Review Details"
                        >
                          <Pencil className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>

                        {/* APPROVE BUTTON */}
                        {rev.status !== "approved" && (
                          <button
                            type="button"
                            disabled={updatingReviewId === rev.id}
                            onClick={() => handleUpdateStatus(rev.id, "approved")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                            title="Approve Review"
                          >
                            {updatingReviewId === rev.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            <span>Approve</span>
                          </button>
                        )}

                        {/* REJECT BUTTON */}
                        {rev.status !== "rejected" && (
                          <button
                            type="button"
                            disabled={updatingReviewId === rev.id}
                            onClick={() => handleUpdateStatus(rev.id, "rejected")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                            title="Reject Review"
                          >
                            {updatingReviewId === rev.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            <span>Reject</span>
                          </button>
                        )}

                        {/* DELETE BUTTON */}
                        <button
                          type="button"
                          onClick={() => setDeletingId(rev.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-sm transition-colors cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
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

      {/* EDIT REVIEW MODAL */}
      {editingReview && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="relative w-full max-w-2xl bg-white rounded-md shadow-2xl border border-slate-200 overflow-hidden max-h-[88vh] flex flex-col my-auto shrink-0" data-lenis-prevent>
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Admin Management</span>
                <h2 className="text-base font-bold text-slate-900">Edit Review &amp; Target Product</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-sm cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditReviewSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1 overscroll-contain" data-lenis-prevent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="e.g. Sue Harris"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-xs sm:text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Review Date</label>
                  <input
                    type="text"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    placeholder="e.g. 25 Aug 2026"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-mono text-xs sm:text-sm transition-all"
                  />
                </div>
              </div>

              {/* Target Product Type Selector */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-700 block">Target Product / Association</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, targetType: "product" })}
                    className={`py-2 px-3 text-center rounded-sm border font-semibold text-xs transition-all cursor-pointer ${
                      editForm.targetType === "product"
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Specific Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, targetType: "custom" })}
                    className={`py-2 px-3 text-center rounded-sm border font-semibold text-xs transition-all cursor-pointer ${
                      editForm.targetType === "custom"
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Custom Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, targetType: "none" })}
                    className={`py-2 px-3 text-center rounded-sm border font-semibold text-xs transition-all cursor-pointer ${
                      editForm.targetType === "none"
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    None (N/A)
                  </button>
                </div>

                {editForm.targetType === "product" && (
                  <div className="pt-1.5">
                    <select
                      value={editForm.productId}
                      onChange={(e) => setEditForm({ ...editForm, productId: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white text-xs sm:text-sm cursor-pointer"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (ID: {p.id})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {editForm.targetType === "custom" && (
                  <div className="pt-1.5">
                    <input
                      type="text"
                      value={editForm.customSubject}
                      onChange={(e) => setEditForm({ ...editForm, customSubject: e.target.value })}
                      placeholder="e.g. Catering &amp; Events, Wholesale, General"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-xs sm:text-sm"
                    />
                  </div>
                )}

                {editForm.targetType === "none" && (
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    This review will have no target product and will display as &quot;N/A&quot;.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Rating</label>
                  <select
                    value={editForm.rating}
                    onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white text-xs sm:text-sm cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Outstanding)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                    <option value={2}>⭐⭐ (2 Stars - Fair)</option>
                    <option value={1}>⭐ (1 Star - Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Review Comment</label>
                  <span className="text-[11px] font-mono text-slate-400">{editForm.comment.length} chars</span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  placeholder="Review feedback content..."
                  className="w-full px-4 py-3 min-h-[140px] max-h-[320px] border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-xs sm:text-sm leading-relaxed overflow-y-auto overscroll-contain resize-y"
                  data-lenis-prevent
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">Feature on Home Carousel</span>
                    <span className="text-[11px] text-slate-500 block">Showcase this review on the homepage testimonials</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer shrink-0 ${
                      editForm.isFeatured ? "bg-amber-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                        editForm.isFeatured ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">Verified Customer Badge</span>
                    <span className="text-[11px] text-slate-500 block">Display the verified purchase badge on this review</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditForm((prev) => ({ ...prev, isVerified: !prev.isVerified }))}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer shrink-0 ${
                      editForm.isVerified ? "bg-emerald-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                        editForm.isVerified ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-sm font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-sm font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MANUAL TESTIMONIAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="relative w-full max-w-xl bg-white rounded-md shadow-2xl border border-slate-200 overflow-hidden max-h-[88vh] flex flex-col my-auto shrink-0" data-lenis-prevent>
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 shrink-0">
              <h2 className="text-base font-bold text-slate-900">Add Manual Testimonial</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-sm cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualReviewSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1 overscroll-contain" data-lenis-prevent>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Customer Name</label>
                <input
                  type="text"
                  required
                  value={addForm.customerName}
                  onChange={(e) => setAddForm({ ...addForm, customerName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-xs sm:text-sm transition-all"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Target Product</label>
                <select
                  value={addForm.targetType}
                  onChange={(e) => setAddForm({ ...addForm, targetType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white text-xs sm:text-sm cursor-pointer"
                >
                  <option value="product">Specific Product</option>
                  <option value="custom">Custom Service (e.g. Catering)</option>
                  <option value="none">None (N/A)</option>
                </select>
              </div>

              {addForm.targetType === "product" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Select Product</label>
                  <select
                    value={addForm.productId}
                    onChange={(e) => setAddForm({ ...addForm, productId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white text-xs sm:text-sm cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {addForm.targetType === "custom" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Custom Service Name</label>
                  <input
                    type="text"
                    required
                    value={addForm.customSubject}
                    onChange={(e) => setAddForm({ ...addForm, customSubject: e.target.value })}
                    placeholder="e.g. Corporate Event Catering"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-xs sm:text-sm"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Rating</label>
                <select
                  value={addForm.rating}
                  onChange={(e) => setAddForm({ ...addForm, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white text-xs sm:text-sm cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Outstanding)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                  <option value={2}>⭐⭐ (2 Stars - Fair)</option>
                  <option value={1}>⭐ (1 Star - Poor)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Comment</label>
                  <span className="text-[11px] font-mono text-slate-400">{addForm.comment.length} chars</span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={addForm.comment}
                  onChange={(e) => setAddForm({ ...addForm, comment: e.target.value })}
                  placeholder="Paste customer testimonial feedback here..."
                  className="w-full px-4 py-3 min-h-[140px] max-h-[320px] border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-xs sm:text-sm leading-relaxed overflow-y-auto overscroll-contain resize-y"
                  data-lenis-prevent
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">Feature on Home Carousel</span>
                  <span className="text-[11px] text-slate-500 block">Display this testimonial directly in the homepage review carousel</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAddForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer shrink-0 ${
                    addForm.isFeatured ? "bg-amber-600" : "bg-slate-300"
                  }`}
                  title={addForm.isFeatured ? "Featured" : "Not Featured"}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                      addForm.isFeatured ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-sm font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-sm font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? "Adding..." : "Add Review"}</span>
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
