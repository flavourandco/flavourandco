import { create } from "zustand";

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
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
