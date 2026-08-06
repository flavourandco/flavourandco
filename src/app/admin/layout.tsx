import React from "react";
import { headers } from "next/headers";
import { requireAdminPage } from "@/lib/auth";
import AdminClientLayout from "./AdminClientLayout";
import MobileAdminGuard from "@/components/admin/MobileAdminGuard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side authorization check:
  // - If user is unauthenticated, redirects to `/sign-in`.
  // - If user is authenticated but role !== "admin", redirects to `/`.
  await requireAdminPage();

  // Detect mobile device on server side via user agent header
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobileServer = /mobile|android|iphone|ipad|tablet|blackberry|opera mini/i.test(userAgent);

  return (
    <MobileAdminGuard isMobileServer={isMobileServer}>
      <AdminClientLayout>{children}</AdminClientLayout>
    </MobileAdminGuard>
  );
}
