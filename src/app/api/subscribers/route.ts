import { NextResponse } from "next/server";
import {
  getAllSubscribersServer,
  addSubscriberServer,
  deleteSubscriberServer,
} from "@/lib/subscribers";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const status = searchParams.get("status") || "all";

    const all = await getAllSubscribersServer();

    let filtered = all;
    if (search) {
      filtered = filtered.filter((s) => s.email.toLowerCase().includes(search));
    }
    if (status === "active") {
      filtered = filtered.filter((s) => !s.discountUsed);
    } else if (status === "used") {
      filtered = filtered.filter((s) => s.discountUsed);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      totalCount: all.length,
      activeCount: all.filter((s) => !s.discountUsed).length,
      usedCount: all.filter((s) => s.discountUsed).length,
    });
  } catch (error: any) {
    console.error("Error in GET /api/subscribers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source, discountCode } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const result = await addSubscriberServer(
      email,
      source || "offer_modal",
      discountCode || "PIECLUB10"
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to subscribe" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriber: result.subscriber,
      isExisting: result.isExisting,
      discountCode: result.subscriber?.discountCode || "PIECLUB10",
      message: result.isExisting
        ? "You're already subscribed! Use discount code PIECLUB10 on your first order."
        : "Successfully subscribed! Welcome to Flavour & Co. Use PIECLUB10 for 10% off your first order.",
    });
  } catch (error: any) {
    console.error("Error in POST /api/subscribers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add subscriber" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing subscriber ID parameter." },
        { status: 400 }
      );
    }

    const deleted = await deleteSubscriberServer(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Subscriber not found or could not be deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscriber removed successfully.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/subscribers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, discountUsed, firstOrderId, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Subscriber ID is required." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const updatePayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        if (typeof discountUsed === "boolean") {
          updatePayload.discount_used = discountUsed;
        }
        if (firstOrderId !== undefined) {
          updatePayload.first_order_id = firstOrderId;
        }

        const { data, error } = await supabase
          .from("subscribers")
          .update(updatePayload)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data,
          message: "Subscriber updated successfully.",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Subscriber updated.",
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/subscribers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update subscriber" },
      { status: 500 }
    );
  }
}
