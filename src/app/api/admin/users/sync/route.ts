import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST() {
  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: "CLERK_SECRET_KEY is missing in server environment" },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured in server environment" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Failed to initialize Supabase server client" },
        { status: 500 }
      );
    }

    // 1. Fetch all users from Clerk API
    const clerkRes = await fetch("https://api.clerk.com/v1/users?limit=500", {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!clerkRes.ok) {
      const errText = await clerkRes.text();
      return NextResponse.json(
        { success: false, error: `Failed to fetch users from Clerk: ${errText}` },
        { status: clerkRes.status }
      );
    }

    const clerkUsers = await clerkRes.json();
    if (!Array.isArray(clerkUsers) || clerkUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users found in Clerk to sync.",
        syncedCount: 0,
      });
    }

    // 2. Format users for Supabase
    const now = new Date().toISOString();
    const recordsToSync = clerkUsers.map((user: any) => {
      const primaryEmail =
        user.email_addresses?.find((e: any) => e.id === user.primary_email_address_id)
          ?.email_address ||
        user.email_addresses?.[0]?.email_address ||
        "";

      const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      const name = fullName || user.username || (primaryEmail ? primaryEmail.split("@")[0] : "User");

      return {
        clerk_user_id: user.id,
        email: primaryEmail,
        name,
        role: user.public_metadata?.role || "user",
        image_url: user.image_url || user.profile_image_url || null,
        created_at: new Date(user.created_at).toISOString(),
        updated_at: now,
      };
    });

    // 3. Upsert into Supabase
    let { error } = await supabase.from("users").upsert(recordsToSync, {
      onConflict: "clerk_user_id",
    });

    // Fallback if image_url column doesn't exist yet
    if (error && error.message?.includes("image_url")) {
      const recordsWithoutImage = recordsToSync.map(({ image_url, ...rest }) => rest);
      const retryResult = await supabase.from("users").upsert(recordsWithoutImage, {
        onConflict: "clerk_user_id",
      });
      error = retryResult.error;
    }

    if (error) {
      return NextResponse.json(
        { success: false, error: `Supabase sync error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${clerkUsers.length} user(s) into Supabase database.`,
      syncedCount: clerkUsers.length,
    });
  } catch (error: any) {
    console.error("Error during manual user sync:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync users" },
      { status: 500 }
    );
  }
}
