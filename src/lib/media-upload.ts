import { StagedMediaItem, MediaUploadResult, LocalMediaItem } from "@/types/media";
import { optimizeImage } from "./media-optimizer";

export interface UploadProgressCallback {
  (completedCount: number, totalCount: number, message: string): void;
}

export interface UploadQueueResult {
  urls: string[];
  results: MediaUploadResult[];
}

/**
 * Uploads staged media items with controlled concurrency queue.
 * - Remote URLs are passed through as-is.
 * - Local files are optimized first using client-side image compression.
 * - Uploads local files in controlled batches (default limit: 2).
 * - Tracks accurate progress (e.g. "Uploading 2 of 5 files...").
 * - Cleans up uploaded Cloudinary temporary assets if any batch item fails.
 */
export async function uploadStagedMediaQueue(
  items: StagedMediaItem[],
  onProgress?: UploadProgressCallback,
  concurrencyLimit = 2
): Promise<UploadQueueResult> {
  const localItems = items.filter((item): item is LocalMediaItem => item.source === "local");
  const totalLocalCount = localItems.length;

  if (totalLocalCount === 0) {
    // All items are already remote Cloudinary URLs
    const urls = items.map((i) => (i.source === "remote" ? i.url : ""));
    const results: MediaUploadResult[] = items
      .filter((i) => i.source === "remote")
      .map((i) => ({
        url: (i as any).url,
        publicId: (i as any).publicId || "",
        resourceType: i.type,
      }));

    return { urls, results };
  }

  onProgress?.(0, totalLocalCount, `Preparing ${totalLocalCount} file(s) for upload...`);

  // Step 1: Client-side optimization of local files
  const optimizedItems: { item: LocalMediaItem; optimizedFile: File }[] = [];
  for (let i = 0; i < localItems.length; i++) {
    const local = localItems[i];
    onProgress?.(
      i,
      totalLocalCount,
      `Optimizing media ${i + 1} of ${totalLocalCount}...`
    );

    const optFile = await optimizeImage(local.file);
    optimizedItems.push({ item: local, optimizedFile: optFile });
  }

  // Step 2: Controlled Concurrency Upload Queue
  const uploadResultsMap = new Map<string, MediaUploadResult>();
  const uploadedPublicIds: string[] = [];
  let completedCount = 0;

  onProgress?.(0, totalLocalCount, `Uploading 0 of ${totalLocalCount}...`);

  // Helper worker function to process queue items with concurrency limit
  const queue = [...optimizedItems];

  const worker = async () => {
    while (queue.length > 0) {
      const nextTask = queue.shift();
      if (!nextTask) break;

      const { item, optimizedFile } = nextTask;

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", "flavourandco");

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || `Failed to upload "${item.name}".`);
      }

      const resultData: MediaUploadResult = json.data;
      uploadResultsMap.set(item.id, resultData);

      if (resultData.publicId) {
        uploadedPublicIds.push(resultData.publicId);
      }

      completedCount++;
      onProgress?.(
        completedCount,
        totalLocalCount,
        `Uploaded ${completedCount} of ${totalLocalCount} media files...`
      );
    }
  };

  try {
    // Run worker tasks concurrently up to concurrencyLimit
    const workerPromises = Array.from(
      { length: Math.min(concurrencyLimit, totalLocalCount) },
      () => worker()
    );

    await Promise.all(workerPromises);
  } catch (error) {
    // FAILED UPLOAD CLEANUP: Trigger server cleanup for any Cloudinary assets created in this batch
    if (uploadedPublicIds.length > 0) {
      try {
        await fetch("/api/admin/media/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicIds: uploadedPublicIds }),
        });
      } catch (cleanupErr) {
        console.error("Error cleaning up orphaned Cloudinary assets after failure:", cleanupErr);
      }
    }
    throw error;
  }

  // Map final result back to original items array order
  const finalUrls: string[] = [];
  const finalResults: MediaUploadResult[] = [];

  for (const item of items) {
    if (item.source === "remote") {
      finalUrls.push(item.url);
      finalResults.push({
        url: item.url,
        publicId: item.publicId || "",
        resourceType: item.type,
      });
    } else {
      const res = uploadResultsMap.get(item.id);
      if (res) {
        finalUrls.push(res.url);
        finalResults.push(res);
      }
    }
  }

  return { urls: finalUrls, results: finalResults };
}
