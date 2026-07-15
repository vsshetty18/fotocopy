// ====================================================
// Upload Middleware (Multer)
// Handles multipart/form-data file uploads in memory,
// so buffers can be piped directly to Cloudinary
// without writing to disk (important for Render's
// ephemeral filesystem).
// ====================================================

import multer from "multer";
import { Request } from "express";

// Store files in memory as Buffers — never on disk.
// Render's filesystem is ephemeral, so disk storage
// would be lost on every restart/redeploy.
const storage = multer.memoryStorage();

// Only allow common image formats
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, JPEG, and WEBP images are allowed"));
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB per file
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});

// Pre-configured exports for common use cases:

// Single image upload (e.g. passport photo, background remover)
export const uploadSingle = upload.single("image");

// Multiple images (e.g. main gallery upload — up to 20 at once)
export const uploadMultiple = upload.array("images", 20);
