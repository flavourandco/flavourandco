import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export type AdminAuthResult = {
  error: NextResponse | null;
  user: Awaited<ReturnType<typeof currentUser>> | null;
};

/**
 * Server-side helper for Next.js App Router Page components & layouts.
 * - Redirects to `/sign-in` if unauthenticated.
 * - Redirects to `/` if authenticated user does not have `role: "admin"`.
 * - Returns the Clerk User object on success.
 */
export async function requireAdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;

  if (role !== "admin") {
    redirect("/");
  }

  return user;
}

/**
 * Server-side helper for Next.js API Route handlers (`/api/...`).
 * - Returns 401 Unauthorized if unauthenticated.
 * - Returns 403 Forbidden if user is not an admin.
 * - Returns `{ error: null, user }` on success.
 */
export async function requireAdminApi(): Promise<AdminAuthResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized: Please sign in." },
        { status: 401 }
      ),
      user: null,
    };
  }

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;

  if (role !== "admin") {
    return {
      error: NextResponse.json(
        { success: false, error: "Forbidden: Admin access required." },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}
