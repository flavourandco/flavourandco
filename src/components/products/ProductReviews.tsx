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
      const res = await fetch(`/api/reviews?productId=${productId}&t=${Date.now()}`);
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
      addToast("Please sign in to write a review.", "info");
      openSignIn();
      return;
    }

    const fetchedName =
      user?.fullName ||
      user?.firstName ||
      user?.username ||
      user?.primaryEmailAddress?.emailAddress ||
      "Verified Customer";

    setNewName(fetchedName);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isSignedIn) {
      addToast("Please sign in to submit a review.", "info");
      openSignIn();
      return;
    }

    if (!newComment.trim()) {
      const msg = "Please write a brief review.";
      setErrorMsg(msg);
      addToast(msg, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          name: newName || "Verified Customer",
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
  const hasMoreReviews = visibleCount < reviews.length;

  return (
    <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-[#c69c40]/30">
      <div className="space-y-4 sm:space-y-6">
        
        {/* Rating Summary Bar */}
        <div className="bg-white rounded-lg border border-[#c69c40]/25 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#6b1e30]">
                {avgRating}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-stone-500">out of 5</span>
            </div>

            <div className="h-8 w-px bg-stone-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-1 text-brand-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-brand-gold text-brand-gold"
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-stone-500 mt-0.5 block">
                {reviews.length === 0
                  ? "No customer reviews yet"
                  : `Based on ${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleOpenWriteReview}
            className="w-full sm:w-auto py-3 px-6 text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
          >
            Write a Review
          </Button>
        </div>

        {/* Written Reviews List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BoneyardReviewCardSkeleton key={i} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white/80 rounded-xl border border-stone-200 p-8 sm:p-12 text-center space-y-3 shadow-xs">
            <MessageSquarePlus className="h-10 w-10 text-[#6b1e30]/40 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-[#07402b]">
              Be the first to review {productName}!
            </h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Have you tried this pie? Click the button above to share your experience with other food lovers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {visibleReviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#c69c40]/40 transition-all"
              >
                <div className="space-y-3">
                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-brand-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating
                              ? "fill-brand-gold text-brand-gold"
                              : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium">{rev.date}</span>
                  </div>

                  {/* Review Written Content */}
                  <p className="text-stone-700 text-xs leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Reviewer Info */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-[#6b1e30]">
                    {rev.name}
                  </span>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#07402b] bg-[#07402b]/10 px-2 py-0.5 rounded">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Buyer
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Reusable ShowMore Component */}
        <ShowMore
          onClick={() => setVisibleCount((prev) => prev + 4)}
          hasMore={hasMoreReviews}
          label="Show More Reviews"
        />

      </div>

      {/* ───────────────────────────────────────────────────────────
          WRITE A REVIEW FULL SCREEN POPUP MODAL (REACT PORTAL TO DOCUMENT.BODY)
         ─────────────────────────────────────────────────────────── */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto" data-lenis-prevent>
          {/* Backdrop Click Dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Body Container */}
          <div className="relative z-10 w-full max-w-lg bg-cream rounded-xl border-2 border-[#6b1e30]/30 shadow-2xl p-6 sm:p-8 space-y-5 my-auto shrink-0 max-h-[90vh] overflow-y-auto overscroll-contain" data-lenis-prevent>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-200/80 pb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#07402b]">
                  Write a Review
                </h3>
                <p className="text-stone-600 text-xs mt-1">
                  Share your experience with <span className="font-semibold text-[#6b1e30]">{productName}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white hover:bg-stone-200/70 border border-stone-300 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Review Input Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-md border border-stone-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= (hoverRating || newRating)
                            ? "fill-brand-gold text-brand-gold"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-3">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Reviewer Name (Auto-fetched from Clerk Account — Non-editable) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  Reviewer Name
                </label>
                <div className="w-full bg-stone-100 border border-stone-300 rounded-md px-3.5 py-2.5 text-xs font-semibold text-stone-800 flex items-center justify-between cursor-not-allowed select-none">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-[#07402b]" />
                    <span>{newName || "Logged-in Customer"}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#07402b] bg-[#07402b]/10 px-2 py-0.5 rounded border border-[#07402b]/20 uppercase">
                    Verified Account
                  </span>
                </div>
              </div>

              {/* Review Text Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details about taste, texture, heating tips, or event serving..."
                  className="w-full bg-white border border-stone-300 rounded-md p-3.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#6b1e30]"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
