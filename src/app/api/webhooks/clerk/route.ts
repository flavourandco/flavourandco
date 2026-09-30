import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhooks/clerk",
    description: "Clerk Authentication Webhook Handler for Flavour & Co.",
    supportedEvents: ["user.created", "user.updated", "user.deleted"],
  });
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  const body = await req.text();
  let evt: any;

  // Cryptographically verify Svix signature if signing secret is provided
  if (WEBHOOK_SECRET) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Clerk Webhook: Missing required svix headers");
      return NextResponse.json(
        {
          success: false,
          error: "Missing required svix headers (svix-id, svix-timestamp, svix-signature)",
        },
        { status: 400 }
      );
    }

    try {
      const wh = new Webhook(WEBHOOK_SECRET);
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Clerk Webhook signature verification failed:", error.message);
      return NextResponse.json(
        { success: false, error: `Webhook verification failed: ${error.message}` },
        { status: 400 }
      );
    }
  } else {
    // In production, reject unverified payloads
    if (process.env.NODE_ENV === "production") {
      console.error(
        "Clerk Webhook Error: CLERK_WEBHOOK_SIGNING_SECRET is not configured in production environment."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Webhook signing secret is not configured on server",
        },
        { status: 500 }
      );
    }

    console.warn(
      "CLERK_WEBHOOK_SIGNING_SECRET is not configured. Webhook signature verification bypassed in development mode."
    );
    try {
      evt = JSON.parse(body);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }
  }

  const eventType = evt.type || evt.event || "";
  const data = evt.data || evt;

  // Handle non-user events gracefully with 200 OK so Clerk/Svix does not retry unnecessarily
  if (!eventType.startsWith("user.")) {
    return NextResponse.json({
      success: true,
      message: `Ignored event: ${eventType}`,
    });
  }

  if (!data || !data.id) {
    return NextResponse.json({ success: false, error: "Invalid payload data: missing user ID" }, { status: 400 });
  }

  const clerkUserId = data.id;

  // 1. Handle user.deleted event
  if (eventType === "user.deleted") {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.from("users").delete().eq("clerk_user_id", clerkUserId);
        if (error) {
          console.error("Error deleting user from Supabase:", error.message);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    }
    return NextResponse.json({
      success: true,
      message: `User ${clerkUserId} deleted successfully`,
    });
  }

  // 2. Handle user.created and user.updated events
  // Extract primary email address or fallback to first available
  const primaryEmailObj = data.email_addresses?.find(
    (e: any) => e.id === data.primary_email_address_id
  );
  const email =
    primaryEmailObj?.email_address ||
    data.email_addresses?.[0]?.email_address ||
    data.email ||
    "";

  const firstName = data.first_name || "";
  const lastName = data.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const name = fullName || data.username || (email ? email.split("@")[0] : "User");
  const rawRole =
    data.public_metadata?.role ||
    data.publicMetadata?.role ||
    data.unsafe_metadata?.role ||
    "user";
  const role = String(rawRole).toLowerCase();
  const imageUrl = data.image_url || data.profile_image_url || "";
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      // Build record to upsert
      const userRecord: Record<string, any> = {
        clerk_user_id: clerkUserId,
        email,
        name,
        role,
        updated_at: now,
      };

      if (imageUrl) {
        userRecord.image_url = imageUrl;
      }

      let { error } = await supabase.from("users").upsert(
        userRecord,
        { onConflict: "clerk_user_id" }
      );

      // If error occurs (e.g. extra columns like image_url or role not present), retry with minimal fields
      if (error) {
        const minimalRecord = {
          clerk_user_id: clerkUserId,
          email,
          name,
        };
        const retryResult = await supabase.from("users").upsert(
          minimalRecord,
          { onConflict: "clerk_user_id" }
        );
        error = retryResult.error;
      }

      if (error) {
        console.error("Error upserting user to Supabase:", error.message);
        return NextResponse.json(
          {
            success: false,
            error: `Supabase save failed: ${error.message}. Please verify RLS policies in Supabase.`,
          },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: `User ${clerkUserId} synced successfully (${eventType})`,
    data: { clerkUserId, email, name, role, imageUrl },
  });
}
