import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase is not configured.",
          users: [],
          source: "database",
          count: 0,
        },
        { status: 500 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to initialize Supabase server client.",
          users: [],
          source: "database",
          count: 0,
        },
        { status: 500 }
      );
    }

    // Fetch strictly from Supabase database
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users from Supabase:", error.message);
      return NextResponse.json(
        {
          success: false,
          error: `Supabase database error: ${error.message}`,
          users: [],
          source: "database",
          count: 0,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      users: data || [],
      source: "database",
      count: (data || []).length,
    });
  } catch (error: any) {
    console.error("Error fetching users for admin:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch users from database",
        users: [],
        source: "database",
        count: 0,
      },
      { status: 500 }
    );
  }
}
