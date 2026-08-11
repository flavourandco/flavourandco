import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicId, publicIds, resourceType = "image" } = body;

    const idsToDelete: string[] = publicIds || (publicId ? [publicId] : []);

    if (idsToDelete.length === 0) {
      return NextResponse.json({ success: true, message: "No public IDs provided for deletion." });
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      // If credentials missing, log and acknowledge without throwing client error
      console.warn("Cloudinary credentials missing for asset destruction API call.");
      return NextResponse.json({
        success: false,
        error: "Cloudinary credentials missing for asset deletion.",
      });
    }

    const results = await Promise.all(
      idsToDelete.map(async (id) => {
        try {
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const paramsToSign = `public_id=${id}&timestamp=${timestamp}`;
          const signature = crypto
            .createHash("sha1")
            .update(paramsToSign + apiSecret)
            .digest("hex");

          const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;
          const formData = new FormData();
          formData.append("public_id", id);
          formData.append("api_key", apiKey);
          formData.append("timestamp", timestamp);
          formData.append("signature", signature);

          const res = await fetch(destroyUrl, { method: "POST", body: formData });
          const json = await res.json();
          return { publicId: id, result: json.result || "ok" };
        } catch (err) {
          return { publicId: id, result: "failed", error: String(err) };
        }
      })
    );

    return NextResponse.json({ success: true, data: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error deleting Cloudinary media";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
