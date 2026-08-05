"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/store/auth.store";

export default function UserSyncListener() {
  const { user, isSignedIn, isLoaded } = useUser();
  const syncedRef = useRef(false);
  const setProfile = useAuthStore((state) => state.setProfile);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // While Clerk is loading, ensure Zustand store isLoading is true
    if (!isLoaded) {
      setLoading(true);
      return;
    }

    // On Logout or unauthenticated state: clear auth store & set loading to false
    if (!isSignedIn || !user?.id) {
      syncedRef.current = false;
      clearAuth();
      return;
    }

    if (syncedRef.current) return;
    syncedRef.current = true;

    // Set loading state while fetching user data from Supabase
    setLoading(true);

    // Sync once with backend & populate Zustand auth store
    fetch("/api/auth/sync-user", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const userRole =
          data?.user?.role ||
          (user.publicMetadata as { role?: string } | undefined)?.role ||
          "customer";

        if (data?.user) {
          setProfile({
            id: data.user.id || user.id,
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || data.user.email || "",
            fullName: data.user.name || data.user.fullName || user.fullName || "",
            role: userRole.toLowerCase() === "admin" ? "admin" : "customer",
            createdAt: data.user.created_at || data.user.createdAt,
            imageUrl: user.imageUrl || data.user.image_url || "",
          });
        } else {
          setProfile({
            id: user.id,
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            fullName: user.fullName || "",
            role: userRole.toLowerCase() === "admin" ? "admin" : "customer",
            imageUrl: user.imageUrl || "",
          });
        }
      })
      .catch((err) => {
        console.error("Auto user sync error:", err);
        // Fallback profile from Clerk
        const userRole = (user.publicMetadata as { role?: string } | undefined)?.role || "customer";
        setProfile({
          id: user.id,
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          fullName: user.fullName || "",
          role: userRole.toLowerCase() === "admin" ? "admin" : "customer",
          imageUrl: user.imageUrl || "",
        });
      });
  }, [isLoaded, isSignedIn, user?.id, user?.fullName, user?.primaryEmailAddress, user?.imageUrl, setProfile, clearAuth, setLoading]);

  return null;
}

