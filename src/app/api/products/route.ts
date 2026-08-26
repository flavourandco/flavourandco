import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { requireAdminApi } from "@/lib/auth";
import { sortProductsByCustomOrder } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          // Format database records to camelCase Product interface
          const formattedProducts: Product[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            tagline: item.tagline || "",
            shortDescription: item.short_description || "",
            description: item.description || "",
            whyStandOut: item.why_stand_out || [],
            productDetails: item.product_details || [],
            packInfo: item.pack_info || "Pack of 12",
            price: Number(item.price),
            image: item.image,
            images: item.images || [item.image, item.image],
            badge: item.badge || undefined,
            category: item.category,
            variants: item.variants || [],
            preparationOptions: item.preparation_options || [],
            isFeatured: Boolean(item.is_featured),
            isBestSeller: Boolean(item.is_best_seller),
            isNewArrival: Boolean(item.is_new_arrival),
          }));

          return NextResponse.json(
            { success: true, data: sortProductsByCustomOrder(formattedProducts) },
            { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
          );
        }
      }
    }

    return NextResponse.json({ success: true, data: [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  try {
    const body = await request.json();

    const {
      name,
      tagline,
      shortDescription,
      description,
      packInfo,
      price,
      image,
      images,
      badge,
      category,
      isFeatured,
      isBestSeller,
      isNewArrival,
    } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json({ success: false, error: "Valid product price is required" }, { status: 400 });
    }

    const id = body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProduct: Product = {
      id,
      name: name.trim(),
      tagline: tagline ? tagline.trim() : "",
      shortDescription: shortDescription ? shortDescription.trim() : "",
      description: description ? description.trim() : "",
      whyStandOut: Array.isArray(body.whyStandOut) ? body.whyStandOut : [],
      productDetails: Array.isArray(body.productDetails) ? body.productDetails : [],
      packInfo: packInfo ? packInfo.trim() : "Pack of 12",
      price: Number(price),
      image: image || "/product-placeholder.svg",
      images: Array.isArray(images) && images.length > 0 ? images : [image || "/product-placeholder.svg"],
      badge: badge ? badge.trim() : undefined,
      category: category || "frozen",
      variants: Array.isArray(body.variants) && body.variants.length > 0 ? body.variants : [{ name: packInfo || "Pack of 12", price: Number(price) }],
      preparationOptions: Array.isArray(body.preparationOptions) ? body.preparationOptions : [],
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival),
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error: dbError } = await supabase.from("products").insert([
          {
            id: newProduct.id,
            name: newProduct.name,
            tagline: newProduct.tagline,
            short_description: newProduct.shortDescription,
            description: newProduct.description,
            why_stand_out: newProduct.whyStandOut,
            product_details: newProduct.productDetails,
            pack_info: newProduct.packInfo,
            price: newProduct.price,
            image: newProduct.image,
            images: newProduct.images,
            badge: newProduct.badge,
            category: newProduct.category,
            variants: newProduct.variants,
            preparation_options: newProduct.preparationOptions,
            is_featured: newProduct.isFeatured,
            is_best_seller: newProduct.isBestSeller,
            is_new_arrival: newProduct.isNewArrival,
          },
        ]);

        if (dbError) {
          return NextResponse.json({ success: false, error: dbError.message }, { status: 400 });
        }

        revalidatePath("/api/products");
        revalidatePath("/shop");
        revalidatePath("/");
      }
    }

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
