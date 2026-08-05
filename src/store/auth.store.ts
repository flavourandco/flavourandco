import { create } from "zustand";
import type { UserProfile } from "@/lib/types";

export type { UserProfile };

interface AuthState {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setProfile: (profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  userProfile: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  setProfile: (profile: UserProfile) =>
    set({
      userProfile: profile,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  clearAuth: () => {
    set({
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    });
  },
}));


