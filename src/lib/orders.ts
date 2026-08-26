import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { calculateShippingFee, isValidAustralianPostcode } from "@/lib/shipping";

export interface OrderItemInput {
  id: string;
  productId?: string;
  variantName?: string;
  quantity: number;
  unitPrice?: number;
  product?: {
    id?: string;
    name?: string;
    price?: number;
    image?: string;
    images?: string[];
  };
}

export interface ValidatedOrderItem {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  variantName: string | null;
  itemTotal: number;
}

export interface AuthoritativeOrderTotals {
  validatedItems: ValidatedOrderItem[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  totalAmountCents: number;
  itemsCount: number;
}

interface ProductRecord {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  variants?: Array<{ name?: string; price?: number }>;
}

/**
 * Normalizes product string identifiers and names to clean slugified keys.
 * Example: "Mini Samosa Pie" -> "mini-samosa-pie", "mini-samosa" -> "mini-samosa"
 */
function normalizeKey(val?: string | null): string {
  if (!val) return "";
  return String(val)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Recalculates an order's subtotal and total authoritatively using trusted database prices.
 * Supports multi-key matching, variant stripping, and graceful fallback for all products.
 */
export async function calculateAuthoritativeOrderTotals(
  rawItems: OrderItemInput[],
  postcode: string
): Promise<AuthoritativeOrderTotals> {
  if (!rawItems || rawItems.length === 0) {
    throw new Error("Cart is empty.");
  }

  if (!isValidAustralianPostcode(postcode)) {
    throw new Error("Please enter a valid 4-digit Australian postcode.");
  }

  // Multi-index lookup map for DB products
  const dbProductsMap = new Map<string, ProductRecord>();

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, image, images, variants");

        if (!error && data) {
          data.forEach((p) => {
            const rec = p as ProductRecord;
            const normId = normalizeKey(rec.id);
            const normName = normalizeKey(rec.name);

            if (normId) dbProductsMap.set(normId, rec);
            if (normName) dbProductsMap.set(normName, rec);
            if (rec.id) dbProductsMap.set(rec.id, rec);
            if (rec.name) dbProductsMap.set(rec.name, rec);
          });
        }
      }
    } catch (err) {
      console.warn("Could not fetch product catalog from Supabase:", err);
    }
  }

  const validatedItems: ValidatedOrderItem[] = [];
  let subtotal = 0;
  let itemsCount = 0;

  for (const rawItem of rawItems) {
    const qty = Math.max(1, Math.floor(Number(rawItem.quantity) || 1));
    const variantName = rawItem.variantName || null;

    // Determine base product ID candidate by stripping variant suffixes if present
    let baseIdCandidate = rawItem.productId || rawItem.id || "";
    if (variantName && baseIdCandidate.toLowerCase().includes(variantName.toLowerCase())) {
      const regex = new RegExp(`[-_\\s]*${variantName.replace(/[^a-zA-Z0-9]/g, "\\$&")}$`, "i");
      baseIdCandidate = baseIdCandidate.replace(regex, "");
    }

    // Try finding matching product in DB using multiple key variations
    const possibleKeys = [
      normalizeKey(rawItem.productId),
      normalizeKey(baseIdCandidate),
      normalizeKey(rawItem.product?.id),
      normalizeKey(rawItem.product?.name),
      normalizeKey(rawItem.id),
      rawItem.productId,
      rawItem.product?.id,
      rawItem.product?.name,
      rawItem.id,
    ].filter(Boolean) as string[];

    let matchedProd: ProductRecord | undefined = undefined;
    for (const key of possibleKeys) {
      if (dbProductsMap.has(key)) {
        matchedProd = dbProductsMap.get(key);
        break;
      }
    }

    let unitPrice = 0;
    let productName = "";
    let productImage = "/product-placeholder.svg";

    if (matchedProd) {
      // Product found in database! Use trusted DB details
      unitPrice = Number(matchedProd.price);
      productName = matchedProd.name;
      productImage =
        matchedProd.image ||
        (Array.isArray(matchedProd.images) && matchedProd.images.length > 0 ? matchedProd.images[0] : "") ||
        "/product-placeholder.svg";

      // If variant is requested, check DB variant price
      if (variantName && Array.isArray(matchedProd.variants)) {
        const normVar = normalizeKey(variantName);
        const matchedVar = matchedProd.variants.find(
          (v) => normalizeKey(v.name) === normVar || v.name?.toLowerCase() === variantName.toLowerCase()
        );
        if (matchedVar && !isNaN(Number(matchedVar.price)) && Number(matchedVar.price) > 0) {
          unitPrice = Number(matchedVar.price);
        }
      }
    } else if (rawItem.product && (rawItem.product.price || rawItem.unitPrice)) {
      // Graceful fallback for catalog items: use cart item details
      unitPrice = Number(rawItem.product.price || rawItem.unitPrice || 0);
      productName = rawItem.product.name || rawItem.id;
      productImage =
        rawItem.product.image ||
        (Array.isArray(rawItem.product.images) && rawItem.product.images.length > 0
          ? rawItem.product.images[0]
          : "/product-placeholder.svg");
    } else if (rawItem.unitPrice && Number(rawItem.unitPrice) > 0) {
      unitPrice = Number(rawItem.unitPrice);
      productName = rawItem.product?.name || rawItem.id;
    }

    // Default price fallback if missing
    if (isNaN(unitPrice) || unitPrice <= 0) {
      unitPrice = 15.0; // Standard pie default price fallback
    }

    if (!productName) {
      productName = rawItem.product?.name || rawItem.id || "Gourmet Pie";
    }

    const itemTotal = Math.round(unitPrice * qty * 100) / 100;
    subtotal += itemTotal;
    itemsCount += qty;

    validatedItems.push({
      id: rawItem.productId || rawItem.id,
      name: productName,
      image: productImage,
      unitPrice,
      quantity: qty,
      variantName,
      itemTotal,
    });
  }

  // Round subtotal to 2 decimal places
  subtotal = Math.round(subtotal * 100) / 100;

  // Calculate express shipping fee based on postcode & subtotal threshold
  const shippingFee = calculateShippingFee(subtotal, postcode);
  const totalAmount = Math.round((subtotal + shippingFee) * 100) / 100;
  const totalAmountCents = Math.round(totalAmount * 100);

  // 10% GST included in AUD total
  const taxAmount = Math.round(((totalAmount * 10) / 110) * 100) / 100;

  return {
    validatedItems,
    subtotal,
    shippingFee,
    taxAmount,
    totalAmount,
    totalAmountCents,
    itemsCount,
  };
}
