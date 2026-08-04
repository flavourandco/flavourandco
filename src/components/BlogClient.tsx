"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  summary: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "art-of-pastry",
    title: "The Art of Indo-Australian Pastry: Blending Spice with Tradition",
    date: "July 24, 2026",
    category: "Craft & Story",
    image: "/products/PHOTOS_Flavour&Co-1.jpg",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "behind-the-scenes-simran",
    title: "Behind the Scenes with Simran: From Home Kitchen to Channel 7",
    date: "July 18, 2026",
    category: "Founder Journey",
    image: "/founder/simran-kitchen.jpg",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.",
  },
  {
    id: "air-fryer-vs-oven-pies",
    title: "Air Fryer vs. Oven: How to Get the Crispiest Flaky Pastry Every Time",
    date: "July 10, 2026",
    category: "Kitchen Tips",
    image: "/products/PHOTOS_Flavour&Co-2.jpg",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  },
  {
    id: "ultimate-grazing-box-guide",
    title: "How to Build the Ultimate Grazing Box for Your Next Event",
    date: "June 28, 2026",
    category: "Entertaining",
    image: "/products/PHOTOS_Flavour&Co-3.jpg",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.",
  },
  {
    id: "quality-australian-meat",
    title: "Why Quality Local Australian Meat Makes All the Difference",
    date: "June 15, 2026",
    category: "Sourcing",
    image: "/products/PHOTOS_Flavour&Co-4.jpg",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  },
  {
    id: "wholesale-cafe-partnerships",
    title: "Wholesale Partnerships: Elevating Café Menus Across Australia",
    date: "June 02, 2026",
    category: "Foodservice",
    image: "/founder/simran-coloured.jpg",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora.",
  },
];

export default function BlogClient() {
  return (
    <div className="w-full bg-[#fdf8f3] text-[#1c1410] pb-8 sm:pb-12 md:pb-16">
      
      {/* Header Banner matching Meet Simran Typography */}
      <div className="w-full bg-[#07402b] py-12 sm:py-16 px-6 shadow-md text-center mb-10 sm:mb-14">
        <div className="mx-auto max-w-4xl">
          {/* Subtitle with Garnet Dot */}
          <div className="flex items-center gap-2.5 justify-center mb-2">
            <span className="h-2 w-2 rounded-full bg-[#6b1e30] shrink-0" />
            <p className="font-serif italic text-cream text-2xl sm:text-3xl font-normal">
              Flavour &amp; Co. Journal
            </p>
          </div>

          {/* Main Title in Gold with Garnet Period */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#c69c40] font-normal leading-[1.1] tracking-tight">
            Blog &amp; Insights<span className="text-[#6b1e30] font-bold">.</span>
          </h1>

          {/* Credentials / Sub-tag line with sharp Gold highlight background */}
          <div className="mt-4 inline-block bg-[#c69c40] rounded-none px-3.5 py-1.5 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] font-bold leading-none">
              <span className="text-[#6b1e30]">RECIPES</span>
              <span className="text-[#07402b] mx-2.5 text-sm">•</span>
              <span className="text-[#6b1e30]">HERITAGE &amp; INSIGHTS</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Desktop Grid Layout (Hidden on Mobile) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#ebe3d8] flex flex-col group hover:shadow-md transition-all duration-300"
            >
              {/* PC Placeholder Image (Using local pie images) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1200px) 50vw, 33vw"
                  quality={95}
                />
                <div className="absolute top-3 left-3 bg-[#6b1e30] text-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {post.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#1c1410]/60">
                    <Calendar className="h-3.5 w-3.5 text-[#c69c40]" />
                    <span>{post.date}</span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-[#1c1410] group-hover:text-[#6b1e30] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs text-[#1c1410]/75 leading-relaxed font-sans line-clamp-3 pt-1">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#ebe3d8]">
                  <Link
                    href={`/blog#${post.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c69c40] group-hover:text-[#6b1e30] transition-colors"
                  >
                    Continue Reading <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Horizontal Stacked List (Matching Reference Screenshot 4) */}
        <div className="block md:hidden divide-y divide-[#ebe3d8] border-y border-[#ebe3d8] bg-white rounded-xl shadow-xs overflow-hidden">
          {blogPosts.map((post) => (
            <article key={post.id} className="p-4 sm:p-5 flex items-start gap-4">
              {/* Circular / Rounded Compact Thumbnail Image */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-2 border-[#c69c40]/30 shadow-xs mt-1">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                  quality={95}
                />
              </div>

              {/* Right Side Content matching Screenshot 4 */}
              <div className="flex-1 min-w-0 space-y-1.5 text-left">
                <h2 className="font-serif text-sm sm:text-base font-bold text-[#6b1e30] leading-snug">
                  {post.title}
                </h2>
                
                <p className="text-xs text-[#1c1410]/75 leading-relaxed font-sans line-clamp-3">
                  {post.summary}
                </p>

                <div className="pt-1">
                  <Link
                    href={`/blog#${post.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c69c40] hover:text-[#6b1e30] underline underline-offset-2"
                  >
                    Continue Reading &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
