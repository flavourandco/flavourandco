import { MediaOptimizerConfig, DEFAULT_OPTIMIZER_CONFIG } from "@/types/media";

/**
 * Optimizes an image File on the client side using HTML5 Canvas API.
 * - Resizes images exceeding max dimensions while maintaining aspect ratio (never upscales).
 * - Compresses image to target quality (default 0.85).
 * - Converts image to target format (default image/webp).
 * - Strips EXIF metadata.
 * - Returns original File if optimization is not applicable (e.g. video, SVG, or already small).
 */
export async function optimizeImage(
  file: File,
  configOptions: Partial<MediaOptimizerConfig> = {}
): Promise<File> {
  // Config defaults
  const config: MediaOptimizerConfig = {
    ...DEFAULT_OPTIMIZER_CONFIG,
    ...configOptions,
  };

  // Skip videos or SVGs or non-image files
  if (!file.type.startsWith("image/") || file.type.includes("svg+xml")) {
    return file;
  }

  // Skip if file is already very small (< 100 KB) unless format conversion is explicitly requested
  if (file.size < 100 * 1024 && file.type === config.format) {
    return file;
  }

  return new Promise<File>((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (!width || !height) {
        resolve(file);
        return;
      }

      // Calculate new dimensions (downscale only)
      if (width > config.maxWidth || height > config.maxHeight) {
        const widthRatio = config.maxWidth / width;
        const heightRatio = config.maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Draw onto canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      // Smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Export canvas to Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // If optimized blob is larger than original file and format didn't change, keep original
          if (blob.size >= file.size && file.type === config.format) {
            resolve(file);
            return;
          }

          // Generate file extension matching output format
          const extMap: Record<string, string> = {
            "image/webp": ".webp",
            "image/jpeg": ".jpg",
            "image/png": ".png",
          };
          const ext = extMap[config.format] || ".webp";
          const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
          const optimizedFileName = `${baseName}_opt${ext}`;

          const optimizedFile = new File([blob], optimizedFileName, {
            type: config.format,
            lastModified: Date.now(),
          });

          resolve(optimizedFile);
        },
        config.format,
        config.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
