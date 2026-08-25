import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { ReviewSchema } from "@/lib/validations/review";
import { requireAdminApi } from "@/lib/auth";
import type { ReviewItem } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const status = searchParams.get("status") || "approved";
    const featuredOnly = searchParams.get("featured") === "true";

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        let query = supabase
          .from("reviews")
          .select("*, products(name)")
          .order("created_at", { ascending: false });

        if (productId) {
          query = query.eq("product_id", productId);
        }

        if (featuredOnly) {
          query = query.eq("is_featured", true);
        }

        if (status !== "all") {
          query = query.eq("status", status);
        }

        const { data, error } = await query;

        if (!error && data) {
          const formattedReviews: ReviewItem[] = data.map((item) => ({
            id: item.id,
            productId: item.product_id || undefined,
            productName: item.product_name || item.products?.name || "General Testimonial",
            name: item.name,
            rating: item.rating,
            date: new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            comment: item.comment,
            isVerified: item.is_verified ?? true,
            isFeatured: Boolean(item.is_featured),
            status: item.status || "approved",
          }));

          return NextResponse.json({ success: true, data: formattedReviews });
        }
      }
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ReviewSchema.parse(body);

    const record: Record<string, any> = {
      product_id: validated.productId || null,
      product_name: body.productName || null,
      name: validated.name,
      rating: validated.rating,
      comment: validated.comment,
      is_verified: validated.isVerified ?? true,
      is_featured: validated.isFeatured ?? false,
      status: validated.status || "approved",
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("reviews")
          .insert([record])
          .select()
          .single();

        if (error) {
          // Fallback if product_name or is_featured column doesn't exist yet in DB schema
          delete record.product_name;
          delete record.is_featured;
          const { data: retryData, error: retryError } = await supabase
            .from("reviews")
            .insert([record])
            .select()
            .single();

          if (retryError) {
            return NextResponse.json({ success: false, error: retryError.message }, { status: 400 });
          }
          return NextResponse.json({ success: true, data: retryData }, { status: 201 });
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
      }
    }

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create review" },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const { error: authErr } = await requireAdminApi();
  if (authErr) return authErr;

  try {
    const body = await request.json();
    const { id, status, isFeatured } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Review ID required" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      updates.status = status;
    }
    if (typeof isFeatured === "boolean") {
      updates.is_featured = isFeatured;
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("reviews")
          .update(updates)
          .eq("id", id)
          .select();

        if (error) {
          // If is_featured doesn't exist yet in DB schema, retry without it
          delete updates.is_featured;
          if (Object.keys(updates).length > 0) {
            const { data: retryData, error: retryErr } = await supabase
              .from("reviews")
              .update(updates)
              .eq("id", id)
              .select();
            if (retryErr) {
              return NextResponse.json({ success: false, error: retryErr.message }, { status: 400 });
            }
            return NextResponse.json({ success: true, data: retryData });
          }
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({ success: true, message: "Review updated" });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error: authErr } = await requireAdminApi();
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("reviews").delete().eq("id", id);
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    }

    return NextResponse.json({ success: true, message: `Review ${id} deleted` });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
