import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { BlogSchema } from "@/lib/validations/blog";
import { requireAdminApi } from "@/lib/auth";
import type { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

          return NextResponse.json(
            { success: true, data: formattedBlogs },
            { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
          );
        }
      }
    }

    return NextResponse.json({ success: true, data: [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = await request.json();
    const validated = BlogSchema.parse(body);

    const newBlog: BlogPost = {
      id: body.id || `blog-${Date.now()}`,
      slug: validated.slug || validated.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: validated.title,
      excerpt: validated.excerpt || "",
      content: validated.content,
      writer: validated.writer || "Simran Gulati",
      date: validated.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: validated.readTime || "3 min read",
      category: validated.category || "General",
      image: validated.image,
      image2: validated.image2 || undefined,
      authorAvatar: validated.authorAvatar || undefined,
      published: validated.published ?? true,
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error: dbError } = await supabase.from("blogs").insert([
          {
            id: newBlog.id,
            slug: newBlog.slug,
            title: newBlog.title,
            excerpt: newBlog.excerpt,
            content: newBlog.content,
            writer: newBlog.writer,
            date: newBlog.date,
            read_time: newBlog.readTime,
            category: newBlog.category,
            image: newBlog.image,
            image2: newBlog.image2 || null,
            author_avatar: newBlog.authorAvatar || null,
            published: newBlog.published,
          },
        ]);

        if (dbError) {
          return NextResponse.json({ success: false, error: dbError.message }, { status: 400 });
        }

        revalidatePath("/api/blogs");
        revalidatePath("/blog");
        revalidatePath(`/blog/${newBlog.slug}`);
      }
    }

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog article" },
      { status: 500 }
    );
  }
}
