import { NextResponse } from "next/server";
import { checkFirstOrderDiscountEligibility } from "@/lib/subscribers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "";
    const code = searchParams.get("code") || "PIECLUB10";

    const result = await checkFirstOrderDiscountEligibility(email, code);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in GET /api/subscribers/check-discount:", error);
    return NextResponse.json(
      {
        success: false,
        eligible: false,
        discountPercent: 0,
        discountCode: "PIECLUB10",
        error: error.message || "Failed to verify discount eligibility.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email || "";
    const code = body.code || "PIECLUB10";

    const result = await checkFirstOrderDiscountEligibility(email, code);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error in POST /api/subscribers/check-discount:", error);
    return NextResponse.json(
      {
        success: false,
        eligible: false,
        discountPercent: 0,
        discountCode: "PIECLUB10",
        error: error.message || "Failed to verify discount eligibility.",
      },
      { status: 500 }
    );
  }
}
