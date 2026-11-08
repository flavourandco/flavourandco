import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

const isProtectedRoute = createRouteMatcher(["/checkout(.*)"]);

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

export default function proxy(req: NextRequest, evt: NextFetchEvent) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  // Never intercept webhook endpoints (Clerk, Square, etc.)
  if (req.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  // If Clerk keys are missing or invalid, bypass middleware gracefully instead of failing with 500
  if (
    !publishableKey ||
    !secretKey ||
    publishableKey.includes("your-") ||
    secretKey.includes("your-")
  ) {
    if (req.nextUrl.pathname.startsWith("/checkout")) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  try {
    const handler = clerkMiddleware(async (auth, request) => {
      if (isProtectedRoute(request)) {
        await auth.protect();
      }
    });
    return handler(req, evt);
  } catch (error) {
    console.error("Clerk middleware invocation failed:", error);
    return NextResponse.next();
  }
}
