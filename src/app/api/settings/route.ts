import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getFreeDeliveryThresholdServer, setFreeDeliveryThresholdServer } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const freeDeliveryThreshold = await getFreeDeliveryThresholdServer();
    return NextResponse.json(
      { success: true, freeDeliveryThreshold },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } }
    );
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { freeDeliveryThreshold } = body;

    const amount = Number(freeDeliveryThreshold);
    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid non-negative number for free delivery amount" },
        { status: 400 }
      );
    }

    const saved = await setFreeDeliveryThresholdServer(amount);
    if (!saved) {
      return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
    }

    revalidatePath("/api/settings");
    revalidatePath("/");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    revalidatePath("/shipping");

    return NextResponse.json({
      success: true,
      freeDeliveryThreshold: amount,
      message: `Free delivery amount successfully updated to $${amount}!`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}
