import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const status = searchParams.get("status");

    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;
    if (!supabase) {
      return NextResponse.json(
        { success: true, data: [] },
        { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
      );
    }

    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });

    if (productId) {
      query = query.eq("product_id", productId);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching reviews:", error.message);
      return NextResponse.json(
        { success: false, error: error.message, data: [] },
        { status: 500, headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
      );
    }

    const formatted = (data || []).map((r: any) => ({
      id: r.id,
      productId: r.product_id || undefined,
      productName: r.product_name || "Gourmet Pie",
      name: r.author || r.name || "Customer",
      rating: r.rating || 5,
      date: r.date || (r.created_at ? new Date(r.created_at).toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" }) : "Recently"),
      comment: r.content || r.comment || "",
      isVerified: r.is_verified ?? true,
      isFeatured: r.is_featured ?? false,
      status: r.status || "approved",
    }));

    return NextResponse.json(
      { success: true, data: formatted },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("Reviews GET Error:", err);
    return NextResponse.json(
      { success: false, error: err.message, data: [] },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, productName, name, rating, comment, isVerified, isFeatured, status } = body;

    if (!comment || !name) {
      return NextResponse.json(
        { success: false, error: "Name and comment are required." },
        { status: 400 }
      );
    }

    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 500 }
      );
    }

    const row: any = {
      product_id: productId || null,
      product_name: productName || "Gourmet Pie",
      name: name.trim(),
      author: name.trim(),
      rating: rating || 5,
      comment: comment.trim(),
      content: comment.trim(),
      is_verified: isVerified ?? true,
      is_featured: isFeatured ?? false,
      status: status || "approved",
      date: new Date().toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" }),
    };

    let { data, error } = await supabase.from("reviews").insert([row]).select().maybeSingle();

    if (error) {
      console.warn("Reviews POST schema fallback retry:", error.message);
      // Fallback with base columns only
      const baseRow: any = {
        product_id: productId || null,
        name: name.trim(),
        rating: rating || 5,
        comment: comment.trim(),
      };
      const retry = await supabase.from("reviews").insert([baseRow]).select().maybeSingle();
      if (retry.error) {
        return NextResponse.json({ success: false, error: retry.error.message }, { status: 500 });
      }
      data = retry.data;
    }

    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("Reviews POST Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, isFeatured } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Review ID is required." }, { status: 400 });
    }

    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured." }, { status: 500 });
    }

    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (isFeatured !== undefined) updates.is_featured = isFeatured;

    const { data, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("Reviews PUT Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Review ID is required." }, { status: 400 });
    }

    const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database not configured." }, { status: 500 });
    }

    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Review deleted successfully" },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("Reviews DELETE Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
