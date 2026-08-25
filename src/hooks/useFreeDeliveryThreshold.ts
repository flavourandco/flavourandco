"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "flavour_free_delivery_threshold";
const SETTINGS_EVENT = "flavour_settings_updated";

export function dispatchSettingsUpdated(newThreshold: number) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, String(newThreshold));
    } catch {}
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { freeDeliveryThreshold: newThreshold } }));
  }
}

export function useFreeDeliveryThreshold(initialValue = 200) {
  const [threshold, setThreshold] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const num = Number(stored);
          if (!isNaN(num) && num >= 0) return num;
        }
      } catch {}
    }
    return initialValue;
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchThreshold() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const json = await res.json();
        if (isMounted && json.success && typeof json.freeDeliveryThreshold === "number") {
          setThreshold(json.freeDeliveryThreshold);
          try {
            localStorage.setItem(STORAGE_KEY, String(json.freeDeliveryThreshold));
          } catch {}
        }
      } catch (err) {
        console.error("Failed to fetch free delivery threshold:", err);
      }
    }

    fetchThreshold();

    function handleEvent(e: Event) {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.freeDeliveryThreshold === "number") {
        setThreshold(customEvent.detail.freeDeliveryThreshold);
      }
    }

    window.addEventListener(SETTINGS_EVENT, handleEvent);
    return () => {
      isMounted = false;
      window.removeEventListener(SETTINGS_EVENT, handleEvent);
    };
  }, []);

  return threshold;
}
