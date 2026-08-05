"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/data";
import BlogCard from "@/components/blog/BlogCard";

export default function BlogClient() {
  return (
    <div className="w-full bg-[#fdf8f3] text-[#1c1410] pt-6 sm:pt-10 pb-12 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* PC & Tablet Grid Layout (4 per row on PC, 2 on Tablet) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {blogPosts.map((post, idx) => (
            <BlogCard key={post.id} post={post} priority={idx === 0} />
          ))}
        </div>

        {/* Mobile Horizontal List View */}
        <div className="block md:hidden divide-y divide-[#ebe3d8] border-y border-[#ebe3d8] bg-white rounded-lg shadow-xs overflow-hidden">
          {blogPosts.map((post) => (
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

      </div>
    </div>
  );
}
