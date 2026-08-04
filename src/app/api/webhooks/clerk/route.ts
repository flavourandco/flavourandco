import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const body = await req.text();
  let evt: any;

  // If CLERK_WEBHOOK_SECRET is configured, cryptographically verify signature with Svix
  if (WEBHOOK_SECRET) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ success: false, error: "Missing svix headers" }, { status: 400 });
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
      return NextResponse.json({ success: false, error: `Webhook verification failed: ${error.message}` }, { status: 400 });
    }
  } else {
    try {
      evt = JSON.parse(body);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }
  }

  const eventType = evt.type || evt.event || "";
  const data = evt.data || evt;

  if (!eventType.startsWith("user.")) {
    return NextResponse.json({
      success: true,
      message: `Ignored non-user event: ${eventType}`,
    });
  }

  if (!data || !data.id) {
    return NextResponse.json({ success: false, error: "Invalid payload data" }, { status: 400 });
  }

  const clerkUserId = data.id;

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
    return NextResponse.json({ success: true, message: `User ${clerkUserId} deleted` });
  }

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
  const role = data.public_metadata?.role || "user";
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from("users").upsert(
        {
          clerk_user_id: clerkUserId,
          email,
          name,
          role,
          updated_at: now,
        },
        { onConflict: "clerk_user_id" }
      );

      if (error) {
        console.error("Error upserting user to Supabase:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: `User ${clerkUserId} synced successfully`,
    data: { clerkUserId, email, name, role },
  });
}
