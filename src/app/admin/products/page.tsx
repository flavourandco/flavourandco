"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, X, Tag, Eye, ChevronUp, ChevronDown, Check } from "lucide-react";
import { Product, ProductVariant, WhyStandOutPoint } from "@/lib/types";
import { useProductStore } from "@/store/product.store";
import { useUIStore } from "@/store/ui.store";
import { formatCustomerError } from "@/lib/error-formatter";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { BoneyardTableSkeleton } from "@/components/ui/BoneyardSkeleton";
import { MediaUploader } from "@/components/ui/MediaUploader";
import { useStagedMedia } from "@/hooks/useStagedMedia";
import { RefreshCw } from "lucide-react";
import { notifyContentUpdated } from "@/lib/realtime";

type TabType = "basic" | "media" | "variants" | "highlights" | "flags";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const stagedMedia = useStagedMedia({ multiple: true, maxFiles: 10 });

  const setStoreProducts = useProductStore((s) => s.setProducts);
  const addToast = useUIStore((s) => s.addToast);

  // Modal states
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Variant editing & reordering state
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [editVariantName, setEditVariantName] = useState("");
  const [editVariantPrice, setEditVariantPrice] = useState<number>(0);

  // Highlights editing & reordering state
  const [editingWhyIndex, setEditingWhyIndex] = useState<number | null>(null);
  const [editWhyTitle, setEditWhyTitle] = useState("");
  const [editWhyDesc, setEditWhyDesc] = useState("");

  // Product Specs / Details editing & reordering state
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
  const [editDetailText, setEditDetailText] = useState("");

  // Item deletion confirmation state
  const [deletingVariantIndex, setDeletingVariantIndex] = useState<number | null>(null);
  const [deletingWhyIndex, setDeletingWhyIndex] = useState<number | null>(null);
  const [deletingDetailIndex, setDeletingDetailIndex] = useState<number | null>(null);

  const handleConfirmDeleteVariant = () => {
    if (deletingVariantIndex !== null) {
      removeVariant(deletingVariantIndex);
      setDeletingVariantIndex(null);
    }
  };

  const handleConfirmDeleteWhy = () => {
    if (deletingWhyIndex !== null) {
      removeWhyPoint(deletingWhyIndex);
      setDeletingWhyIndex(null);
    }
  };

  const handleConfirmDeleteDetail = () => {
    if (deletingDetailIndex !== null) {
      removeDetailPoint(deletingDetailIndex);
      setDeletingDetailIndex(null);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
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
    stagedMedia.setInitialMedia([]);
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
    const existingImgs = product.images && product.images.length > 0 ? product.images : [product.image];
    stagedMedia.setInitialMedia(existingImgs);
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
      images: existingImgs,
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
        useProductStore.getState().fetchProducts(true);
        notifyContentUpdated("products");
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
    setIsSubmitting(true);
    try {
      let finalImages: string[] = formData.images;

      // Publish staged local media to Cloudinary before saving database record
      if (stagedMedia.hasLocalFiles) {
        const { urls } = await stagedMedia.publishMedia();
        finalImages = urls;
      } else if (stagedMedia.stagedItems.length > 0) {
        finalImages = stagedMedia.stagedItems
          .map((item) => (item.source === "remote" ? item.url : ""))
          .filter(Boolean);
      }

      const primaryImage = finalImages[0] || formData.image || "https://example.com/image.jpg";

      const payload = {
        ...formData,
        image: primaryImage,
        images: finalImages.length > 0 ? finalImages : [primaryImage],
      };

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setIsEditModalOpen(false);
          await useProductStore.getState().fetchProducts(true);
          notifyContentUpdated("products");
          fetchProducts();
          addToast("Product updated successfully!", "success");
        } else {
          addToast(formatCustomerError(json.error), "error");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setIsEditModalOpen(false);
          await useProductStore.getState().fetchProducts(true);
          notifyContentUpdated("products");
          fetchProducts();
          addToast("New product created successfully!", "success");
        } else {
          addToast(formatCustomerError(json.error), "error");
        }
      }
    } catch (err) {
      addToast(formatCustomerError(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variant helpers
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

  const removeVariant = (index: number) => {
    setFormData((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    if (editingVariantIndex === index) setEditingVariantIndex(null);
  };

  const startEditVariant = (index: number) => {
    const v = formData.variants[index];
    if (!v) return;
    setEditingVariantIndex(index);
    setEditVariantName(v.name);
    setEditVariantPrice(v.price);
  };

  const saveEditVariant = (index: number) => {
    if (!editVariantName.trim()) return;
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { name: editVariantName.trim(), price: Number(editVariantPrice) };
      return { ...prev, variants: updated };
    });
    setEditingVariantIndex(null);
  };

  const moveVariantUp = (index: number) => {
    if (index <= 0) return;
    setFormData((prev) => {
      const updated = [...prev.variants];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return { ...prev, variants: updated };
    });
  };

  const moveVariantDown = (index: number) => {
    if (index >= formData.variants.length - 1) return;
    setFormData((prev) => {
      const updated = [...prev.variants];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return { ...prev, variants: updated };
    });
  };

  // Highlights helpers
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
    if (editingWhyIndex === index) setEditingWhyIndex(null);
  };

  const startEditWhyPoint = (index: number) => {
    const pt = formData.whyStandOut[index];
    if (!pt) return;
    setEditingWhyIndex(index);
    setEditWhyTitle(pt.title);
    setEditWhyDesc(pt.text);
  };

  const saveEditWhyPoint = (index: number) => {
    if (!editWhyTitle.trim()) return;
    setFormData((prev) => {
      const updated = [...prev.whyStandOut];
      updated[index] = { title: editWhyTitle.trim(), text: editWhyDesc.trim() };
      return { ...prev, whyStandOut: updated };
    });
    setEditingWhyIndex(null);
  };

  const moveWhyPointUp = (index: number) => {
    if (index <= 0) return;
    setFormData((prev) => {
      const updated = [...prev.whyStandOut];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return { ...prev, whyStandOut: updated };
    });
  };

  const moveWhyPointDown = (index: number) => {
    if (index >= formData.whyStandOut.length - 1) return;
    setFormData((prev) => {
      const updated = [...prev.whyStandOut];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return { ...prev, whyStandOut: updated };
    });
  };

  // Specs / Details helpers
  const addDetailPoint = () => {
    if (!newDetailInput.trim()) return;
    setFormData((prev) => ({ ...prev, productDetails: [...(prev.productDetails || []), newDetailInput.trim()] }));
    setNewDetailInput("");
  };

  const removeDetailPoint = (index: number) => {
    setFormData((prev) => ({ ...prev, productDetails: (prev.productDetails || []).filter((_, i) => i !== index) }));
    if (editingDetailIndex === index) setEditingDetailIndex(null);
  };

  const startEditDetailPoint = (index: number) => {
    const text = (formData.productDetails || [])[index];
    if (text === undefined) return;
    setEditingDetailIndex(index);
    setEditDetailText(text);
  };

  const saveEditDetailPoint = (index: number) => {
    if (!editDetailText.trim()) return;
    setFormData((prev) => {
      const updated = [...(prev.productDetails || [])];
      updated[index] = editDetailText.trim();
      return { ...prev, productDetails: updated };
    });
    setEditingDetailIndex(null);
  };

  const moveDetailUp = (index: number) => {
    if (index <= 0) return;
    setFormData((prev) => {
      const updated = [...(prev.productDetails || [])];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return { ...prev, productDetails: updated };
    });
  };

  const moveDetailDown = (index: number) => {
    if (index >= (formData.productDetails || []).length - 1) return;
    setFormData((prev) => {
      const updated = [...(prev.productDetails || [])];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return { ...prev, productDetails: updated };
    });
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
          <div className="bg-white w-full max-w-5xl xl:max-w-6xl w-[95vw] h-[85vh] sm:h-[85vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
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
                  {viewingProduct.tagline && (
                    <p className="text-amber-900 font-serif italic text-xs font-medium">&ldquo;{viewingProduct.tagline}&rdquo;</p>
                  )}
                  {viewingProduct.shortDescription && (
                    <p className="text-slate-600 text-xs leading-relaxed">{viewingProduct.shortDescription}</p>
                  )}
                  <div className="pt-2 flex items-center gap-4 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">PRICE</span>
                      <span className="font-extrabold text-lg text-slate-900">${viewingProduct.price.toFixed(2)} AUD</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">SERVINGS / PACK</span>
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
                        <span className="font-extrabold text-slate-900 text-xs">${v.price.toFixed(2)} AUD</span>
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

              {viewingProduct.productDetails && viewingProduct.productDetails.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Key Features &amp; Specifications</h4>
                  <div className="space-y-1">
                    {viewingProduct.productDetails.map((detail, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm text-xs font-medium text-slate-800">
                        {detail}
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
          <div className="bg-white w-full max-w-5xl xl:max-w-6xl w-[95vw] h-[85vh] sm:h-[85vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingProduct ? `Edit Product — ${editingProduct.name}` : "Create New Product"}
                </h2>
                <p className="text-[11px] text-slate-500">Configure database attributes, pricing, tagline, short description, media, and features.</p>
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
                    {/* Row 1: Product ID/Slug & Product Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">* Slug</label>
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

                    {/* Row 2: Tagline */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder='e.g. Tender chicken in a rich, aromatic tomato and butter gravy encased in flaky pastry'
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-serif italic text-amber-950"
                      />
                    </div>

                    {/* Row 3: Category, Base Price, Servings & Pack Info, Badge Tag */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                        <label className="block text-xs font-bold text-slate-700 mb-1">* Base Price ($ AUD)</label>
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
                        <label className="block text-xs font-bold text-slate-700 mb-1">Servings &amp; Pack Info</label>
                        <input
                          type="text"
                          value={formData.packInfo}
                          onChange={(e) => setFormData({ ...formData, packInfo: e.target.value })}
                          placeholder="e.g. Pack of 12 (12 Servings)"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={formData.badge}
                          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                          placeholder="e.g. Best Seller, Chef Special"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    {/* Row 4: Short Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        placeholder="e.g. Delicious handcrafted 12-pack gourmet pies delivered temperature-controlled directly to your door Sydney-wide."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    {/* Row 5: Full Product Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Detailed Description</label>
                      <textarea
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed product story, ingredient craftsmanship, heating notes, and description..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Product Media Gallery</label>
                    <MediaUploader
                      stagedMedia={stagedMedia}
                      multiple={true}
                      maxFiles={10}
                      label="Upload Product Images"
                      helperText="Local preview displayed immediately in 4:3 aspect ratio matching product view. Multiple images supported per product."
                      aspectRatioClassName="aspect-[4/3] w-full"
                    />
                  </div>
                )}

                {activeTab === "variants" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Add Product Variant</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newVariantName}
                          onChange={(e) => setNewVariantName(e.target.value)}
                          placeholder="Variant Name (e.g. Pack of 6)"
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={newVariantPrice}
                          onChange={(e) => setNewVariantPrice(parseFloat(e.target.value) || 0)}
                          placeholder="Price ($ AUD)"
                          className="w-32 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                        />
                        <button type="button" onClick={addVariant} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-sm cursor-pointer hover:bg-black transition-colors flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Variant</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Configured Variants ({formData.variants.length})</label>
                      </div>

                      {formData.variants.length === 0 ? (
                        <p className="text-xs text-slate-400 italic p-3 bg-slate-50 border border-slate-200 rounded-sm">No variants added yet. Default product price will be used.</p>
                      ) : (
                        <div className="space-y-2">
                          {formData.variants.map((v, i) => (
                            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs flex items-center justify-between gap-3">
                              {editingVariantIndex === i ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={editVariantName}
                                    onChange={(e) => setEditVariantName(e.target.value)}
                                    className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-sm font-semibold"
                                  />
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={editVariantPrice}
                                    onChange={(e) => setEditVariantPrice(parseFloat(e.target.value) || 0)}
                                    className="w-24 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-sm font-bold"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => saveEditVariant(i)}
                                    className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm cursor-pointer"
                                    title="Save Variant"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingVariantIndex(null)}
                                    className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-sm cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="font-bold text-slate-800 text-xs flex-1">
                                    {v.name} &mdash; <span className="text-slate-900">${v.price.toFixed(2)} AUD</span>
                                  </span>

                                  <div className="flex items-center gap-1">
                                    {/* Edit & Delete Buttons */}
                                    <button
                                      type="button"
                                      onClick={() => startEditVariant(i)}
                                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-sm cursor-pointer"
                                      title="Edit Variant"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingVariantIndex(i)}
                                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-sm cursor-pointer"
                                      title="Remove Variant"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "highlights" && (
                  <div className="space-y-6">
                    {/* SECTION 1: HIGHLIGHTS & WHY STAND OUT POINTS */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-900">Highlights &amp; Why Stand Out ({formData.whyStandOut.length})</label>
                        <span className="text-[11px] text-slate-400">Use arrows to rearrange highlight order</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newWhyTitle}
                          onChange={(e) => setNewWhyTitle(e.target.value)}
                          placeholder="Highlight Title (e.g. Authentic Spice Blend)"
                          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900 font-semibold"
                        />
                        <input
                          type="text"
                          value={newWhyDesc}
                          onChange={(e) => setNewWhyDesc(e.target.value)}
                          placeholder="Description Text"
                          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <button type="button" onClick={addWhyPoint} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-sm cursor-pointer hover:bg-black transition-colors flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Highlight</span>
                      </button>

                      <div className="space-y-2 pt-2">
                        {formData.whyStandOut.length === 0 ? (
                          <p className="text-xs text-slate-400 italic p-3 bg-slate-50 border border-slate-200 rounded-sm">No highlights added yet.</p>
                        ) : (
                          formData.whyStandOut.map((pt, i) => (
                            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs flex items-start justify-between gap-3">
                              {editingWhyIndex === i ? (
                                <div className="space-y-2 flex-1">
                                  <input
                                    type="text"
                                    value={editWhyTitle}
                                    onChange={(e) => setEditWhyTitle(e.target.value)}
                                    placeholder="Highlight Title"
                                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-sm font-bold"
                                  />
                                  <textarea
                                    rows={2}
                                    value={editWhyDesc}
                                    onChange={(e) => setEditWhyDesc(e.target.value)}
                                    placeholder="Description Text"
                                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-sm"
                                  />
                                  <div className="flex items-center gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => saveEditWhyPoint(i)}
                                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm cursor-pointer flex items-center gap-1"
                                    >
                                      <Check className="w-3.5 h-3.5" /> Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingWhyIndex(null)}
                                      className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-sm cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="space-y-0.5 flex-1">
                                    <p className="font-bold text-slate-900 text-xs">{pt.title}</p>
                                    <p className="text-slate-600 text-[11px] leading-relaxed">{pt.text}</p>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Reorder Buttons */}
                                    <button
                                      type="button"
                                      disabled={i === 0}
                                      onClick={() => moveWhyPointUp(i)}
                                      className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Move Up"
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={i === formData.whyStandOut.length - 1}
                                      onClick={() => moveWhyPointDown(i)}
                                      className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Move Down"
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {/* Edit & Delete Buttons */}
                                    <button
                                      type="button"
                                      onClick={() => startEditWhyPoint(i)}
                                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-sm cursor-pointer ml-1"
                                      title="Edit Highlight"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingWhyIndex(i)}
                                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-sm cursor-pointer"
                                      title="Remove Highlight"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* SECTION 2: KEY PRODUCT DETAILS & SPECS */}
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-900">Key Features &amp; Specifications ({ (formData.productDetails || []).length })</label>
                        <span className="text-[11px] text-slate-400">Use arrows to rearrange specification order</span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newDetailInput}
                          onChange={(e) => setNewDetailInput(e.target.value)}
                          placeholder="Feature / Spec (e.g. Pastry: Flaky All-Butter Puff Pastry)"
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-slate-900"
                        />
                        <button type="button" onClick={addDetailPoint} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-sm cursor-pointer hover:bg-black transition-colors flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Spec</span>
                        </button>
                      </div>

                      <div className="space-y-2 pt-1">
                        {(formData.productDetails || []).length === 0 ? (
                          <p className="text-xs text-slate-400 italic p-3 bg-slate-50 border border-slate-200 rounded-sm">No key features added yet.</p>
                        ) : (
                          (formData.productDetails || []).map((detail, i) => (
                            <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm text-xs flex items-center justify-between gap-3">
                              {editingDetailIndex === i ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={editDetailText}
                                    onChange={(e) => setEditDetailText(e.target.value)}
                                    className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-sm font-medium"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => saveEditDetailPoint(i)}
                                    className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm cursor-pointer"
                                    title="Save Spec"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingDetailIndex(null)}
                                    className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-sm cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="font-semibold text-slate-800 text-xs flex-1">{detail}</span>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Reorder Buttons */}
                                    <button
                                      type="button"
                                      disabled={i === 0}
                                      onClick={() => moveDetailUp(i)}
                                      className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Move Up"
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={i === (formData.productDetails || []).length - 1}
                                      onClick={() => moveDetailDown(i)}
                                      className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Move Down"
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {/* Edit & Delete Buttons */}
                                    <button
                                      type="button"
                                      onClick={() => startEditDetailPoint(i)}
                                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-sm cursor-pointer ml-1"
                                      title="Edit Spec"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingDetailIndex(i)}
                                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-sm cursor-pointer"
                                      title="Remove Spec"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
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
                  disabled={isSubmitting || stagedMedia.isUploading}
                  onClick={handleAttemptCloseEdit}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || stagedMedia.isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-sm cursor-pointer shadow-xs disabled:opacity-75 transition-all"
                >
                  {isSubmitting || stagedMedia.isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>{stagedMedia.isUploading ? "Uploading Media..." : "Saving Product..."}</span>
                    </>
                  ) : editingProduct ? (
                    "Save Changes"
                  ) : (
                    "Create Product"
                  )}
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

      {/* CONFIRMATION DIALOG FOR VARIANT DELETION */}
      <AdminConfirmModal
        isOpen={deletingVariantIndex !== null}
        title="Confirm Variant Deletion"
        message={`Are you sure you want to delete variant "${deletingVariantIndex !== null ? formData.variants[deletingVariantIndex]?.name : ""}"?`}
        confirmText="Yes, Delete Variant"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteVariant}
        onCancel={() => setDeletingVariantIndex(null)}
      />

      {/* CONFIRMATION DIALOG FOR HIGHLIGHT DELETION */}
      <AdminConfirmModal
        isOpen={deletingWhyIndex !== null}
        title="Confirm Highlight Deletion"
        message={`Are you sure you want to delete highlight "${deletingWhyIndex !== null ? formData.whyStandOut[deletingWhyIndex]?.title : ""}"?`}
        confirmText="Yes, Delete Highlight"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteWhy}
        onCancel={() => setDeletingWhyIndex(null)}
      />

      {/* CONFIRMATION DIALOG FOR SPECIFICATION DELETION */}
      <AdminConfirmModal
        isOpen={deletingDetailIndex !== null}
        title="Confirm Specification Deletion"
        message={`Are you sure you want to delete specification "${deletingDetailIndex !== null ? (formData.productDetails || [])[deletingDetailIndex] : ""}"?`}
        confirmText="Yes, Delete Spec"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteDetail}
        onCancel={() => setDeletingDetailIndex(null)}
      />
    </div>
  );
}
