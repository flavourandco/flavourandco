import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Supabase not configured", users: [], count: 0 },
        { status: 500 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Failed to initialize Supabase client", users: [], count: 0 },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("clerk_user_id, email, name, role, image_url, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error.message);
      return NextResponse.json(
        { success: false, error: error.message, users: [], count: 0 },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        users: data || [],
        source: "database",
        count: (data || []).length,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users", users: [], count: 0 },
      { status: 500 }
    );
  }
}
