"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { useBlogStore } from "@/store/blog.store";
import { BoneyardBlogCardSkeleton } from "@/components/ui/BoneyardSkeleton";

export default function BlogClient() {
  const isFetching = useBlogStore((s) => s.isFetching);
  const fetchBlogs = useBlogStore((s) => s.fetchBlogs);
  const currentPage = useBlogStore((s) => s.currentPage);
  const setCurrentPage = useBlogStore((s) => s.setCurrentPage);
  const getPaginatedPosts = useBlogStore((s) => s.getPaginatedPosts);
  const getTotalPages = useBlogStore((s) => s.getTotalPages);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const currentPosts = getPaginatedPosts();
  const totalPages = getTotalPages();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-[#fdf8f3] text-[#1c1410] pt-6 sm:pt-10 pb-12 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

        {/* PC & Tablet Grid Layout (12 max per page: 4 columns x 3 rows on PC) */}
        {isFetching && currentPosts.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <BoneyardBlogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {currentPosts.map((post, idx) => (
              <BlogCard key={post.id} post={post} priority={idx === 0} />
            ))}
          </div>
        )}

        {/* Mobile Horizontal List View (12 max per page) */}
        <div className="block md:hidden divide-y divide-[#ebe3d8] border-y border-[#ebe3d8] bg-white rounded-lg shadow-xs overflow-hidden">
          {currentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="p-4 sm:p-5 flex items-start gap-4 cursor-pointer hover:bg-stone-50/80 transition-colors block"
            >
              {/* Mobile Thumbnail Image */}
              <div className="relative w-24 h-20 sm:w-28 sm:h-22 shrink-0 rounded-lg overflow-hidden border border-[#ebe3d8] bg-stone-100 mt-0.5">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="112px"
                  quality={90}
                />
              </div>

              {/* Right Side Content */}
              <div className="flex-1 min-w-0 space-y-1.5 text-left">
                <div className="flex items-center gap-2 text-[10px] text-[#1c1410]/60 font-sans">
                  <span className="font-semibold text-[#6b1e30]">{post.writer}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h2 className="font-serif text-sm sm:text-base font-bold text-[#1c1410] leading-snug">
                  {post.title}
                </h2>
                
                <p className="text-xs text-[#1c1410]/75 leading-relaxed font-sans line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="pt-1 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#c69c40]">
                    Read Story <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-[10px] text-[#1c1410]/50 font-sans">
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Performant Pagination Bar */}
        {totalPages > 1 && (
          <div className="pt-8 border-t border-[#ebe3d8] flex items-center justify-between gap-4 font-sans">
            {/* Previous Button */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#ebe3d8] bg-white text-xs font-bold text-[#1c1410] hover:bg-[#6b1e30] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#1c1410] transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#6b1e30] text-white shadow-xs"
                        : "bg-white text-[#1c1410] border border-[#ebe3d8] hover:border-[#6b1e30] hover:text-[#6b1e30]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#ebe3d8] bg-white text-xs font-bold text-[#1c1410] hover:bg-[#6b1e30] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#1c1410] transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
