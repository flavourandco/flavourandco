"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, X, CheckCircle, EyeOff, Eye } from "lucide-react";
import { BlogPost } from "@/lib/types";
import { useBlogStore } from "@/store/blog.store";
import { useUIStore } from "@/store/ui.store";
import { formatCustomerError } from "@/lib/error-formatter";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { BoneyardTableSkeleton } from "@/components/ui/BoneyardSkeleton";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const setStoreBlogs = useBlogStore((s) => s.setPosts);
  const addToast = useUIStore((s) => s.addToast);

  // Modals State
  const [viewingBlog, setViewingBlog] = useState<BlogPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Confirmation state
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  // Form State (NO authorRole)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    writer: "Simran Gulati",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: "3 min read",
    category: "Food History",
    image: "https://example.com/image.jpg",
    image2: "",
    published: true,
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBlogs(json.data);
        setStoreBlogs(json.data);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setViewingBlog(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      writer: "Simran Gulati",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: "3 min read",
      category: "Food History",
      image: "https://example.com/image.jpg",
      image2: "",
      published: true,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditFromView = (blog: BlogPost) => {
    setViewingBlog(null);
    handleOpenEdit(blog);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content.join("\n\n"),
      writer: blog.writer,
      date: blog.date,
      readTime: blog.readTime,
      category: blog.category,
      image: blog.image,
      image2: blog.image2 || "",
      published: blog.published ?? true,
    });
    setIsEditModalOpen(true);
  };

  const handleAttemptCloseEdit = () => {
    setShowDiscardConfirm(true);
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    setIsEditModalOpen(false);
    setEditingBlog(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBlogId) return;
    const id = deletingBlogId;
    setDeletingBlogId(null);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setBlogs((prev) => {
          const updated = prev.filter((b) => b.id !== id);
          setStoreBlogs(updated);
          return updated;
        });
        addToast("Blog article deleted.", "info");
      } else {
        addToast(formatCustomerError(json.error), "error");
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        content: formData.content.split("\n\n").filter(Boolean),
      };

      if (editingBlog) {
        const res = await fetch(`/api/blogs/${editingBlog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setIsEditModalOpen(false);
          fetchBlogs();
          addToast("Blog article updated successfully!", "success");
        } else {
          addToast(formatCustomerError(json.error), "error");
        }
      } else {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setIsEditModalOpen(false);
          fetchBlogs();
          addToast("New blog article published!", "success");
        } else {
          addToast(formatCustomerError(json.error), "error");
        }
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.writer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Journal &amp; Blog Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage articles, heritage stories, and publishing status.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-all shadow-2xs cursor-pointer border border-slate-800 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-sm border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <BoneyardTableSkeleton rows={5} columns={6} />
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">No blog articles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded-sm overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">
                          <Image src={b.image} alt={b.title} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-xs">{b.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Slug: {b.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{b.category}</td>
                    <td className="py-3 px-4 text-slate-800 font-semibold">{b.writer}</td>
                    <td className="py-3 px-4 text-slate-500">{b.date}</td>
                    <td className="py-3 px-4">
                      {b.published ?? true ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">
                          <CheckCircle className="w-2.5 h-2.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
                          <EyeOff className="w-2.5 h-2.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {/* VIEW BUTTON */}
                        <button
                          onClick={() => setViewingBlog(b)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm border border-slate-200/80 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-slate-500" /> View
                        </button>
                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => setDeletingBlogId(b.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-sm border border-rose-200/80 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
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

      {/* VIEW MODAL (FIXED BIGGER SHAPE & 100% COMPLETE SCROLLING) */}
      {viewingBlog && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="bg-white w-full max-w-4xl lg:max-w-5xl max-h-[88vh] sm:max-h-[85vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Article View</span>
                <h2 className="text-base font-bold text-slate-900">{viewingBlog.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditFromView(viewingBlog)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Article</span>
                </button>
                <button onClick={() => setViewingBlog(null)} className="p-1 text-slate-400 hover:text-slate-800 rounded-sm cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 text-xs text-slate-700 overscroll-contain" data-lenis-prevent>
              <div className="relative w-full h-64 sm:h-80 rounded-sm overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <Image src={viewingBlog.image} alt={viewingBlog.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" />
              </div>
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Written by {viewingBlog.writer}</p>
                  <p className="text-slate-500 text-[11px]">{viewingBlog.date} • Category: <span className="font-semibold text-slate-700">{viewingBlog.category}</span></p>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-semibold rounded-sm text-[11px]">
                  {viewingBlog.readTime}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Excerpt / Summary</h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-sm border border-slate-200/80 leading-relaxed font-sans text-xs sm:text-sm">{viewingBlog.excerpt}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Article Content</h4>
                <div className="space-y-4 text-slate-800 leading-relaxed font-serif text-sm sm:text-base">
                  {viewingBlog.content.map((paragraph, idx) => (
                    <div key={idx} className="bg-slate-50/80 p-4 sm:p-5 rounded-sm border border-slate-200/60 leading-relaxed">
                      {paragraph}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL (FIXED BIGGER SHAPE & STABLE UI) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="bg-white w-full max-w-4xl lg:max-w-5xl max-h-[88vh] sm:max-h-[85vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingBlog ? `Edit Article — ${editingBlog.title}` : "New Blog Article"}
                </h2>
                <p className="text-[11px] text-slate-500">Configure article content, imagery, and author attribution.</p>
              </div>
              <button onClick={handleAttemptCloseEdit} className="p-1 rounded-sm text-slate-400 hover:text-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-5 overscroll-contain" data-lenis-prevent>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">* Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Slug / URL Key</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={formData.writer}
                      onChange={(e) => setFormData({ ...formData, writer: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Publication Date</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Cover Image URL / Path</label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Excerpt Summary</label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Article Body Content (Double enter for paragraphs)</label>
                  <textarea
                    rows={10}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Publish Article</p>
                    <p className="text-[11px] text-slate-500">Make this blog post visible to public visitors.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAttemptCloseEdit}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-sm cursor-pointer shadow-xs"
                >
                  {editingBlog ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR DISCARDING UNSAVED CHANGES */}
      <AdminConfirmModal
        isOpen={showDiscardConfirm}
        title="Discard Unsaved Changes?"
        message="Are you sure you want to cancel? Any unsaved edits will be lost."
        confirmText="Yes, Discard"
        cancelText="Keep Editing"
        variant="warning"
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
      />

      {/* CONFIRMATION DIALOG FOR DELETION */}
      <AdminConfirmModal
        isOpen={Boolean(deletingBlogId)}
        title="Confirm Article Deletion"
        message="Are you sure you want to delete this article? It will be permanently removed from Supabase."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingBlogId(null)}
      />
    </div>
  );
}
