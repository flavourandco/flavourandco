import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "@/lib/types";

export type { UserProfile };

interface AuthState {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setProfile: (profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,

      setProfile: (profile: UserProfile) =>
        set({
          userProfile: profile,
          isAuthenticated: true,
          isLoading: false,
        }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      clearAuth: () => {
        set({
          userProfile: null,
          isAuthenticated: false,
          isLoading: false,
        });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "flavour_auth_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

