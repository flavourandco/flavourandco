"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserSyncListener() {
  const { user, isSignedIn, isLoaded } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id || syncedRef.current) return;

    const storageKey = `flavour_user_synced_${user.id}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(storageKey)) {
      syncedRef.current = true;
      return;
    }

    syncedRef.current = true;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, "true");
    }

    fetch("/api/auth/sync-user", { method: "POST" }).catch((err) =>
      console.error("Auto user sync error:", err)
    );
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}
