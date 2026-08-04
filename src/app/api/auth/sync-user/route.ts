import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Failed to initialize Supabase client" }, { status: 500 });
    }

    const primaryEmail =
      user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "";

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const name = fullName || user.username || (primaryEmail ? primaryEmail.split("@")[0] : "User");
    const rawRole =
      (user.publicMetadata as any)?.role ||
      (user as any).public_metadata?.role ||
      (user as any).unsafeMetadata?.role ||
      "user";
    const role = String(rawRole).toLowerCase();
    const imageUrl = user.imageUrl || "";
    const now = new Date().toISOString();

    const userRecord: Record<string, any> = {
      clerk_user_id: user.id,
      email: primaryEmail,
      name,
      role,
      updated_at: now,
    };

    if (imageUrl) {
      userRecord.image_url = imageUrl;
    }

    let { error } = await supabase.from("users").upsert(userRecord, {
      onConflict: "clerk_user_id",
    });

    // Fallback if image_url column doesn't exist yet in Supabase table
    if (error) {
      const recordWithRole = {
        clerk_user_id: user.id,
        email: primaryEmail,
        name,
        role,
      };
      const retryRole = await supabase.from("users").upsert(recordWithRole, {
        onConflict: "clerk_user_id",
      });

      if (!retryRole.error) {
        error = null;
      } else {
        const minimalRecord = {
          clerk_user_id: user.id,
          email: primaryEmail,
          name,
        };
        const retryMinimal = await supabase.from("users").upsert(minimalRecord, {
          onConflict: "clerk_user_id",
        });
        error = retryMinimal.error;
      }
    }

    if (error) {
      console.error("Error auto-syncing user to Supabase:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User synced to Supabase" });
  } catch (error: any) {
    console.error("Error in sync-user endpoint:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
