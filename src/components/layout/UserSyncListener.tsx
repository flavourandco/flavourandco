"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/store/auth.store";

export default function UserSyncListener() {
  const { user, isSignedIn, isLoaded } = useUser();
  const syncedRef = useRef(false);
  const setProfile = useAuthStore((state) => state.setProfile);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!isLoaded) return;

    // On Logout: clear auth store and remove persisted auth storage
    if (!isSignedIn || !user?.id) {
      if (syncedRef.current || useAuthStore.getState().isAuthenticated) {
        syncedRef.current = false;
        clearAuth();
      }
      return;
    }

    if (syncedRef.current) return;
    syncedRef.current = true;

    // Sync once with backend & populate Zustand auth store
    fetch("/api/auth/sync-user", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setProfile({
            id: data.user.id || user.id,
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || data.user.email || "",
            fullName: user.fullName || data.user.fullName || "Valued Customer",
            role: data.user.role === "admin" ? "admin" : "customer",
            createdAt: data.user.createdAt,
          });
        } else {
          setProfile({
            id: user.id,
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            fullName: user.fullName || "Valued Customer",
            role: "customer",
          });
        }
      })
      .catch((err) => {
        console.error("Auto user sync error:", err);
        // Fallback profile from Clerk
        setProfile({
          id: user.id,
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          fullName: user.fullName || "Valued Customer",
          role: "customer",
        });
      });
  }, [isLoaded, isSignedIn, user?.id, setProfile, clearAuth]);

  return null;
}
