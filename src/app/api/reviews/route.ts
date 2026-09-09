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
      productName: r.product_name || undefined,
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
      product_name: productName || null,
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
    const {
      id,
      name,
      author,
      rating,
      comment,
      content,
      productId,
      product_id,
      productName,
      product_name,
      isVerified,
      is_verified,
      isFeatured,
      is_featured,
      status,
      date,
    } = body;

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
    if (is_featured !== undefined) updates.is_featured = is_featured;
    if (isVerified !== undefined) updates.is_verified = isVerified;
    if (is_verified !== undefined) updates.is_verified = is_verified;
    if (rating !== undefined) updates.rating = Number(rating);
    if (date !== undefined) updates.date = date;

    const resolvedName = name ?? author;
    if (resolvedName !== undefined) {
      updates.name = resolvedName;
      updates.author = resolvedName;
    }

    const resolvedComment = comment ?? content;
    if (resolvedComment !== undefined) {
      updates.comment = resolvedComment;
      updates.content = resolvedComment;
    }

    const resolvedProductId = productId !== undefined ? productId : product_id;
    if (resolvedProductId !== undefined) {
      updates.product_id = resolvedProductId || null;
    }

    const resolvedProductName = productName !== undefined ? productName : product_name;
    if (resolvedProductName !== undefined) {
      updates.product_name = resolvedProductName || null;
    }

    let { data, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Reviews PUT fallback retry:", error.message);
      // Fallback with base columns only
      const baseUpdates: any = {};
      if (updates.status !== undefined) baseUpdates.status = updates.status;
      if (updates.is_featured !== undefined) baseUpdates.is_featured = updates.is_featured;
      if (updates.rating !== undefined) baseUpdates.rating = updates.rating;
      if (updates.name !== undefined) baseUpdates.name = updates.name;
      if (updates.comment !== undefined) baseUpdates.comment = updates.comment;
      if (updates.product_id !== undefined) baseUpdates.product_id = updates.product_id;

      const retry = await supabase
        .from("reviews")
        .update(baseUpdates)
        .eq("id", id)
        .select()
        .maybeSingle();

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
