"use client";

import React, { useEffect, useState } from "react";
import { Search, Mail, Eye, Trash2, X, Loader2 } from "lucide-react";
import { ContactInquiry } from "@/lib/types";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useUIStore } from "@/store/ui.store";
import { BoneyardTableSkeleton } from "@/components/ui/BoneyardSkeleton";

export default function AdminContactPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [stagedStatus, setStagedStatus] = useState<ContactInquiry["status"] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const addToast = useUIStore((s) => s.addToast);

  const handleOpenInquiry = (item: ContactInquiry) => {
    setSelectedInquiry(item);
    setStagedStatus(item.status);
  };

  const handleCloseInquiry = () => {
    setSelectedInquiry(null);
    setStagedStatus(null);
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data);
      }
    } catch (e) {
      console.error("Error fetching contact inquiries", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: ContactInquiry["status"]) => {
    const current = inquiries.find((i) => i.id === id) || (selectedInquiry?.id === id ? selectedInquiry : null);
    if (current && current.status === status) return;
    if (updatingId) return;
    setUpdatingId(id);

    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        handleCloseInquiry();
        addToast(`Inquiry status updated to ${status}.`, "success");
      }
    } catch {
      addToast("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const id = deletingId;
    setDeletingId(null);
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        addToast("Contact inquiry deleted.", "info");
      }
    } catch {
      addToast("Failed to delete inquiry", "error");
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subject && item.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ContactInquiry["status"]) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase">Pending</span>;
      case "replied":
        return <span className="bg-blue-50 text-blue-800 border border-blue-200/60 px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase">Replied</span>;
      case "resolved":
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase">Resolved</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Contact Us Inquiries</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Customer questions, event catering requests, and customer support messages.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-3 rounded-sm border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search name, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-sm py-1.5 pl-9 pr-3 text-xs text-slate-700 focus:outline-none focus:border-slate-900"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "pending", "replied", "resolved"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-sm text-[11px] font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                statusFilter === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <BoneyardTableSkeleton rows={5} columns={6} />
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Mail className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No contact messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Name &amp; Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.name}
                      <span className="block text-[10px] text-slate-400 font-normal">{item.email}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.phone || "N/A"}</td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">{item.subject || "General"}</td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenInquiry(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm border border-slate-200/80 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-slate-500" /> View
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-sm border border-rose-200/80 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STRICTLY CENTERED DETAIL MODAL OVER ENTIRE SCREEN */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn" data-lenis-prevent>
          <div className="relative bg-white rounded-none max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 my-auto shrink-0 max-h-[88vh] overflow-y-auto overscroll-contain" data-lenis-prevent>
            
            {/* MINIMAL IN-MODAL RECTANGULAR LOADER OVERLAY */}
            {updatingId && (
              <div className="absolute inset-0 z-50 bg-white/75 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white border border-slate-300 shadow-lg px-4 py-2.5 rounded-none flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 tracking-tight">Updating status...</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400">Contact Inquiry</span>
                <h3 className="text-base font-bold text-slate-900">{selectedInquiry.name}</h3>
              </div>
              <button onClick={handleCloseInquiry} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-none border border-slate-200/60">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">EMAIL</span>
                  <span className="font-semibold text-slate-900">{selectedInquiry.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">PHONE</span>
                  <span className="font-semibold text-slate-900">{selectedInquiry.phone || "N/A"}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">SUBJECT</span>
                <span className="font-bold text-slate-900 block text-xs">{selectedInquiry.subject}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">MESSAGE</span>
                <p className="bg-slate-50 p-3 rounded-none text-slate-700 leading-relaxed font-sans border border-slate-200/60">
                  {selectedInquiry.message}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5">UPDATE STATUS</span>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "replied", "resolved"] as const).map((st) => {
                    const isSelected = (stagedStatus || selectedInquiry.status) === st;
                    const isUpdating = updatingId === selectedInquiry.id;
                    return (
                      <button
                        key={st}
                        type="button"
                        disabled={isUpdating}
                        onClick={() => setStagedStatus(st)}
                        className={`px-3 py-1 rounded-none text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              {stagedStatus && stagedStatus !== selectedInquiry.status && (
                <button
                  type="button"
                  disabled={updatingId === selectedInquiry.id}
                  onClick={() => handleUpdateStatus(selectedInquiry.id, stagedStatus)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-none transition-colors cursor-pointer disabled:opacity-60"
                >
                  {updatingId === selectedInquiry.id && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                  <span>{updatingId === selectedInquiry.id ? "Saving..." : "Save Changes"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCloseInquiry}
                className="px-4 py-1.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-none hover:bg-slate-200 cursor-pointer border border-slate-200"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR DELETION */}
      <AdminConfirmModal
        isOpen={Boolean(deletingId)}
        title="Confirm Inquiry Deletion"
        message="Are you sure you want to delete this contact inquiry? This message will be permanently removed."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
