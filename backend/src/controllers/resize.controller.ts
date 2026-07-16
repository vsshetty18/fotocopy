// ====================================================
// Resize Controller
// Handles the "Image Resize" feature — presets or
// custom width/height, returns resized image directly.
// ====================================================

import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { resizeImage, ResizePreset } from "../services/imageTransform.service";

const VALID_PRESETS: ResizePreset[] = [
  "instagram",
  "linkedin",
  "passport",
  "square",
  "landscape",
  "portrait",
];

// ----------------------------------------------------
// POST /api/resize
// multipart/form-data: field "image"
// body fields: "preset" (optional) OR "width"/"height"
// ----------------------------------------------------
export const resizeImageHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const file = req.file as Express.Multer.File | undefined;
    const { preset, width, height } = req.body;

    if (!file) {
      throw new AppError("An image is required", 400);
    }

    // Validate: must provide EITHER a valid preset OR both width+height
    const hasPreset = preset && VALID_PRESETS.includes(preset);
    const hasCustomDimensions = width && height;

    if (!hasPreset && !hasCustomDimensions) {
      throw new AppError(
        "Provide a valid preset OR both width and height",
        400
      );
    }

    const resizedBuffer = await resizeImage(file.buffer, {
      preset: hasPreset ? (preset as ResizePreset) : undefined,
      width: hasCustomDimensions ? Number(width) : undefined,
      height: hasCustomDimensions ? Number(height) : undefined,
    });

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resized-image.jpg"`
    );
    res.send(resizedBuffer);
  }
);
