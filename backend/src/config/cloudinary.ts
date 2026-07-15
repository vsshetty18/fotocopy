// ====================================================
// Cloudinary Configuration
// Used for uploading, storing, and deleting all images
// (source photos, generated images, passport sheets).
// ====================================================

import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true, // always return https URLs
});

export default cloudinary;
