"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Mail,
  Calendar,
  Database,
  Eye,
  X,
  Key,
  Shield,
} from "lucide-react";
import { BoneyardTableSkeleton, BoneyardStatCardSkeleton } from "@/components/ui/BoneyardSkeleton";

interface AdminUser {
  id?: string;
  clerk_user_id: string;
  email: string;
  name: string;
  role: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useUser();
  const currentEmail = useMemo(
    () => currentUser?.primaryEmailAddress?.emailAddress?.toLowerCase() || "",
    [currentUser]
  );
  const currentClerkId = currentUser?.id || "";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();

      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Failed to load users from database.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Network error fetching users.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSyncWithClerk = async () => {
    setSyncing(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: "success",
          message: data.message || `Synced ${data.syncedCount || 0} user(s) into database successfully!`,
        });
        await fetchUsers();
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Failed to sync users with Clerk.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Error triggering user sync.",
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoized Filtering & Sorting: Pin logged-in user at the top
  const sortedUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = users.filter((u) => {
      const userRole = String(u.role || "user").toLowerCase();
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.clerk_user_id.toLowerCase().includes(query);

      const matchesRole = roleFilter === "all" ? true : userRole === roleFilter;
      return matchesSearch && matchesRole;
    });

    return filtered.sort((a, b) => {
      const isA =
        (currentClerkId && a.clerk_user_id === currentClerkId) ||
        (currentEmail && a.email.toLowerCase() === currentEmail);
      const isB =
        (currentClerkId && b.clerk_user_id === currentClerkId) ||
        (currentEmail && b.email.toLowerCase() === currentEmail);

      if (isA && !isB) return -1;
      if (!isA && isB) return 1;
      return 0;
    });
  }, [users, searchQuery, roleFilter, currentClerkId, currentEmail]);

  const { totalUsersCount, adminUsersCount, customerUsersCount } = useMemo(() => {
    const total = users.length;
    const adminCount = users.filter((u) => String(u.role || "user").toLowerCase() === "admin").length;
    return {
      totalUsersCount: total,
      adminUsersCount: adminCount,
      customerUsersCount: total - adminCount,
    };
  }, [users]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Account Management</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-3 h-3" />
              Supabase Database
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Manage customer accounts fetched strictly from your Supabase database.
          </p>
        </div>

        {/* Sync Button */}
        <button
          onClick={handleSyncWithClerk}
          disabled={syncing}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-all shadow-2xs disabled:opacity-50 cursor-pointer border border-slate-800 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Syncing..." : "Sync with Clerk"}</span>
        </button>
      </div>

      {/* Alert / Feedback Notification */}
      {feedback && (
        <div
          className={`p-3.5 rounded-sm text-xs font-medium border flex items-center justify-between animate-fadeIn ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Registered Users */}
        <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Registered Users
            </span>
            <div className="w-7 h-7 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{totalUsersCount}</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Synced from Clerk &amp; Supabase
            </span>
          </div>
        </div>

        {/* Customer Accounts */}
        <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Customer Accounts
            </span>
            <div className="w-7 h-7 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{customerUsersCount}</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">Standard customer roles</span>
          </div>
        </div>

        {/* Admin Accounts */}
        <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Administrators
            </span>
            <div className="w-7 h-7 rounded-sm bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{adminUsersCount}</h3>
            <span className="text-[11px] font-medium text-purple-600 mt-1 block font-semibold">
              Full admin privileges
            </span>
          </div>
        </div>
      </div>

      {/* Main Users Table Section */}
      <div className="bg-white rounded-sm border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search users by name, email, or Clerk ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-sm py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-sm py-1.5 px-3 text-xs text-slate-900 font-medium focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="user">Customers (user)</option>
              <option value="admin">Admins (admin)</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <BoneyardTableSkeleton rows={5} columns={6} />
        ) : sortedUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">User Profile</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Clerk User ID</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedUsers.map((u) => {
                  const initial = (u.name?.[0] || u.email?.[0] || "U").toUpperCase();
                  const isYou =
                    (currentClerkId && u.clerk_user_id === currentClerkId) ||
                    (currentEmail && u.email.toLowerCase() === currentEmail);

                  const dateStr = u.created_at
                    ? new Date(u.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Recently";

                  return (
                    <tr
                      key={u.clerk_user_id}
                      className={
                        isYou
                          ? "bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors"
                          : "hover:bg-slate-50/80 transition-colors"
                      }
                    >
                      {/* User Profile */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {u.image_url ? (
                            <img
                              src={u.image_url}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {initial}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 block text-xs">{u.name}</span>
                              {isYou && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-sm border border-emerald-200 shrink-0">
                                  (You)
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal">Customer Account</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        {(() => {
                          const displayRole = String(u.role || "user").toLowerCase();
                          const isAdminRole = displayRole === "admin";
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                                isAdminRole
                                  ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {isAdminRole && <ShieldCheck className="w-3 h-3" />}
                              {displayRole}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Clerk ID */}
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded-sm text-slate-600 font-medium">
                          {u.clerk_user_id}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* VIEW ACTION BUTTON */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm border border-slate-200/80 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-slate-500" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* READ-ONLY USER PROFILE DETAILS MODAL (FIXED BIGGER POPUP) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="bg-white w-full max-w-4xl lg:max-w-5xl max-h-[88vh] sm:max-h-[85vh] rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto shrink-0">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">User Account Profile</span>
                <h2 className="text-base font-bold text-slate-900">{selectedUser.name}</h2>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 text-xs text-slate-700 overscroll-contain" data-lenis-prevent>
              <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-sm border border-slate-200/80">
                {selectedUser.image_url ? (
                  <img src={selectedUser.image_url} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">
                    {(selectedUser.name[0] || "U").toUpperCase()}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedUser.name}</h3>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-[10px] uppercase rounded-sm">
                      {selectedUser.role}
                    </span>
                  </div>
                  <p className="text-slate-500 font-mono text-xs">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Key className="w-3 h-3 text-slate-500" /> CLERK USER IDENTIFIER
                  </span>
                  <p className="font-mono text-slate-900 font-bold text-xs bg-white p-2.5 rounded-sm border border-slate-200 break-all">
                    {selectedUser.clerk_user_id}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Database className="w-3 h-3 text-slate-500" /> SUPABASE DATABASE RECORD ID
                  </span>
                  <p className="font-mono text-slate-900 font-bold text-xs bg-white p-2.5 rounded-sm border border-slate-200 break-all">
                    {selectedUser.id || "synced-clerk-user"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-500" /> SYSTEM PERMISSIONS &amp; ACCESS SCOPE
                </span>
                <p className="text-slate-700 leading-relaxed font-sans text-xs bg-white p-3 rounded-sm border border-slate-200">
                  {selectedUser.role === "admin"
                    ? "Full administrative privileges: Can create, update, and delete products, manage blog journal articles, moderate customer reviews, view commercial wholesale inquiries, and inspect order transaction hashes."
                    : "Standard customer privileges: Can browse product catalog, place orders, submit reviews, and view order history."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
