import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "flavourandco";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided for upload." },
        { status: 400 }
      );
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset =
      process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Detect resource type: image or video
    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    // If Cloudinary environment is fully missing, return structured error or fallback
    if (!cloudName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary cloud name is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or CLOUDINARY_CLOUD_NAME in .env",
        },
        { status: 500 }
      );
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    const uploadData = new FormData();
    uploadData.append("file", file);

    if (apiKey && apiSecret) {
      // Signed Upload Strategy (Most Secure)
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
      const signature = crypto
        .createHash("sha1")
        .update(paramsToSign + apiSecret)
        .digest("hex");

      uploadData.append("api_key", apiKey);
      uploadData.append("timestamp", timestamp);
      uploadData.append("signature", signature);
      uploadData.append("folder", folder);
    } else if (uploadPreset) {
      // Unsigned Upload Strategy
      uploadData.append("upload_preset", uploadPreset);
      uploadData.append("folder", folder);
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary upload configuration missing. Set CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
        },
        { status: 500 }
      );
    }

    const res = await fetch(cloudinaryUrl, {
      method: "POST",
      body: uploadData,
    });

    const json = await res.json();

    if (!res.ok || json.error) {
      return NextResponse.json(
        {
          success: false,
          error: json.error?.message || "Failed to upload file to Cloudinary.",
        },
        { status: res.status || 500 }
      );
    }

    // Standardize result structure
    return NextResponse.json({
      success: true,
      data: {
        url: json.secure_url || json.url,
        publicId: json.public_id,
        resourceType: json.resource_type || resourceType,
        width: json.width,
        height: json.height,
        format: json.format,
        bytes: json.bytes,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error during media upload";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
