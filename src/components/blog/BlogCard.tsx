"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  priority?: boolean;
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-lg overflow-hidden border border-[#ebe3d8] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col cursor-pointer h-full"
    >
      {/* Thumbnail Image Container with Fixed Standardized Aspect Ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 border-b border-[#ebe3d8]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-104 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={90}
          priority={priority}
        />
      </div>

      {/* Card Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-left">
        <div className="space-y-2">
          {/* Writer & Date Meta */}
          <div className="flex items-center gap-2 text-[11px] text-[#1c1410]/60 font-sans">
            <span className="font-semibold text-[#6b1e30]">{post.writer}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#1c1410] group-hover:text-[#6b1e30] transition-colors leading-snug line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-xs text-[#1c1410]/75 leading-relaxed font-sans line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-2 border-t border-[#ebe3d8]/80 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c69c40] group-hover:text-[#6b1e30] transition-colors">
            Read Story <ArrowRight className="h-3 w-3" />
          </span>
          <span className="text-[10px] text-[#1c1410]/50 font-sans font-medium">
            {post.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
