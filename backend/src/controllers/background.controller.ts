// ====================================================
// Background Controller
// Handles the "Background Remover" feature — upload an
// image, strip the background, return a transparent PNG.
// ====================================================

import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { removeImageBackground } from "../services/backgroundRemoval.service";

// ----------------------------------------------------
// POST /api/background
// multipart/form-data: field "image"
// Streams the transparent PNG directly back — no DB
// record, no Cloudinary storage needed for this feature
// (it's a stateless one-off tool, unlike passport sheets
// or generated images which have history/dashboard value).
// ----------------------------------------------------
export const removeBackground = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      throw new AppError("An image is required", 400);
    }

    const resultBuffer = await removeImageBackground(file.buffer);

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="background-removed.png"`
    );
    res.send(resultBuffer);
  }
);
