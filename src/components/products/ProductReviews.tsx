"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useUser, useClerk } from "@clerk/nextjs";
import { Star, CheckCircle2, Send, X, MessageSquarePlus, UserCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import ShowMore from "@/components/ui/ShowMore";
import { useUIStore } from "@/store/ui.store";
import { formatCustomerError } from "@/lib/error-formatter";
import { BoneyardReviewCardSkeleton } from "@/components/ui/BoneyardSkeleton";
import type { ReviewItem } from "@/lib/types";
import { subscribeToRealtimeUpdates, notifyContentUpdated } from "@/lib/realtime";

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const addToast = useUIStore((s) => s.addToast);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Form inputs
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newName, setNewName] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load reviews strictly from Supabase API
  const fetchProductReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        setReviews(json.data);
      } else {
        setReviews([]);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductReviews();

    const unsubscribe = subscribeToRealtimeUpdates((type) => {
      if (type === "reviews") {
        fetchProductReviews();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [productId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const handleOpenWriteReview = () => {
    if (!isSignedIn) {
      addToast("Please sign in to share your verified review.", "info");
      openSignIn();
      return;
    }
    const currentUserName =
      user?.fullName ||
      user?.firstName ||
      (user?.emailAddresses?.[0]?.emailAddress
        ? user.emailAddresses[0].emailAddress.split("@")[0]
        : "Verified Customer");
    setNewName(currentUserName);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMsg("");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setErrorMsg("Please write your review thoughts.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          name: newName.trim() || "Verified Customer",
          rating: newRating,
          comment: newComment.trim(),
          isVerified: true,
          status: "approved",
        }),
      });
      const json = await res.json();
      if (json.success) {
        addToast("Review submitted successfully!", "success");
        const createdReview: ReviewItem = {
          id: json.data?.id || `rev-${Date.now()}`,
          productId,
          productName,
          name: newName || "Verified Customer",
          rating: newRating,
          date: "Just now",
          comment: newComment.trim(),
          isVerified: true,
          status: "approved",
        };
        setReviews((prev) => [createdReview, ...prev]);
        notifyContentUpdated("reviews");
        setNewComment("");
        setNewRating(5);
        setIsModalOpen(false);
      } else {
        const friendlyError = formatCustomerError(json.error);
        setErrorMsg(friendlyError);
        addToast(friendlyError, "error");
      }
    } catch (err) {
      const friendlyError = formatCustomerError(err);
      setErrorMsg(friendlyError);
      addToast(friendlyError, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate Average Rating & Pagination
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  const visibleReviews = reviews.slice(0, visibleCount);

  return (
    <div id="reviews" className="border-t border-secondary/15 pt-12 mt-12 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-secondary/10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              Customer Reviews
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/20">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(avgRating))
                      ? "fill-amber-500 text-amber-500"
                      : "text-stone-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-800 font-mono">{avgRating}</span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">Verified Customer Ratings</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenWriteReview}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4 text-secondary" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review List */}
      <div className="py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BoneyardReviewCardSkeleton />
            <BoneyardReviewCardSkeleton />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-base-200/50 rounded-2xl border border-dashed border-secondary/20 p-8 space-y-3">
            <p className="font-serif text-lg text-slate-700 font-medium">
              No reviews yet for {productName}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first gourmet pie enthusiast to taste and share your honest feedback.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenWriteReview}
                className="px-4 py-2 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-secondary/90 transition-all cursor-pointer"
              >
                Be First to Review &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-base-200 border border-secondary/15 flex flex-col justify-between space-y-3 hover:border-secondary/35 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{rev.date}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-secondary/10 text-xs">
                    <span className="font-bold text-slate-900">{rev.name}</span>
                    {rev.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination / Show More */}
            <ShowMore
              hasMore={visibleCount < reviews.length}
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="pt-4"
            />
          </div>
        )}
      </div>

      {/* WRITE REVIEW MODAL (Portaled) */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-review-title"
          >
            {/* Backdrop click dismiss */}
            <div className="absolute inset-0" onClick={handleCloseModal} />

            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between p-5 bg-slate-50 border-b border-slate-100">
                <div>
                  <h3 id="modal-review-title" className="font-serif text-lg font-bold text-slate-900">
                    Write a Verified Review
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">{productName}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  aria-label="Close review modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
                {/* Rating Input */}
                <div className="space-y-1.5 text-center py-2 bg-amber-50/50 rounded-lg border border-amber-100">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Overall Rating
                  </label>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || newRating)
                              ? "fill-amber-500 text-amber-500"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 block">
                    {newRating === 5
                      ? "Outstanding - 5 Stars"
                      : newRating === 4
                      ? "Very Good - 4 Stars"
                      : newRating === 3
                      ? "Average - 3 Stars"
                      : newRating === 2
                      ? "Below Average - 2 Stars"
                      : "Poor - 1 Star"}
                  </span>
                </div>

                {/* Display Name */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <label htmlFor="reviewer-name">Your Display Name</label>
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                      <UserCheck className="w-3 h-3" /> Signed in
                    </span>
                  </div>
                  <input
                    id="reviewer-name"
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Review Comment */}
                <div className="space-y-1">
                  <label htmlFor="reviewer-comment" className="text-xs font-bold text-slate-700 block">
                    Your Review &amp; Experience
                  </label>
                  <textarea
                    id="reviewer-comment"
                    rows={4}
                    required
                    placeholder="Tell us what you loved about the flavours, pastry texture, filling, and delivery experience..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-sm border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
