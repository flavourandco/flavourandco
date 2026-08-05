import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { BlogSchema } from "@/lib/validations/blog";
import { requireAdminApi } from "@/lib/auth";
import type { BlogPost } from "@/lib/types";

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const formattedBlogs: BlogPost[] = data.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt || "",
            content: Array.isArray(item.content) ? item.content : [item.content || ""],
            writer: item.writer || "Simran Gulati",
            date: item.date || "",
            readTime: item.read_time || "3 min read",
            category: item.category || "General",
            image: item.image,
            image2: item.image2 || undefined,
            authorAvatar: item.author_avatar || undefined,
            published: item.published ?? true,
          }));

          return NextResponse.json({ success: true, data: formattedBlogs });
        }
      }
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error: authErr } = await requireAdminApi();
  if (authErr) return authErr;

  try {
    const body = await request.json();
    const validated = BlogSchema.parse(body);

    const id = validated.id || `blog-${validated.slug || Date.now()}`;

    const blogRecord = {
      id,
      slug: validated.slug,
      title: validated.title,
      excerpt: validated.excerpt,
      content: validated.content,
      writer: validated.writer,
      date: validated.date,
      read_time: validated.readTime,
      category: validated.category,
      image: validated.image,
      image2: validated.image2 || null,
      author_avatar: validated.authorAvatar || null,
      published: validated.published ?? true,
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("blogs")
          .insert([blogRecord])
          .select()
          .single();

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
      }
    }

    return NextResponse.json({ success: true, data: blogRecord }, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog" },
      { status: 400 }
    );
  }
}
