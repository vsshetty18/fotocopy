// ====================================================
// Convert Controller
// Handles the "Image Format Conversion" feature —
// PNG / JPG / JPEG / WEBP.
// ====================================================

import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { convertFormat, ImageFormat } from "../services/imageTransform.service";

const VALID_FORMATS: ImageFormat[] = ["png", "jpg", "jpeg", "webp"];

const MIME_TYPES: Record<ImageFormat, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export const convertImageHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const file = req.file as Express.Multer.File | undefined;
    const { format } = req.body;

    if (!file) {
      throw new AppError("An image is required", 400);
    }

    if (!format || !VALID_FORMATS.includes(format)) {
      throw new AppError(
        `Format must be one of: ${VALID_FORMATS.join(", ")}`,
        400
      );
    }

    const convertedBuffer = await convertFormat(file.buffer, format as ImageFormat);

    res.setHeader("Content-Type", MIME_TYPES[format as ImageFormat]);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="converted-image.${format}"`
    );
    res.send(convertedBuffer);
  }
);
