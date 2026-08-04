"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserSyncListener() {
  const { user, isSignedIn, isLoaded } = useUser();
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      if (syncedUserIdRef.current === user.id) return;
      syncedUserIdRef.current = user.id;

      fetch("/api/auth/sync-user", { method: "POST" }).catch((err) =>
        console.error("Auto user sync to Supabase failed:", err)
      );
    }
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}
