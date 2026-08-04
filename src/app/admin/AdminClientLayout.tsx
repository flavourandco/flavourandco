"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileSpreadsheet,
  Mail,
  Star,
  BookOpenText,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Search,
  Bell,
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
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Wholesale", href: "/admin/wholesale", icon: FileSpreadsheet },
    { label: "Inquiries", href: "/admin/contact", icon: Mail },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Blog", href: "/admin/blogs", icon: BookOpenText },
  ];

  const getBreadcrumbTitle = () => {
    if (pathname === "/admin/dashboard" || pathname === "/admin") return "Dashboard";
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
          <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 shrink-0">
            <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              FC
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                Flavour &amp; Co.
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Admin Control
              </span>
            </div>
          </div>

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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
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
        <div className="p-3 border-t border-slate-100 space-y-1 shrink-0 bg-slate-50/50">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <span>View Main Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between bg-white px-4 h-14 border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              FC
            </div>
            <span className="font-bold text-sm text-slate-900">Admin Dashboard</span>
          </div>
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

        {/* Desktop Top Header Navbar */}
        <header className="hidden lg:flex items-center justify-between px-8 h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="text-slate-400">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">{getBreadcrumbTitle()}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-52 bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-3 pr-8 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>

            <button className="p-2 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={adminName} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {userInitial}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700">{adminName}</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
