"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  StagedMediaItem,
  LocalMediaItem,
  RemoteMediaItem,
  MediaValidationConfig,
  DEFAULT_VALIDATION_CONFIG,
} from "@/types/media";
import { uploadStagedMediaQueue, UploadProgressCallback } from "@/lib/media-upload";

export interface UseStagedMediaOptions {
  initialValue?: string | string[];
  multiple?: boolean;
  maxFiles?: number;
  validationConfig?: Partial<MediaValidationConfig>;
}

export function useStagedMedia(options: UseStagedMediaOptions = {}) {
  const {
    initialValue,
    multiple = false,
    maxFiles = 10,
    validationConfig = {},
  } = options;

  const config: MediaValidationConfig = {
    ...DEFAULT_VALIDATION_CONFIG,
    ...validationConfig,
  };

  // Convert initial URL or array of URLs to RemoteMediaItems
  const parseInitial = (val?: string | string[]): StagedMediaItem[] => {
    if (!val) return [];
    const urls = Array.isArray(val) ? val.filter(Boolean) : [val].filter(Boolean);

    return urls.map((url, index) => {
      const isVideo = url.endsWith(".mp4") || url.endsWith(".webm") || url.includes("/video/upload/");
      return {
        id: `remote-${index}-${Date.now()}`,
        source: "remote",
        url,
        type: isVideo ? "video" : "image",
      } as RemoteMediaItem;
    });
  };

  const [stagedItems, setStagedItems] = useState<StagedMediaItem[]>(() => parseInitial(initialValue));
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  // Store active Blob URLs in a ref to clean them up on unmount
  const activeBlobUrlsRef = useRef<Set<string>>(new Set());

  // Memory cleanup helper
  const safeRevokeObjectURL = useCallback((url: string) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
      activeBlobUrlsRef.current.delete(url);
    }
  }, []);

  // Sync initialValue when it changes externally if user opens/edits another record
  const setInitialMedia = useCallback((val?: string | string[]) => {
    // Clean up existing local preview URLs first
    setStagedItems((prev) => {
      prev.forEach((item) => {
        if (item.source === "local") {
          safeRevokeObjectURL(item.previewUrl);
        }
      });
      return parseInitial(val);
    });
    setValidationError(null);
  }, [safeRevokeObjectURL]);

  // Clean up all Object URLs when hook unmounts
  useEffect(() => {
    const blobSet = activeBlobUrlsRef.current;
    return () => {
      blobSet.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      blobSet.clear();
    };
  }, []);

  // Validate a single File
  const validateFile = (file: File): string | null => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return `File "${file.name}" is not a supported media type.`;
    }

    if (isImage) {
      if (config.allowedImageTypes.length > 0 && !config.allowedImageTypes.includes(file.type)) {
        return `Image "${file.name}" format is not allowed. Supported formats: JPEG, PNG, WebP, AVIF.`;
      }
      if (file.size > config.maxImageSizeBytes) {
        const maxMb = (config.maxImageSizeBytes / (1024 * 1024)).toFixed(0);
        return `Image "${file.name}" exceeds maximum allowed size of ${maxMb}MB.`;
      }
    }

    if (isVideo) {
      if (config.allowedVideoTypes.length > 0 && !config.allowedVideoTypes.includes(file.type)) {
        return `Video "${file.name}" format is not allowed. Supported formats: MP4, WebM.`;
      }
      if (file.size > config.maxVideoSizeBytes) {
        const maxMb = (config.maxVideoSizeBytes / (1024 * 1024)).toFixed(0);
        return `Video "${file.name}" exceeds maximum allowed size of ${maxMb}MB.`;
      }
    }

    return null;
  };

  // Add new file(s) locally without uploading
  const addFiles = useCallback((files: FileList | File[]) => {
    setValidationError(null);
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Check max files limit
    if (multiple && stagedItems.length + fileArray.length > maxFiles) {
      setValidationError(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const newItems: LocalMediaItem[] = [];

    for (const file of fileArray) {
      const err = validateFile(file);
      if (err) {
        setValidationError(err);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      activeBlobUrlsRef.current.add(previewUrl);

      const isVideo = file.type.startsWith("video/");
      newItems.push({
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        source: "local",
        file,
        previewUrl,
        type: isVideo ? "video" : "image",
        name: file.name,
        size: file.size,
      });
    }

    setStagedItems((prev) => (multiple ? [...prev, ...newItems] : newItems));
  }, [multiple, maxFiles, stagedItems.length, safeRevokeObjectURL]);

  // Replace a specific staged item with a new local File
  const changeMedia = useCallback((id: string, newFile: File) => {
    setValidationError(null);
    const err = validateFile(newFile);
    if (err) {
      setValidationError(err);
      return;
    }

    const newPreviewUrl = URL.createObjectURL(newFile);
    activeBlobUrlsRef.current.add(newPreviewUrl);

    const isVideo = newFile.type.startsWith("video/");

    setStagedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.source === "local") {
            safeRevokeObjectURL(item.previewUrl);
          }
          return {
            id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            source: "local",
            file: newFile,
            previewUrl: newPreviewUrl,
            type: isVideo ? "video" : "image",
            name: newFile.name,
            size: newFile.size,
          } as LocalMediaItem;
        }
        return item;
      })
    );
  }, [safeRevokeObjectURL]);

  // Remove a specific media item
  const removeMedia = useCallback((id: string) => {
    setValidationError(null);
    setStagedItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target && target.source === "local") {
        safeRevokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, [safeRevokeObjectURL]);

  // Clear all staged media
  const clearAll = useCallback(() => {
    setStagedItems((prev) => {
      prev.forEach((item) => {
        if (item.source === "local") {
          safeRevokeObjectURL(item.previewUrl);
        }
      });
      return [];
    });
    setValidationError(null);
  }, [safeRevokeObjectURL]);

  // Publish / Upload all staged local media to Cloudinary
  const publishMedia = async (): Promise<{ urls: string[]; primaryUrl: string }> => {
    setIsUploading(true);
    setValidationError(null);
    setUploadMessage("Preparing media upload...");

    try {
      const progressCb: UploadProgressCallback = (_completed, _total, message) => {
        setUploadMessage(message);
      };

      const { urls } = await uploadStagedMediaQueue(stagedItems, progressCb);

      // On successful upload, clean up local preview Object URLs
      stagedItems.forEach((item) => {
        if (item.source === "local") {
          safeRevokeObjectURL(item.previewUrl);
        }
      });

      // Update stagedItems to be all remote Cloudinary items
      const updatedRemoteItems: RemoteMediaItem[] = urls.map((url, i) => ({
        id: `remote-${i}-${Date.now()}`,
        source: "remote",
        url,
        type: url.endsWith(".mp4") || url.includes("/video/upload/") ? "video" : "image",
      }));

      setStagedItems(updatedRemoteItems);

      return {
        urls,
        primaryUrl: urls[0] || "",
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload media files.";
      setValidationError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsUploading(false);
      setUploadMessage("");
    }
  };

  return {
    stagedItems,
    setInitialMedia,
    addFiles,
    changeMedia,
    removeMedia,
    clearAll,
    publishMedia,
    validationError,
    isUploading,
    uploadMessage,
    hasLocalFiles: stagedItems.some((item) => item.source === "local"),
  };
}
