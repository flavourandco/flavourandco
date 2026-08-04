"use client";

import React from "react";
import { BookOpenText, Plus, Search } from "lucide-react";

export default function BlogsPage() {
  const posts = [
    { id: 1, title: "The Secret to Layering Flaky Indo-Australian Pastry", date: "Aug 01, 2026", views: "1,240", author: "Simran" },
    { id: 2, title: "Mastering Spice Blends in Savory Pies", date: "Jul 28, 2026", views: "980", author: "Simran" },
    { id: 3, title: "Channel 7 Plate of Origin: Behind the Scenes", date: "Jul 15, 2026", views: "3,450", author: "Simran" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Blogs</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage published articles, recipes, and news.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-black shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>New Article</span>
        </button>
      </div>

      <div className="bg-white rounded-md border border-slate-200/80 p-5 space-y-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <th className="pb-2 pl-1">Article Title</th>
              <th className="pb-2">Author</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50">
                <td className="py-3 pl-1 font-bold text-slate-900">{post.title}</td>
                <td className="py-3">{post.author}</td>
                <td className="py-3 text-slate-500">{post.date}</td>
                <td className="py-3 font-semibold text-slate-900">{post.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
