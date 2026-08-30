/**
 * Shipping and Delivery Helper Utilities for Flavour & Co.
 *
 * Tier-Based Delivery System:
 * - Tier 1: Local Free Zone (10 Postcodes) -> Always $0.00 Free Delivery (regardless of order amount).
 * - Tier 2: Greater Sydney (~50km radius) -> Orders >= Free Delivery Threshold ($200 default) get $0.00 Free Delivery; otherwise $15.00 Standard Express.
 * - Tier 3: Outside 50km (Regional NSW & Interstate) -> Delivery not available currently.
 */

/**
 * Tier 1: List of local postcodes eligible for 100% Free Delivery on any order amount.
 */
export const FREE_DELIVERY_POSTCODES = new Set([
  "2762", // Schofields
  "2155", // Rouse Hill, Beaumont Hills
  "2153", // Baulkham Hills, Bella Vista, Winston Hills
  "2158", // Dural, Round Corner, Middle Dural
  "2768", // Stanhope Gardens, Parklea
  "2148", // Blacktown, Prospect, Marayong, Arndell Park
  "2761", // Glendenning, Colebee, Dean Park, Hassall Grove, Oakhurst, Plumpton
  "2765", // Riverstone, Vineyard, Box Hill, Nelson, Maraylya, Oakville, Berkshire Park, Marsden Park
  "2769", // The Ponds
  "2154", // Castle Hill
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
 * Validates whether a postcode is a valid 4-digit Australian postcode.
 */
export function isValidAustralianPostcode(postcode?: string | number | null): boolean {
  if (!postcode) return false;
  const clean = String(postcode).trim();
  return /^\d{4}$/.test(clean);
}

/**
 * Checks if a given postcode is in the Tier 1 Local Free Delivery list.
 */
export function isFreeDeliveryPostcode(postcode?: string | number | null): boolean {
  if (!postcode) return false;
  const clean = String(postcode).trim();
  return FREE_DELIVERY_POSTCODES.has(clean);
}

/**
 * Checks if a postcode falls within Greater Sydney (within ~50km radius).
 * Covers:
 * - 2000 - 2234: Sydney Metro, CBD, Inner West, East, North Shore, Northern Beaches, South, St George, Sutherland Shire, Parramatta
 * - 2745 - 2770: Western Sydney, Penrith, Blacktown, Hills District, Hawkesbury, St Marys
 * - 2555 - 2570: Macarthur, Camden, Campbelltown
 * - 2773, 2774: Lower Blue Mountains (Glenbrook, Blaxland)
 */
export function isSydney50KmPostcode(postcode?: string | number | null): boolean {
  if (!postcode) return false;
  const clean = String(postcode).trim();
  if (!/^\d{4}$/.test(clean)) return false;

  const num = parseInt(clean, 10);

  // Tier 1 Postcodes
  if (FREE_DELIVERY_POSTCODES.has(clean)) return true;

  // Range 1: Sydney Metro, North Shore, Northern Beaches, Inner West, South, Shire, Parramatta (2000 - 2234)
  if (num >= 2000 && num <= 2234) return true;

  // Range 2: Greater Western Sydney, Penrith, Blacktown, Hills & Hawkesbury (2745 - 2770)
  if (num >= 2745 && num <= 2770) return true;

  // Range 3: Macarthur, Campbelltown, Camden region (2555 - 2570)
  if (num >= 2555 && num <= 2570) return true;

  // Lower Blue Mountains (within 50km radius)
  if (num === 2773 || num === 2774) return true;

  return false;
}

/**
 * Alias for checking whether delivery service is available to a postcode.
 */
export function isDeliveryAvailable(postcode?: string | number | null): boolean {
  return isSydney50KmPostcode(postcode);
}

// Backward compatibility alias
export function isSydneyDeliveryPostcode(postcode: string | number, state?: string): boolean {
  return isSydney50KmPostcode(postcode);
}

export interface DeliveryQuote {
  isDeliverable: boolean;
  tier: 1 | 2 | 3;
  fee: number;
  freeDeliveryThreshold: number;
  message: string;
  isFree: boolean;
}

/**
 * Evaluates the full delivery quote and tier status for a given subtotal and postcode.
 */
export function getDeliveryQuote(
  subtotal: number,
  postcode?: string | number | null,
  freeDeliveryThreshold = 200
): DeliveryQuote {
  if (!postcode || !isValidAustralianPostcode(postcode)) {
    return {
      isDeliverable: false,
      tier: 3,
      fee: 15,
      freeDeliveryThreshold,
      message: "Please enter a valid 4-digit Australian postcode.",
      isFree: false,
    };
  }

  const cleanPostcode = String(postcode).trim();

  // Tier 1: Local Free Zone (Always Free)
  if (isFreeDeliveryPostcode(cleanPostcode)) {
    return {
      isDeliverable: true,
      tier: 1,
      fee: 0,
      freeDeliveryThreshold,
      message: `Free Local Delivery applied for postcode ${cleanPostcode}!`,
      isFree: true,
    };
  }

  // Tier 2: Greater Sydney (~50km)
  if (isSydney50KmPostcode(cleanPostcode)) {
    if (subtotal >= freeDeliveryThreshold) {
      return {
        isDeliverable: true,
        tier: 2,
        fee: 0,
        freeDeliveryThreshold,
        message: `Free Delivery applied for orders over A$${freeDeliveryThreshold}!`,
        isFree: true,
      };
    }

    const diff = Math.max(0, freeDeliveryThreshold - subtotal);
    return {
      isDeliverable: true,
      tier: 2,
      fee: 15,
      freeDeliveryThreshold,
      message:
        diff > 0
          ? `Standard Sydney Delivery (A$15.00). Add A$${diff.toFixed(2)} more for Free Delivery!`
          : `Standard Sydney Delivery (A$15.00)`,
      isFree: false,
    };
  }

  // Tier 3: Outside 50km Service Area
  return {
    isDeliverable: false,
    tier: 3,
    fee: 15,
    freeDeliveryThreshold,
    message: `Delivery is currently only available within Greater Sydney (up to 50km). We cannot deliver to postcode ${cleanPostcode} at this time.`,
    isFree: false,
  };
}

/**
 * Calculates delivery fee based on subtotal and customer postcode.
 * - Subtotal $0 -> $0 fee
 * - Tier 1 Postcode -> Free delivery ($0 fee)
 * - Subtotal >= freeDeliveryThreshold -> Free delivery ($0 fee)
 * - Outside 50km or Tier 2 < threshold -> standard delivery fee ($15.00)
 */
export function calculateShippingFee(
  subtotal: number,
  postcode?: string | number | null,
  freeDeliveryThreshold = 200
): number {
  if (subtotal <= 0) return 0;
  if (isFreeDeliveryPostcode(postcode)) return 0;
  if (subtotal >= freeDeliveryThreshold) return 0;
  return 15;
}

export const DELIVERY_PROMISE_NOTICE =
  "Handcrafted gourmet pies delivered direct to your door with temperature-controlled packaging across Greater Sydney.";
