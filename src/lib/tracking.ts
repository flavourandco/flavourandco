/**
 * Authoritative courier tracking URL generator.
 * Safe for both Client and Server environments.
 */

export function getTrackingUrl(
  trackingNumber?: string,
  courierName?: string,
  customUrl?: string
): string | undefined {
  if (customUrl && customUrl.trim() && !customUrl.includes("localhost") && !customUrl.includes("127.0.0.1")) {
    return customUrl.trim();
  }
  if (!trackingNumber || !trackingNumber.trim()) return undefined;

  const cleanNum = trackingNumber.trim();
  const courier = (courierName || "").toLowerCase();

  if (courier.includes("startrack")) {
    return `https://startrack.com.au/track/${cleanNum}`;
  }
  if (courier.includes("sendle")) {
    return `https://track.sendle.com/tracking?ref=${cleanNum}`;
  }
  if (courier.includes("dhl")) {
    return `https://www.dhl.com/au-en/home/tracking/tracking-express.html?submit=1&tracking-id=${cleanNum}`;
  }
  if (courier.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${cleanNum}`;
  }
  // Default to Australia Post live tracking portal
  return `https://auspost.com.au/mypost/track/#/details/${cleanNum}`;
}
