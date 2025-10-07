import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  bytes: number;
  created_at: string;
}

export interface UploadOptions {
  folder?: string;
  resource_type?: "auto" | "image" | "video" | "raw";
  allowed_formats?: string[];
  max_bytes?: number;
  public_id?: string;
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = "workqit/resumes",
    resource_type = "raw", // Use 'raw' for PDFs and documents
    allowed_formats = ["pdf", "docx"],
    max_bytes = 10 * 1024 * 1024, // 10MB default
    public_id,
  } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type,
      max_bytes,
      use_filename: true,
      unique_filename: true,
      access_mode: "public", // Make files publicly accessible
    };

    // Only add allowed_formats for non-raw resource types
    if (resource_type !== "raw") {
      uploadOptions.allowed_formats = allowed_formats;
    }

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else if (result) {
          console.log("Cloudinary upload successful:", {
            public_id: result.public_id,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes,
          });
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            original_filename: result.original_filename || "unknown",
            format: result.format,
            bytes: result.bytes,
            created_at: result.created_at,
          });
        } else {
          reject(new Error("Upload failed - no result returned"));
        }
      })
      .end(fileBuffer);
  });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}

/**
 * Get file URL from Cloudinary
 */
export function getCloudinaryUrl(publicId: string, options: any = {}): string {
  return cloudinary.url(publicId, {
    resource_type: "raw",
    secure: true,
    ...options,
  });
}

/**
 * Validate file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only PDF and DOCX files are allowed.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size too large. Maximum size is 10MB.",
    };
  }

  return { valid: true };
}

export default cloudinary;
