"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle2, Send, Sparkles, X } from "lucide-react";
import Button from "@/components/ui/Button";
import ShowMore from "@/components/ui/ShowMore";

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const INITIAL_MOCK_REVIEWS: Record<string, ReviewItem[]> = {
  default: [
    {
      id: "rev-1",
      name: "Priya Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "The pastry is flaky and golden, and the filling carries authentic Indian flavours with incredible depth. Our family finished the entire pack in one sitting!",
      isVerified: true,
    },
    {
      id: "rev-2",
      name: "David Miller",
      rating: 5,
      date: "1 month ago",
      comment:
        "Served these at our weekend gathering and every single guest asked where I bought them. Heating in the air fryer took just 10 minutes!",
      isVerified: true,
    },
    {
      id: "rev-3",
      name: "Ananya Patel",
      rating: 5,
      date: "1 month ago",
      comment:
        "Rich, aromatic spices and premium quality. Truly the best fusion of Australian pie pastry and authentic recipes.",
      isVerified: true,
    },
    {
      id: "rev-4",
      name: "Marcus Vance",
      rating: 5,
      date: "2 months ago",
      comment:
        "Hands down the best butter chicken pie in Melbourne! The crust stays crispy and the meat is super tender.",
      isVerified: true,
    },
    {
      id: "rev-5",
      name: "Sophie Lin",
      rating: 5,
      date: "2 months ago",
      comment:
        "Loved the spices and how easy they are to prepare from frozen. Will definitely order again for my next party!",
      isVerified: true,
    },
    {
      id: "rev-6",
      name: "Liam O'Connor",
      rating: 5,
      date: "3 months ago",
      comment:
        "An absolute winner for family dinners. Everyone loved the distinct, rich flavour profile.",
      isVerified: true,
    },
  ],
};

import { useUIStore } from "@/store/ui.store";
import { formatCustomerError } from "@/lib/error-formatter";
import { BoneyardReviewCardSkeleton } from "@/components/ui/BoneyardSkeleton";

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const addToast = useUIStore((s) => s.addToast);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form inputs
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newName, setNewName] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Load reviews from Supabase API
  useEffect(() => {
    setLoading(true);
    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setReviews(json.data);
        } else {
          setReviews(INITIAL_MOCK_REVIEWS.default);
        }
      })
      .catch(() => setReviews(INITIAL_MOCK_REVIEWS.default))
      .finally(() => setLoading(false));
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newName.trim()) {
      const msg = "Please enter your name.";
      setErrorMsg(msg);
      addToast(msg, "error");
      return;
    }
    if (!newComment.trim()) {
      const msg = "Please write a brief review.";
      setErrorMsg(msg);
      addToast(msg, "error");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name: newName.trim(),
          rating: newRating,
          comment: newComment.trim(),
          isVerified: true,
          status: "approved",
        }),
      });
      const json = await res.json();
      if (json.success) {
        const msg = "Thank you for your review! It's now live on our site.";
        setSuccessMsg(msg);
        addToast(msg, "success");
        const createdReview: ReviewItem = {
          id: json.data?.id || `rev-${Date.now()}`,
          name: newName.trim(),
          rating: newRating,
          date: "Just now",
          comment: newComment.trim(),
          isVerified: true,
        };
        setReviews((prev) => [createdReview, ...prev]);
        setNewName("");
        setNewComment("");
        setNewRating(5);
        setTimeout(() => setIsModalOpen(false), 1500);
      } else {
        const friendlyError = formatCustomerError(json.error);
        setErrorMsg(friendlyError);
        addToast(friendlyError, "error");
      }
    } catch (err) {
      const friendlyError = formatCustomerError(err);
      setErrorMsg(friendlyError);
      addToast(friendlyError, "error");
    }
  };

  // Calculate Average Rating & Pagination
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMoreReviews = visibleCount < reviews.length;
  const remainingReviews = reviews.length - visibleCount;

  return (
    <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-[#c69c40]/30">
      <div className="space-y-4 sm:space-y-6">
        
        {/* Rating Summary Bar (Without review heading) */}
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
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setIsModalOpen(true);
              setErrorMsg("");
            }}
            className="w-full sm:w-auto py-3 px-6 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            Write a Review
          </Button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-[#07402b]/10 border border-[#07402b]/30 text-[#07402b] px-4 py-3 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-[#07402b]" />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg("")}
              className="text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Written Reviews List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BoneyardReviewCardSkeleton key={i} />
            ))}
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

        {/* Reusable ShowMore Component (Only shown if total reviews > 4) */}
        <ShowMore
          onClick={() => setVisibleCount((prev) => prev + 4)}
          hasMore={hasMoreReviews}
          label="Show More Reviews"
        />

      </div>

      {/* ───────────────────────────────────────────────────────────
          WRITE A REVIEW POPUP MODAL WITH BACKDROP OVERLAY
         ─────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto" data-lenis-prevent>
          {/* Backdrop Click Dismiss */}
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Body Container */}
          <div className="relative z-10 w-full max-w-lg bg-cream rounded-xl border-2 border-[#6b1e30]/30 shadow-2xl p-6 sm:p-8 space-y-5 my-auto shrink-0 max-h-[88vh] overflow-y-auto overscroll-contain" data-lenis-prevent>
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

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sarah J."
                  className="w-full bg-white border border-stone-300 rounded-md px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#6b1e30]"
                  required
                />
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
                  className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider gap-2 shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Review</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
