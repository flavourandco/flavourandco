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

import { useAuthStore } from "@/store/auth.store";
import { BoneyardSidebarUserSkeleton } from "@/components/ui/BoneyardSkeleton";

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const userProfile = useAuthStore((s) => s.userProfile);
  const authLoading = useAuthStore((s) => s.isLoading);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Customers", href: "/admin/users", icon: Users },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Wholesale", href: "/admin/wholesale", icon: FileSpreadsheet },
    { label: "Inquiries", href: "/admin/contact", icon: Mail },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Blog", href: "/admin/blogs", icon: BookOpenText },
  ];

  const adminName = user?.firstName || user?.fullName?.split(" ")[0] || "Simran";
  const userInitial = (adminName[0] || "S").toUpperCase();

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

        {/* HIGHLIGHTED POLISHED SIDEBAR BOTTOM CONTROLS */}
        <div className="p-3 border-t border-slate-200/80 space-y-2.5 shrink-0 bg-slate-100/70">
          
          {/* Visit Main Store (Highlighted Pill Button) */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-bold text-slate-900 bg-white hover:bg-slate-900 hover:text-white border border-slate-200/90 shadow-2xs transition-all duration-200 group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-400 transition-colors" />
              <span>Visit Main Store</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300 transition-colors">↗</span>
          </Link>

          {/* Sign Out Button (Highlighted Danger Pill) */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-semibold text-rose-700 bg-rose-50/90 hover:bg-rose-600 hover:text-white border border-rose-200/80 transition-all duration-200 cursor-pointer shadow-2xs group"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-rose-600 group-hover:text-white transition-colors" />
              <span>Sign Out</span>
            </span>
            <span className="text-[9px] font-mono text-rose-400 group-hover:text-rose-200 uppercase tracking-wider">Exit</span>
          </button>

          {/* Admin User Profile Card (Highlighted Sleek Card with Online Indicator) */}
          {!isLoaded || authLoading ? (
            <BoneyardSidebarUserSkeleton />
          ) : (
            <div className="p-3 rounded-md bg-white border border-slate-200/90 shadow-xs flex items-center gap-3 relative overflow-hidden">
              <div className="relative shrink-0">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={adminName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-slate-900/10 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {userInitial}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-extrabold text-slate-900 truncate">{adminName}</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 rounded-sm shrink-0">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {userProfile?.email || user?.primaryEmailAddress?.emailAddress || "Administrator"}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between bg-white px-4 h-16 border-b border-slate-200 sticky top-0 z-30">
          <div className="w-8"></div>
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
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2 shadow-md animate-fadeIn">
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
              <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-900 font-bold flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                Main Store <ExternalLink className="w-3 h-3 text-amber-500" />
              </Link>
              <button onClick={handleLogout} className="text-xs text-rose-700 font-bold bg-rose-50 px-3 py-1.5 rounded-md border border-rose-200 cursor-pointer">
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
