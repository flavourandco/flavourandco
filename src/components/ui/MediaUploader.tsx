"use client";

import React, { useRef, useState } from "react";
import { Plus, Upload, Trash2, RefreshCw, AlertCircle, FileVideo, Check } from "lucide-react";
import { StagedMediaItem, MediaValidationConfig } from "@/types/media";
import { useStagedMedia } from "@/hooks/useStagedMedia";

export interface MediaUploaderProps {
  /**
   * Initial or current media URL(s) or staged items.
   * Can be a single string URL, array of URLs, or controlled staged items.
   */
  value?: string | string[];
  /**
   * Callback fired when media selection changes locally (before publish/upload).
   */
  onStagedChange?: (items: StagedMediaItem[]) => void;
  /**
   * Staged media controller from hook (if passed externally for form-level publishing)
   */
  stagedMedia?: ReturnType<typeof useStagedMedia>;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  aspectRatioClassName?: string;
  validationConfig?: Partial<MediaValidationConfig>;
}

export function MediaUploader(props: MediaUploaderProps) {
  const {
    value,
    onStagedChange,
    stagedMedia: externalStagedMedia,
    multiple = false,
    maxFiles = 10,
    accept = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm",
    label = multiple ? "Upload Media" : "Upload Image",
    helperText = "PNG, JPG, WebP, AVIF or MP4 (Max 10MB for images, 50MB for video)",
    disabled = false,
    aspectRatioClassName = "aspect-[4/3] w-full",
    validationConfig,
  } = props;

  // Use external hook if provided by parent form, otherwise manage locally
  const internalStagedMedia = useStagedMedia({
    initialValue: value,
    multiple,
    maxFiles,
    validationConfig,
  });

  const staged = externalStagedMedia || internalStagedMedia;
  const { stagedItems, addFiles, changeMedia, removeMedia, validationError, isUploading, uploadMessage } = staged;

  const [isDragOver, setIsDragOver] = useState(false);
  const [changingId, setChangingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const changeFileInputRef = useRef<HTMLInputElement>(null);

  // Trigger main file picker
  const handleOpenPicker = () => {
    if (disabled || isUploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Trigger change file picker for specific item
  const handleOpenChangePicker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isUploading) return;
    setChangingId(id);
    if (changeFileInputRef.current) {
      changeFileInputRef.current.value = "";
      changeFileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      if (onStagedChange) {
        onStagedChange(stagedItems);
      }
    }
  };

  const handleChangeFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (changingId && e.target.files && e.target.files[0]) {
      changeMedia(changingId, e.target.files[0]);
      setChangingId(null);
      if (onStagedChange) {
        onStagedChange(stagedItems);
      }
    }
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isUploading) return;
    removeMedia(id);
    if (onStagedChange) {
      onStagedChange(stagedItems.filter((i) => i.id !== id));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isUploading) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      if (onStagedChange) {
        onStagedChange(stagedItems);
      }
    }
  };

  // Render a preview item
  const renderItemPreview = (item: StagedMediaItem) => {
    const src = item.source === "local" ? item.previewUrl : item.url;
    const isVideo = item.type === "video";

    return (
      <div
        key={item.id}
        className={`group relative w-full ${aspectRatioClassName} rounded-sm overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs flex items-center justify-center`}
      >
        {isVideo ? (
          <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
            <video
              src={src}
              className="w-full h-full object-cover"
              muted
              playsInline
              controls={false}
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-mono font-bold rounded-sm backdrop-blur-xs flex items-center gap-1">
              <FileVideo className="w-3 h-3 text-sky-400" /> VIDEO
            </div>
          </div>
        ) : (
          <img
            src={src}
            alt={item.source === "local" ? item.name : "Uploaded media preview"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Hover Overlay Controls */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
          <button
            type="button"
            onClick={(e) => handleOpenChangePicker(item.id, e)}
            disabled={disabled || isUploading}
            aria-label="Change media file"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-sm shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
            <span>Change</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleRemove(item.id, e)}
            disabled={disabled || isUploading}
            aria-label="Remove media file"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-sm shadow-sm transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    );
  };

  const hasItems = stagedItems.length > 0;

  return (
    <div className="space-y-3 w-full">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        tabIndex={-1}
      />
      <input
        ref={changeFileInputRef}
        type="file"
        multiple={false}
        accept={accept}
        onChange={handleChangeFileSelected}
        className="hidden"
        tabIndex={-1}
      />

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-sm flex items-start gap-2 text-rose-800 text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* Uploading Status Bar */}
      {isUploading && (
        <div className="p-3 bg-slate-900 text-white rounded-sm flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="font-semibold">{uploadMessage || "Optimizing and uploading media to Cloudinary..."}</span>
          </div>
        </div>
      )}

      {/* Media Content Display */}
      {!multiple && hasItems ? (
        // Single Media Preview
        renderItemPreview(stagedItems[0])
      ) : multiple && hasItems ? (
        // Multiple Media Grid
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {stagedItems.map((item) => renderItemPreview(item))}

            {/* Add More Media Card if under max limit */}
            {stagedItems.length < maxFiles && (
              <button
                type="button"
                onClick={handleOpenPicker}
                disabled={disabled || isUploading}
                className={`flex flex-col items-center justify-center gap-1.5 ${aspectRatioClassName} rounded-sm border-2 border-dashed border-slate-300 hover:border-slate-800 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer`}
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-bold">Add Media</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {stagedItems.length} of {maxFiles} media items staged locally.
          </p>
        </div>
      ) : (
        // Empty Upload Zone
        <div
          role="button"
          tabIndex={disabled || isUploading ? -1 : 0}
          onClick={handleOpenPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenPicker();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label={label}
          className={`relative w-full ${aspectRatioClassName} rounded-sm border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none ${
            isDragOver
              ? "border-slate-900 bg-slate-100 scale-[0.99]"
              : "border-slate-300/80 hover:border-slate-800 bg-slate-50/80 hover:bg-slate-100/60"
          } ${disabled || isUploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="w-12 h-12 rounded-full bg-slate-200/80 flex items-center justify-center mb-3 text-slate-700 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>

          <p className="text-xs font-bold text-slate-900 tracking-tight">{label}</p>
          <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-relaxed font-sans">{helperText}</p>
        </div>
      )}
    </div>
  );
}
