/**
 * Cloudinary Delivery & Transformation Utility Helpers
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "thumb" | "scale";
  gravity?: "auto" | "face" | "center";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}

/**
 * Builds an optimized Cloudinary delivery URL using transformations.
 * Automatically injects f_auto, q_auto unless overridden.
 */
export function getCloudinaryUrl(
  urlOrPublicId: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!urlOrPublicId) return "";

  // If local blob URL or non-Cloudinary HTTP URL, return as-is
  if (urlOrPublicId.startsWith("blob:") || urlOrPublicId.startsWith("data:")) {
    return urlOrPublicId;
  }

  if (!urlOrPublicId.includes("res.cloudinary.com")) {
    return urlOrPublicId;
  }

  const {
    width,
    height,
    crop = "fill",
    gravity = "auto",
    quality = "auto",
    format = "auto",
  } = options;

  const transforms: string[] = [];

  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) {
    transforms.push(`c_${crop}`);
    if (gravity) transforms.push(`g_${gravity}`);
  }

  const transformString = transforms.join(",");

  // Insert transformations into existing Cloudinary URL
  // Standard format: https://res.cloudinary.com/<cloud>/<resource_type>/upload/<version>/<public_id>
  const uploadIndex = urlOrPublicId.indexOf("/upload/");
  if (uploadIndex !== -1) {
    const prefix = urlOrPublicId.substring(0, uploadIndex + 8);
    const suffix = urlOrPublicId.substring(uploadIndex + 8);

    // If already has transformations before version/public_id, avoid duplicating
    if (suffix.startsWith("f_") || suffix.startsWith("w_") || suffix.startsWith("c_")) {
      const parts = suffix.split("/");
      parts[0] = transformString;
      return `${prefix}${parts.join("/")}`;
    }

    return `${prefix}${transformString}/${suffix}`;
  }

  return urlOrPublicId;
}

/**
 * Extracts publicId and resourceType from a Cloudinary URL
 */
export function parseCloudinaryUrl(url: string): {
  publicId?: string;
  resourceType?: "image" | "video";
} {
  if (!url || !url.includes("res.cloudinary.com")) {
    return {};
  }

  const isVideo = url.includes("/video/upload/");
  const resourceType = isVideo ? "video" : "image";

  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return { resourceType };

  let pathAfterUpload = url.substring(uploadIndex + 8);

  // Remove transformations if present
  const parts = pathAfterUpload.split("/");
  if (parts[0].includes("_") || parts[0].includes(",")) {
    parts.shift();
  }

  // Remove version (v123456789)
  if (parts[0] && /^v\d+$/.test(parts[0])) {
    parts.shift();
  }

  const fileWithExt = parts.join("/");
  const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf(".")) || fileWithExt;

  return { publicId, resourceType };
}
