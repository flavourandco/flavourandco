import { create } from "zustand";

export type AdminTab = "dashboard" | "orders" | "products" | "wholesale" | "reviews" | "users" | "blogs";

interface AdminState {
  activeTab: AdminTab;
  searchFilter: string;
  statusFilter: string;
  dateRange: "today" | "7days" | "30days" | "all";

  setActiveTab: (tab: AdminTab) => void;
  setSearchFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setDateRange: (range: "today" | "7days" | "30days" | "all") => void;
  resetFilters: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  activeTab: "dashboard",
  searchFilter: "",
  statusFilter: "all",
  dateRange: "7days",

  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchFilter: (searchFilter) => set({ searchFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setDateRange: (dateRange) => set({ dateRange }),

  resetFilters: () =>
    set({
      searchFilter: "",
      statusFilter: "all",
      dateRange: "7days",
    }),
}));
