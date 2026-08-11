import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          return NextResponse.json(
            { success: true, data },
            { headers: { "Cache-Control": "no-store, max-age=0" } }
          );
        }
      }
    }

    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const updatePayload = {
          name: body.name,
          tagline: body.tagline || "",
          short_description: body.shortDescription || "",
          description: body.description || "",
          why_stand_out: Array.isArray(body.whyStandOut) ? body.whyStandOut : [],
          product_details: Array.isArray(body.productDetails) ? body.productDetails : [],
          pack_info: body.packInfo || "Pack of 12",
          price: Number(body.price),
          image: body.image,
          images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.image],
          badge: body.badge || null,
          category: body.category || "frozen",
          variants: Array.isArray(body.variants) ? body.variants : [],
          preparation_options: Array.isArray(body.preparationOptions) ? body.preparationOptions : [],
          is_featured: Boolean(body.isFeatured),
          is_best_seller: Boolean(body.isBestSeller),
          is_new_arrival: Boolean(body.isNewArrival),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("products")
          .update(updatePayload)
          .eq("id", id)
          .select();

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        // Revalidate route caches
        revalidatePath("/api/products");
        revalidatePath(`/api/products/${id}`);
        revalidatePath("/shop");
        revalidatePath(`/shop/${body.category || "frozen"}/${id}`);
        revalidatePath("/");

        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({ success: true, message: "Product updated (mock)" });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await params;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        revalidatePath("/api/products");
        revalidatePath("/shop");
        revalidatePath("/");
      }
    }

    return NextResponse.json({ success: true, message: `Product ${id} deleted` });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
