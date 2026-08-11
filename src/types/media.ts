export type MediaType = "image" | "video";
export type MediaSourceType = "local" | "remote";

export interface LocalMediaItem {
  id: string;
  source: "local";
  file: File;
  previewUrl: string;
  type: MediaType;
  name: string;
  size: number;
}

export interface RemoteMediaItem {
  id: string;
  source: "remote";
  url: string;
  publicId?: string;
  type: MediaType;
}

export type StagedMediaItem = LocalMediaItem | RemoteMediaItem;

export interface MediaUploadResult {
  url: string;
  publicId: string;
  resourceType: MediaType;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface MediaOptimizerConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: "image/webp" | "image/jpeg" | "image/png";
}

export interface MediaValidationConfig {
  maxImageSizeBytes: number;
  maxVideoSizeBytes: number;
  allowedImageTypes: string[];
  allowedVideoTypes: string[];
  maxFiles?: number;
}

export const DEFAULT_VALIDATION_CONFIG: MediaValidationConfig = {
  maxImageSizeBytes: 10 * 1024 * 1024, // 10MB
  maxVideoSizeBytes: 50 * 1024 * 1024, // 50MB
  allowedImageTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"],
  allowedVideoTypes: ["video/mp4", "video/webm"],
  maxFiles: 10,
};

export const DEFAULT_OPTIMIZER_CONFIG: MediaOptimizerConfig = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: "image/webp",
};
