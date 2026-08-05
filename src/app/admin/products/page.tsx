"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, X, Tag, Eye } from "lucide-react";
import { Product, ProductVariant, WhyStandOutPoint } from "@/lib/types";
import { useProductStore } from "@/store/product.store";
import { useUIStore } from "@/store/ui.store";
import { formatCustomerError } from "@/lib/error-formatter";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { BoneyardTableSkeleton } from "@/components/ui/BoneyardSkeleton";

type TabType = "basic" | "media" | "variants" | "highlights" | "flags";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const setStoreProducts = useProductStore((s) => s.setProducts);
  const addToast = useUIStore((s) => s.addToast);

  // Modal states
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Confirmation Modals State
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    tagline: "",
    shortDescription: "",
    description: "",
    category: "frozen" as "freshly-baked" | "frozen" | "grazing-box",
    price: 34.99,
    packInfo: "Pack of 12",
    badge: "Best Seller",
    image: "https://example.com/image.jpg",
    images: ["https://example.com/image.jpg"],
    variants: [] as ProductVariant[],
    preparationOptions: [] as string[],
    whyStandOut: [] as WhyStandOutPoint[],
    productDetails: [] as string[],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
  });

  // Array input helpers
  const [newImageInput, setNewImageInput] = useState("");
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState<number>(0);
  const [newWhyTitle, setNewWhyTitle] = useState("");
  const [newWhyDesc, setNewWhyDesc] = useState("");
  const [newDetailInput, setNewDetailInput] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
        setStoreProducts(json.data);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setViewingProduct(null);
    setActiveTab("basic");
    setFormData({
      id: "",
      name: "",
      tagline: "",
      shortDescription: "",
      description: "",
      category: "frozen",
      price: 34.99,
      packInfo: "Pack of 12",
      badge: "Best Seller",
      image: "https://example.com/image.jpg",
      images: ["https://example.com/image.jpg"],
      variants: [],
      preparationOptions: ["Freshly Baked", "Frozen"],
      whyStandOut: [],
      productDetails: [],
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: false,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditFromView = (product: Product) => {
    setViewingProduct(null);
    handleOpenEdit(product);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setActiveTab("basic");
    setFormData({
      id: product.id,
      name: product.name,
      tagline: product.tagline || "",
      shortDescription: product.shortDescription,
      description: product.description,
      category: product.category,
      price: product.price,
      packInfo: product.packInfo,
      badge: product.badge || "",
      image: product.image,
      images: product.images && product.images.length > 0 ? product.images : [product.image],
      variants: product.variants || [],
      preparationOptions: product.preparationOptions || [],
      whyStandOut: product.whyStandOut || [],
      productDetails: product.productDetails || [],
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
    });
    setIsEditModalOpen(true);
  };

  const handleAttemptCloseEdit = () => {
    setShowDiscardConfirm(true);
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProductId) return;
    const id = deletingProductId;
    setDeletingProductId(null);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setProducts((prev) => {
          const updated = prev.filter((p) => p.id !== id);
          setStoreProducts(updated);
          return updated;
        });
        addToast("Product deleted successfully.", "info");
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
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setIsEditModalOpen(false);
          fetchProducts();
          addToast("Product updated successfully!", "success");
        } else {
          addToast(formatCustomerError(json.error), "error");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setIsEditModalOpen(false);
          fetchProducts();
          addToast("New product created successfully!", "success");
        } else {
          addToast(formatCustomerError(json.error), "error");
        }
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    }
  };

  // Helper additions
  const addVariant = () => {
    if (!newVariantName.trim()) return;
    const v: ProductVariant = {
      name: newVariantName.trim(),
      price: Number(newVariantPrice),
    };
    setFormData((prev) => ({ ...prev, variants: [...prev.variants, v] }));
    setNewVariantName("");
    setNewVariantPrice(0);
  };

  const removeVariant = (name: string) => {
    setFormData((prev) => ({ ...prev, variants: prev.variants.filter((v) => v.name !== name) }));
  };

  const addWhyPoint = () => {
    if (!newWhyTitle.trim()) return;
    const item: WhyStandOutPoint = {
      title: newWhyTitle.trim(),
      text: newWhyDesc.trim(),
    };
    setFormData((prev) => ({ ...prev, whyStandOut: [...prev.whyStandOut, item] }));
    setNewWhyTitle("");
    setNewWhyDesc("");
  };

  const removeWhyPoint = (index: number) => {
    setFormData((prev) => ({ ...prev, whyStandOut: prev.whyStandOut.filter((_, i) => i !== index) }));
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage pies, pricing, variants, and product specs.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-all shadow-2xs cursor-pointer border border-slate-800 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-sm border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {["all", "freshly-baked", "frozen", "grazing-box"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-sm capitalize transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Categories" : cat.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-sm border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <BoneyardTableSkeleton rows={5} columns={7} />
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price ($ AUD)</th>
                  <th className="py-3 px-4">Pack Info</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Flags</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize font-medium">{p.category.replace("-", " ")}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-600">{p.packInfo}</td>
                    <td className="py-3 px-4">
                      {p.badge ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-amber-50 text-amber-800 border border-amber-200/60 text-[10px] font-semibold">
                          <Tag className="w-2.5 h-2.5" /> {p.badge}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-sm border border-emerald-200/60">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 text-[9px] font-bold rounded-sm border border-sky-200/60">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {/* VIEW BUTTON (Row primary action) */}
                        <button
                          onClick={() => setViewingProduct(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm border border-slate-200/80 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-slate-500" /> View
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => setDeletingProductId(p.id)}
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

      {/* READ-ONLY VIEW MODAL (FIXED BIGGER SHAPE & STABLE RECTANGLE) */}
      {viewingProduct && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="bg-white w-full max-w-4xl lg:max-w-5xl max-h-[88vh] sm:max-h-[85vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            {/* View Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Product View</span>
                <h2 className="text-base font-bold text-slate-900">{viewingProduct.name}</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditFromView(viewingProduct)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>

                <button
                  onClick={() => setViewingProduct(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-sm cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View Details Scrollable Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 text-xs text-slate-700 overscroll-contain" data-lenis-prevent>
              <div className="flex flex-col sm:flex-row items-start gap-6 bg-slate-50 p-4 rounded-sm border border-slate-200/80">
                <div className="relative w-36 h-36 rounded-sm overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <Image src={viewingProduct.image} alt={viewingProduct.name} fill className="object-cover" sizes="144px" />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded-sm">{viewingProduct.category}</span>
                  <h3 className="font-bold text-lg text-slate-900">{viewingProduct.name}</h3>
                  <p className="text-slate-500 italic text-xs">{viewingProduct.tagline || "No tagline set"}</p>
                  <div className="pt-2 flex items-center gap-4 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">PRICE</span>
                      <span className="font-extrabold text-lg text-slate-900">${viewingProduct.price.toFixed(2)} AUD</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">PACKAGING</span>
                      <span className="font-semibold text-slate-800 text-xs">{viewingProduct.packInfo}</span>
                    </div>
                    {viewingProduct.badge && (
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">BADGE</span>
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200 text-[10px]">{viewingProduct.badge}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Full Description</h4>
                <p className="leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-sm border border-slate-200/80 font-sans text-xs sm:text-sm">{viewingProduct.description}</p>
              </div>

              {viewingProduct.variants && viewingProduct.variants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Available Variants</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {viewingProduct.variants.map((v, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs">{v.name}</span>
                        <span className="font-extrabold text-slate-900 text-xs">${v.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingProduct.whyStandOut && viewingProduct.whyStandOut.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Why They Stand Out</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {viewingProduct.whyStandOut.map((pt, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
                        <p className="font-bold text-slate-900 text-xs">{pt.title}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{pt.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD & EDIT PANEL (FIXED BIGGER SHAPE & STABLE UI FOR TABS) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="bg-white w-full max-w-4xl lg:max-w-5xl max-h-[88vh] sm:max-h-[85vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingProduct ? `Edit Product — ${editingProduct.name}` : "Create New Product"}
                </h2>
                <p className="text-[11px] text-slate-500">Configure database attributes, pricing, media, and features.</p>
              </div>
              <button
                onClick={handleAttemptCloseEdit}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TEXT-ONLY TABS HEADER (NO ICONS BESIDE TABS) */}
            <div className="flex items-center gap-1 px-6 bg-slate-100/70 border-b border-slate-200 overflow-x-auto shrink-0 select-none">
              {[
                { key: "basic", label: "Basic Info" },
                { key: "media", label: "Media & Images" },
                { key: "variants", label: "Variants & Options" },
                { key: "highlights", label: "Highlights & Specs" },
                { key: "flags", label: "Visibility & Flags" },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as TabType)}
                    className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "border-slate-900 text-slate-900 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 overscroll-contain" data-lenis-prevent>
                {activeTab === "basic" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">* Product ID / Slug</label>
                        <input
                          type="text"
                          required
                          disabled={Boolean(editingProduct)}
                          value={formData.id}
                          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                          placeholder="e.g. butter-chicken-pie"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-mono disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">* Product Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Authentic Butter Chicken Pie"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">* Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-medium"
                        >
                          <option value="frozen">Frozen</option>
                          <option value="freshly-baked">Freshly Baked</option>
                          <option value="grazing-box">Grazing Box</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">* Price ($ AUD)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pack Info</label>
                        <input
                          type="text"
                          value={formData.packInfo}
                          onChange={(e) => setFormData({ ...formData, packInfo: e.target.value })}
                          placeholder="e.g. Pack of 12"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Description</label>
                      <textarea
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed product story and description..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">* Primary Image URL / Path</label>
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-mono"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "variants" && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Variants</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newVariantName}
                        onChange={(e) => setNewVariantName(e.target.value)}
                        placeholder="Variant Name"
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm"
                      />
                      <input
                        type="number"
                        value={newVariantPrice}
                        onChange={(e) => setNewVariantPrice(parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                        className="w-28 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm"
                      />
                      <button type="button" onClick={addVariant} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-sm">Add</button>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {formData.variants.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-sm text-xs">
                          <span className="font-bold text-slate-800">{v.name} — ${v.price.toFixed(2)}</span>
                          <button type="button" onClick={() => removeVariant(v.name)} className="text-rose-600 font-bold hover:underline">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "highlights" && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Highlights &amp; Key Features</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={newWhyTitle} onChange={(e) => setNewWhyTitle(e.target.value)} placeholder="Highlight Title" className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm" />
                      <input type="text" value={newWhyDesc} onChange={(e) => setNewWhyDesc(e.target.value)} placeholder="Description Text" className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-sm" />
                    </div>
                    <button type="button" onClick={addWhyPoint} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-sm">Add Highlight</button>

                    <div className="space-y-2 pt-2">
                      {formData.whyStandOut.map((pt, i) => (
                        <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs flex items-start justify-between">
                          <div>
                            <p className="font-bold text-slate-900">{pt.title}</p>
                            <p className="text-slate-600 text-[11px]">{pt.text}</p>
                          </div>
                          <button type="button" onClick={() => removeWhyPoint(i)} className="text-rose-600 font-bold text-xs hover:underline">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "flags" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Featured Product</span>
                        <span className="text-[11px] text-slate-500">Showcase this pie on the homepage hero section.</span>
                      </div>
                      <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Best Seller Badge</span>
                        <span className="text-[11px] text-slate-500">Highlight this product with a Best Seller tag.</span>
                      </div>
                      <input type="checkbox" checked={formData.isBestSeller} onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAttemptCloseEdit}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-sm transition-colors cursor-pointer shadow-xs"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
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
        message="Are you sure you want to cancel? Any unsaved edits will be discarded."
        confirmText="Yes, Discard"
        cancelText="Keep Editing"
        variant="warning"
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
      />

      {/* CONFIRMATION DIALOG FOR DELETION */}
      <AdminConfirmModal
        isOpen={Boolean(deletingProductId)}
        title="Confirm Product Deletion"
        message="Are you sure you want to delete this product? This record will be permanently removed from Supabase."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProductId(null)}
      />
    </div>
  );
}
