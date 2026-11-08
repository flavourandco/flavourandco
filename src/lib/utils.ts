import type { Product } from "@/lib/types";

/**
 * Custom product ordering utility for Flavour & Co.
 * Orders products according to client presentation priority:
 * 1. Mini Butter Chicken
 * 2. Mini Samosa
 * 3. Mini Lamb
 * 4. Individual Butter Chicken
 * 5. Individual Samosa
 * 6. Individual Lamb
 * 7. Grazing Box
 * 8. Achari Paneer
 * 9. Other menu items (Chicken Tikka Samosas, Paneer Empanadas, etc.)
 */
export function sortProductsByCustomOrder<T extends Product>(productsList: T[]): T[] {
  const desiredIdOrder = [
    "mini-authentic-butter-chicken", // 1. Mini butter chicken
    "mini-samosa",                    // 2. Mini samosa
    "mini-lamb-keema",               // 3. Mini lamb
    "authentic-butter-chicken",       // 4. Ind BC
    "100-vegetarian-samosa",          // 5. InD samosa
    "lamb-keema",                     // 6. Ind land lamb
    "grazing-box",                    // 7. Grazing
    "mini-achari-paneer-pie",         // 8. Achari paneer
    "chicken-tikka-samosa",           // 9. Chicken tikka samosas
    "paneer-empanada",                // 10. Paneer empanadas
    "mixed-individual-pack",          // 11. Mixed individual pack
  ];

  function getRank(p: T): number {
    const id = p.id;
    const name = p.name.toLowerCase();

    // 1. Direct ID match
    const directIdx = desiredIdOrder.indexOf(id);
    if (directIdx !== -1) return directIdx;

    // 2. Name-based fuzzy ranking fallback
    const isMini = name.includes("mini");
    const isIndividual = name.includes("individual") || name.includes("220g") || (!isMini && !name.includes("grazing"));

    if (name.includes("butter chicken") && isMini) return 0;
    if (name.includes("samosa") && isMini) return 1;
    if (name.includes("lamb") && isMini) return 2;

    if (name.includes("butter chicken") && isIndividual) return 3;
    if (name.includes("samosa") && isIndividual) return 4;
    if (name.includes("lamb") && isIndividual) return 5;

    if (name.includes("grazing")) return 6;
    if (name.includes("achari") || (name.includes("paneer") && name.includes("pie"))) return 7;
    if (name.includes("tikka")) return 8;
    if (name.includes("empanada")) return 9;
    if (name.includes("mixed")) return 10;

    return 99;
  }

  return [...productsList].sort((a, b) => getRank(a) - getRank(b));
}

/**
 * Resolves the display variant label for an order item.
 * Prioritizes customer-selected variant (e.g. "Freshly Baked", "Frozen", or specific pack).
 * Intelligently falls back if legacy or unassigned, avoiding generic "Standard" placeholders.
 */
export function resolveItemVariant(item?: {
  variant?: string | null;
  variantName?: string | null;
  name?: string | null;
  id?: string | null;
  product?: {
    category?: string | null;
    variants?: Array<{ name: string }>;
  } | null;
} | null): string {
  if (!item) return "Freshly Baked";
  const explicit = item.variantName || item.variant;
  if (explicit && typeof explicit === "string") {
    const trimmed = explicit.trim();
    if (
      trimmed &&
      trimmed.toLowerCase() !== "standard" &&
      trimmed.toLowerCase() !== "standard pack" &&
      trimmed.toLowerCase() !== "standard variant" &&
      trimmed.toLowerCase() !== "standard bakery order package"
    ) {
      return trimmed;
    }
  }

  // Check product metadata if attached
  if (item.product?.category === "freshly-baked") return "Freshly Baked";
  if (item.product?.category === "frozen") return "Frozen";
  if (item.product?.variants && item.product.variants.length > 0) {
    return item.product.variants[0].name;
  }

  // Fallback based on item name/id inspection
  const idOrName = `${item.id || ""} ${item.name || ""}`.toLowerCase();
  if (idOrName.includes("freshly-baked") || idOrName.includes("freshly baked") || idOrName.includes("fresh")) {
    return "Freshly Baked";
  }
  if (idOrName.includes("frozen")) {
    return "Frozen";
  }
  if (idOrName.includes("grazing")) {
    return "Freshly Baked";
  }

  // Default for Flavour & Co. artisanal pies
  return "Freshly Baked";
}
