"use client";

import React from "react";
import { Star } from "lucide-react";

export default function ReviewsPage() {
  const reviews = [
    { id: 1, name: "Amelia Wright", rating: 5, comment: "The Indo-Australian Pie Masterclass transformed my baking technique!", item: "Artisan Baking Masterclass", date: "Aug 04, 2026" },
    { id: 2, name: "Julian Thorne", rating: 5, comment: "Outstanding flavor profiles. The fusion of spices in the beef & curry pie recipe is absolute perfection.", item: "Culinary Spice Pairing", date: "Aug 03, 2026" },
    { id: 3, name: "Sarah Jenkins", rating: 4, comment: "Great step-by-step videos and downloadable guide. Highly recommended for home chefs!", item: "Gourmet Pastry BootCamp", date: "Aug 02, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Reviews</h1>
        <p className="text-xs text-slate-500 mt-0.5">View and moderate ratings &amp; reviews from students and buyers.</p>
      </div>

      <div className="bg-white rounded-md border border-slate-200/80 p-5 space-y-4">
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 bg-slate-50 rounded border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{r.name}</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700 italic">&ldquo;{r.comment}&rdquo;</p>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                <span>{r.item}</span>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
