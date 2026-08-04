import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  try {
    let dbUsers: any[] = [];
    let isFromDatabase = false;

    // 1. Try fetching from Supabase Database
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          dbUsers = data;
          isFromDatabase = true;
        }
      }
    }

    // 2. If database users is empty or failed, fetch directly from Clerk REST API as fallback
    if (!isFromDatabase) {
      const secretKey = process.env.CLERK_SECRET_KEY;
      if (secretKey) {
        const clerkRes = await fetch("https://api.clerk.com/v1/users?limit=100", {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (clerkRes.ok) {
          const clerkData = await clerkRes.json();
          if (Array.isArray(clerkData)) {
            dbUsers = clerkData.map((user: any) => {
              const primaryEmail =
                user.email_addresses?.find((e: any) => e.id === user.primary_email_address_id)
                  ?.email_address ||
                user.email_addresses?.[0]?.email_address ||
                "";

              const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
              const name = fullName || user.username || (primaryEmail ? primaryEmail.split("@")[0] : "User");

              return {
                id: user.id,
                clerk_user_id: user.id,
                email: primaryEmail,
                name,
                role: user.public_metadata?.role || "user",
                image_url: user.image_url || user.profile_image_url || "",
                created_at: new Date(user.created_at).toISOString(),
                updated_at: new Date(user.updated_at).toISOString(),
              };
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      users: dbUsers,
      source: isFromDatabase ? "supabase" : "clerk_api",
      count: dbUsers.length,
    });
  } catch (error: any) {
    console.error("Error fetching users for admin:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
