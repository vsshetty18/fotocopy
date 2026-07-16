// ====================================================
// Cloudinary Service
// Centralizes all upload/delete logic so controllers
// never talk to the Cloudinary SDK directly.
// ====================================================

import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Upload a file buffer to Cloudinary using an upload stream.
 * Used for all image uploads (gallery, passport photo, etc).
 *
 * @param buffer Raw file buffer (from multer memoryStorage)
 * @param folder Cloudinary folder to organize uploads (e.g. "photoai/gallery")
 */
export function uploadBuffer(
  buffer: Buffer,
  folder: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Upload an image from a base64 data URL (used for generated
 * images and processed images like background-removed PNGs).
 *
 * @param base64Data Full data URL string (e.g. "data:image/png;base64,...")
 * @param folder Cloudinary folder
 */
export async function uploadBase64(
  base64Data: string,
  folder: string
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Delete an image from Cloudinary by its public_id.
 * Used when a user deletes a photo from their gallery.
 *
 * @param publicId Cloudinary public_id stored on the Image record
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
