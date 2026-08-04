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
} from "lucide-react";

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
  const [dataSource, setDataSource] = useState<string>("loading");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();

      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
        setDataSource(data.source || "database");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h1>
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
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-md transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Syncing..." : "Sync with Clerk"}</span>
        </button>
      </div>

      {/* Alert / Feedback Notification */}
      {feedback && (
        <div
          className={`p-3.5 rounded-md text-xs font-medium border flex items-center justify-between animate-fadeIn ${
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
        <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Registered Users
            </span>
            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{totalUsersCount}</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Synced from Clerk &amp; Supabase
            </span>
          </div>
        </div>

        {/* Customer Accounts */}
        <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Customer Accounts
            </span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{customerUsersCount}</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">Standard user roles</span>
          </div>
        </div>

        {/* Admin Accounts */}
        <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Administrators
            </span>
            <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{adminUsersCount}</h3>
            <span className="text-[11px] font-medium text-purple-600 mt-1 block font-semibold">
              Full admin privileges
            </span>
          </div>
        </div>
      </div>

      {/* Main Users Table Section */}
      <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs space-y-4 p-5">
        {/* Table Filters Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search users by name, email, or Clerk ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 text-xs text-slate-900 font-medium focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="user">Customers (user)</option>
              <option value="admin">Admins (admin)</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 mx-auto animate-spin text-slate-400" />
            <p className="text-xs font-medium">Loading user list from database...</p>
          </div>
        ) : sortedUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">No users found</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No user records matching "${searchQuery}".`
                : "No registered users in database yet. Try clicking 'Sync with Clerk' above to pull existing users."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="pb-2.5 pl-2">User Profile</th>
                  <th className="pb-2.5">Email Address</th>
                  <th className="pb-2.5">Role</th>
                  <th className="pb-2.5">Clerk User ID</th>
                  <th className="pb-2.5 text-right pr-2">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
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
                          : "hover:bg-slate-50/60 transition-colors"
                      }
                    >
                      {/* User Profile */}
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          {u.image_url ? (
                            <img
                              src={u.image_url}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
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
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                                  (You)
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal">Customer Account</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 font-mono text-[11px] text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{u.email}</span>
                          {isYou && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                              (You)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3">
                        {(() => {
                          const displayRole = String(u.role || "user").toLowerCase();
                          const isAdminRole = displayRole === "admin";
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                isAdminRole
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
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
                      <td className="py-3 font-mono text-[10px] text-slate-500">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                          {u.clerk_user_id}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 text-right pr-2 text-[11px] text-slate-500">
                        <div className="flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
