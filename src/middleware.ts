import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

export default function middleware(req: NextRequest, evt: NextFetchEvent) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  // If Clerk keys are missing or invalid, bypass middleware gracefully instead of failing with 500
  if (
    !publishableKey ||
    !secretKey ||
    publishableKey.includes("your-") ||
    secretKey.includes("your-")
  ) {
    return NextResponse.next();
  }

  try {
    const handler = clerkMiddleware();
    return handler(req, evt);
  } catch (error) {
    console.error("Clerk middleware invocation failed:", error);
    return NextResponse.next();
  }
}
