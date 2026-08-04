"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { media } from "@/lib/media";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileSpreadsheet,
  Mail,
  Star,
  BookOpenText,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Wholesale", href: "/admin/wholesale", icon: FileSpreadsheet },
    { label: "Inquiries", href: "/admin/contact", icon: Mail },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Blog", href: "/admin/blogs", icon: BookOpenText },
  ];

  const getBreadcrumbTitle = () => {
    if (pathname === "/admin/dashboard" || pathname === "/admin") return "Dashboard";
    if (pathname.includes("/admin/users")) return "Users";
    if (pathname.includes("/admin/products")) return "Products";
    if (pathname.includes("/admin/orders")) return "Orders";
    if (pathname.includes("/admin/wholesale")) return "Wholesale";
    if (pathname.includes("/admin/contact")) return "Inquiries";
    if (pathname.includes("/admin/reviews")) return "Reviews";
    if (pathname.includes("/admin/blogs")) return "Blog";
    return "Dashboard";
  };

  const adminName = user?.firstName || user?.fullName?.split(" ")[0] || "Admin";
  const userInitial = (adminName[0] || "A").toUpperCase();

  return (
    <div className="admin-scope min-h-screen bg-[#fafafa] text-slate-900 flex font-sans antialiased">
      {/* Fixed Non-Scrolling Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200/80 fixed left-0 top-0 bottom-0 z-40 justify-between select-none">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <Link href="/admin/dashboard" className="h-20 flex items-center justify-center px-4 border-b border-slate-100 shrink-0 hover:opacity-90 transition-opacity">
            <img src={media.navbarLogo} alt="Flavour & Co." className="h-14 w-auto max-w-[190px] object-contain mx-auto" />
          </Link>

          {/* Clean Sidebar Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/admin/dashboard" && pathname === "/admin");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="p-3 border-t border-slate-100 space-y-2 shrink-0 bg-slate-50/50">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <span>Visit Main Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          {/* User Profile Card at bottom */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md bg-white border border-slate-200/80 shadow-2xs">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={adminName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {userInitial}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate">{adminName}</span>
              <span className="text-[10px] text-slate-400 font-medium truncate">Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between bg-white px-4 h-16 border-b border-slate-200 sticky top-0 z-30">
          <div className="w-8"></div> {/* Spacer for symmetry */}
          <Link href="/admin/dashboard" className="flex items-center justify-center">
            <img src={media.navbarLogo} alt="Flavour & Co." className="h-11 w-auto object-contain mx-auto" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-1 shadow-md animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold ${
                    isActive ? "bg-slate-900 text-white" : "text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <Link href="/" target="_blank" className="text-xs text-slate-600 font-medium flex items-center gap-1">
                Main Store <ExternalLink className="w-3 h-3" />
              </Link>
              <button onClick={handleLogout} className="text-xs text-rose-600 font-semibold cursor-pointer">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
