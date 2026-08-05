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

        if (status !== "all") {
          query = query.eq("status", status);
        }

        const { data, error } = await query;

        if (!error && data) {
          const formattedReviews: ReviewItem[] = data.map((item) => ({
            id: item.id,
            productId: item.product_id || undefined,
            productName: item.products?.name || "General Testimonial",
            name: item.name,
            rating: item.rating,
            date: new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            comment: item.comment,
            isVerified: item.is_verified ?? true,
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

    const record = {
      product_id: validated.productId || null,
      name: validated.name,
      rating: validated.rating,
      comment: validated.comment,
      is_verified: validated.isVerified ?? true,
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
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
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
    const { id, status } = body;

    if (!id || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid review status" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("reviews")
          .update({ status })
          .eq("id", id)
          .select();

        if (error) {
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
