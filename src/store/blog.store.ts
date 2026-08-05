import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BlogPost } from "@/lib/types";
import { blogPosts as fallbackBlogs } from "@/lib/data";

interface BlogState {
  posts: BlogPost[];
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  postsPerPage: number;
  isFetching: boolean;
  lastFetchedAt: number | null;

  setPosts: (posts: BlogPost[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  fetchBlogs: (force?: boolean) => Promise<void>;
  getFilteredPosts: () => BlogPost[];
  getPaginatedPosts: () => BlogPost[];
  getTotalPages: () => number;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      posts: fallbackBlogs as BlogPost[],
      searchQuery: "",
      selectedCategory: "all",
      currentPage: 1,
      postsPerPage: 12,
      isFetching: false,
      lastFetchedAt: null,

      setPosts: (posts: BlogPost[]) => set({ posts, lastFetchedAt: Date.now() }),

      setSearchQuery: (searchQuery: string) => set({ searchQuery, currentPage: 1 }),

      setSelectedCategory: (selectedCategory: string) =>
        set({ selectedCategory, currentPage: 1 }),

      setCurrentPage: (currentPage: number) => set({ currentPage }),

      fetchBlogs: async (force = false) => {
        const { lastFetchedAt, isFetching } = get();
        const TEN_MINUTES = 10 * 60 * 1000;

        if (isFetching) return;
        if (!force && lastFetchedAt && Date.now() - lastFetchedAt < TEN_MINUTES) {
          return;
        }

        set({ isFetching: true });
        try {
          const res = await fetch("/api/blogs");
          if (res.ok) {
            const resData = await res.json();
            const items = Array.isArray(resData) ? resData : (Array.isArray(resData?.data) ? resData.data : []);
            if (items.length > 0) {
              set({ posts: items, lastFetchedAt: Date.now() });
            }
          }
        } catch (error) {
          console.warn("Blog revalidation background error, using cached blog posts:", error);
        } finally {
          set({ isFetching: false });
        }
      },

      getFilteredPosts: () => {
        const { posts, searchQuery, selectedCategory } = get();
        let filtered = [...posts];

        if (selectedCategory && selectedCategory !== "all") {
          filtered = filtered.filter((p) => p.category === selectedCategory);
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.excerpt.toLowerCase().includes(q) ||
              p.writer.toLowerCase().includes(q)
          );
        }

        return filtered;
      },

      getPaginatedPosts: () => {
        const filtered = get().getFilteredPosts();
        const { currentPage, postsPerPage } = get();
        const startIndex = (currentPage - 1) * postsPerPage;
        return filtered.slice(startIndex, startIndex + postsPerPage);
      },

      getTotalPages: () => {
        const filtered = get().getFilteredPosts();
        const { postsPerPage } = get();
        return Math.ceil(filtered.length / postsPerPage) || 1;
      },
    }),
    {
      name: "flavour_blog_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        posts: state.posts,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);
