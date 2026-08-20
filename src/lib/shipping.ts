/**
 * Shipping and Delivery Helper Utilities for Flavour & Co.
 *
 * Policy:
 * - Direct delivery nationwide across all Australian states and territories.
 * - Dynamic Free Delivery evaluated on customer postcode (Free delivery for selective postcodes or orders >= $200).
 * - Standard Express Delivery fee ($15.00) applies otherwise.
 */

/**
 * Backend list of postcodes eligible for Free Delivery.
 * (Not published on public marketing copy as per policy).
 */
export const FREE_DELIVERY_POSTCODES = new Set([
  "2762",
  "2155",
  "2153",
  "2158",
  "2768",
  "2148",
  "2761",
  "2765",
  "2769",
  "2154",
]);

/**
 * Australian States and Territories
 */
export const AUSTRALIAN_STATES = [
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "WA", name: "Western Australia" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NT", name: "Northern Territory" },
];

/**
 * Checks if a given postcode is eligible for Free Delivery.
 */
export function isFreeDeliveryPostcode(postcode?: string | number | null): boolean {
  if (!postcode) return false;
  const clean = String(postcode).trim();
  return FREE_DELIVERY_POSTCODES.has(clean);
}

/**
 * Calculates delivery fee based on subtotal and customer postcode.
 * - Subtotal $0 -> $0 fee
 * - Subtotal >= $200 -> Free delivery ($0 fee)
 * - Postcode in Free Delivery list -> Free delivery ($0 fee)
 * - Otherwise standard express delivery fee ($15.00)
 */
export function calculateShippingFee(
  subtotal: number,
  postcode?: string | number | null
): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= 200) return 0;
  if (isFreeDeliveryPostcode(postcode)) return 0;
  return 15;
}

/**
 * Validates whether a postcode is a valid 4-digit Australian postcode.
 */
export function isValidAustralianPostcode(postcode?: string | number | null): boolean {
  if (!postcode) return false;
  const clean = String(postcode).trim();
  return /^\d{4}$/.test(clean);
}

// Backward compatibility alias (now returns true for valid Australian addresses)
export function isSydneyDeliveryPostcode(postcode: string | number, state?: string): boolean {
  return isValidAustralianPostcode(postcode);
}

export const DELIVERY_PROMISE_NOTICE =
  "Handcrafted gourmet pies delivered direct to your door with temperature-controlled packaging.";

