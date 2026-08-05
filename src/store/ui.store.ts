import { create } from "zustand";
import { toast } from "react-hot-toast";

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface UIState {
  mobileNavOpen: boolean;
  searchModalOpen: boolean;
  offerModalOpen: boolean;
  toasts: ToastNotification[];

  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setSearchModalOpen: (open: boolean) => void;
  toggleSearchModal: () => void;
  setOfferModalOpen: (open: boolean) => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  searchModalOpen: false,
  offerModalOpen: false,
  toasts: [],

  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),

  setSearchModalOpen: (searchModalOpen) => set({ searchModalOpen }),
  toggleSearchModal: () => set((state) => ({ searchModalOpen: !state.searchModalOpen })),

  setOfferModalOpen: (offerModalOpen) => set({ offerModalOpen }),

  addToast: (message, type = "info") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  },

  removeToast: (id) => {
    toast.dismiss(id);
  },
}));
