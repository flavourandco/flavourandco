import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/types";
import { sortProductsByCustomOrder } from "@/lib/utils";
import { subscribeToRealtimeUpdates } from "@/lib/realtime";

interface ProductState {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: "featured" | "price-asc" | "price-desc" | "name";
  isFetching: boolean;
  lastFetchedAt: number | null;

  setProducts: (products: Product[]) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: "featured" | "price-asc" | "price-desc" | "name") => void;
  fetchProducts: (force?: boolean) => Promise<void>;
  getFilteredProducts: () => Product[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      selectedCategory: "all",
      searchQuery: "",
      sortBy: "featured",
      isFetching: false,
      lastFetchedAt: null,

      setProducts: (products: Product[]) =>
        set({ products: sortProductsByCustomOrder(products), lastFetchedAt: Date.now() }),

      setSelectedCategory: (selectedCategory: string) => set({ selectedCategory }),

      setSearchQuery: (searchQuery: string) => set({ searchQuery }),

      setSortBy: (sortBy: "featured" | "price-asc" | "price-desc" | "name") => set({ sortBy }),

      fetchProducts: async (force = false) => {
        const { products, lastFetchedAt, isFetching } = get();
        const FIVE_MINUTES = 5 * 60 * 1000;

        if (isFetching && !force) return;
        if (!force && products.length > 0 && lastFetchedAt && Date.now() - lastFetchedAt < FIVE_MINUTES) {
          return;
        }

        set({ isFetching: true });
        try {
          const url = force ? `/api/products?t=${Date.now()}` : "/api/products";
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const resData = await res.json();
            const items = Array.isArray(resData) ? resData : (Array.isArray(resData?.data) ? resData.data : []);
            set({ products: sortProductsByCustomOrder(items), lastFetchedAt: Date.now() });
          }
        } catch (error) {
          console.warn("Product revalidation error:", error);
        } finally {
          set({ isFetching: false });
        }
      },

      getFilteredProducts: () => {
        const { products, selectedCategory, searchQuery, sortBy } = get();

        let filtered = [...products];

        // 1. Category Filter
        if (selectedCategory && selectedCategory !== "all") {
          filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        // 2. Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
              (p.tagline && p.tagline.toLowerCase().includes(q))
          );
        }

        // 3. Sorting
        if (sortBy === "price-asc") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name") {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "featured") {
          filtered = sortProductsByCustomOrder(filtered);
        }

        return filtered;
      },
    }),
    {
      name: "flavour_product_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);

// Subscribe to real-time broadcasts in browser
if (typeof window !== "undefined") {
  subscribeToRealtimeUpdates((type) => {
    if (type === "products") {
      useProductStore.getState().fetchProducts(true);
    }
  });
}
