"use client";

import React from "react";
import { AlertTriangle, Trash2, HelpCircle, X } from "lucide-react";

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdminConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Yes, Proceed",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto" data-lenis-prevent>
      <div className="bg-white w-full max-w-sm rounded-sm border border-slate-200 shadow-2xl p-5 space-y-4 text-center my-auto shrink-0 max-h-[90vh] overflow-y-auto overscroll-contain" data-lenis-prevent>
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center shrink-0 ${
            isDanger ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"
          }`}
        >
          {isDanger ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2 px-3 text-xs font-semibold text-white rounded-sm transition-colors cursor-pointer shadow-2xs ${
              isDanger ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 hover:bg-black"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
