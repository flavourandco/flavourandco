import React from "react";
import { requireAdminPage } from "@/lib/auth";
import AdminClientLayout from "./AdminClientLayout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side authorization check:
  // - If user is unauthenticated, redirects to `/sign-in`.
  // - If user is authenticated but role !== "admin", redirects to `/`.
  await requireAdminPage();

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
