"use client";

import React from "react";
import { Skeleton } from "boneyard-js/react";

interface BoneyardSkeletonProps {
  loading: boolean;
  name?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Universal Boneyard Skeleton wrapper component.
 * Uses boneyard-js under the hood for automatic layout snapshotting & rendering.
 */
export function BoneyardSkeleton({
  loading,
  name,
  children,
  fallback,
}: BoneyardSkeletonProps) {
  if (loading && fallback) {
    return <>{fallback}</>;
  }

  return (
    <Skeleton loading={loading} name={name}>
      {children}
    </Skeleton>
  );
}

/**
 * Animated Boneyard Bone Box
 */
export function BoneyardBox({ className = "h-4 bg-slate-200 rounded animate-pulse" }: { className?: string }) {
  return <div className={`bg-slate-200/80 dark:bg-slate-700/60 rounded animate-pulse ${className}`} />;
}

/**
 * Stat Card Skeleton (For Admin Dashboard & Admin Overview Cards)
 */
export function BoneyardStatCardSkeleton() {
  return (
    <div className="bg-white rounded-sm p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="w-7 h-7 rounded bg-slate-200" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-6 w-20 bg-slate-200 rounded" />
        <div className="h-3 w-32 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

/**
 * Table Row Skeleton (For Admin Tables)
 */
export function BoneyardTableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-3">
          <div className="h-4 bg-slate-200/90 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Table Container Skeleton
 */
export function BoneyardTableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full space-y-3 p-4 animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="h-4 bg-slate-200/90 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Product Card Skeleton (For Shop & Storefront)
 */
export function BoneyardProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      <div className="w-full aspect-square bg-slate-200/80" />
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-amber-200/60 rounded" />
          <div className="h-5 w-3/4 bg-slate-200 rounded" />
          <div className="h-3 w-full bg-slate-100 rounded" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="h-6 w-16 bg-slate-200 rounded" />
          <div className="h-9 w-24 bg-slate-800/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Blog Card Skeleton
 */
export function BoneyardBlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse flex flex-col">
      <div className="w-full h-48 bg-slate-200/80" />
      <div className="p-5 flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-emerald-200/60 rounded" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-5/6 bg-slate-200 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-2/3 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

/**
 * Customer Review Skeleton
 */
export function BoneyardReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-4 w-20 bg-amber-200/60 rounded" />
      </div>
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-3 w-4/5 bg-slate-100 rounded" />
    </div>
  );
}
