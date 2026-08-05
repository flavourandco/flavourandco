import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth";
import { BlogSchema } from "@/lib/validations/blog";

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
          .from("blogs")
          .select("*")
          .or(`id.eq.${id},slug.eq.${id}`)
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, data });
        }
      }
    }

    return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
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
    const validated = BlogSchema.partial().parse(body);

    const updateRecord: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (validated.slug !== undefined) updateRecord.slug = validated.slug;
    if (validated.title !== undefined) updateRecord.title = validated.title;
    if (validated.excerpt !== undefined) updateRecord.excerpt = validated.excerpt;
    if (validated.content !== undefined) updateRecord.content = validated.content;
    if (validated.writer !== undefined) updateRecord.writer = validated.writer;
    if (validated.date !== undefined) updateRecord.date = validated.date;
    if (validated.readTime !== undefined) updateRecord.read_time = validated.readTime;
    if (validated.category !== undefined) updateRecord.category = validated.category;
    if (validated.image !== undefined) updateRecord.image = validated.image;
    if (validated.image2 !== undefined) updateRecord.image2 = validated.image2;
    if (validated.authorAvatar !== undefined) updateRecord.author_avatar = validated.authorAvatar;
    if (validated.published !== undefined) updateRecord.published = validated.published;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("blogs")
          .update(updateRecord)
          .eq("id", id)
          .select();

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({ success: true, message: "Blog updated (mock)" });
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
        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    }

    return NextResponse.json({ success: true, message: `Blog ${id} deleted` });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
