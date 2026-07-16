// ====================================================
// Upload Controller
// Handles multi-image upload: saves to Cloudinary,
// detects faces, and groups them into People —
// this is the core "Google Photos style" workflow.
// ====================================================

import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { sendSuccess } from "../utils/response";
import { uploadBuffer } from "../services/cloudinary.service";
import { detectFaces } from "../services/faceRecognition.service";
import { groupFace } from "../services/embedding.service";

// ----------------------------------------------------
// POST /api/upload
// Accepts multiple images (multipart/form-data, field "images")
// ----------------------------------------------------
export const uploadImages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;
    const userId = req.user!.userId;

    if (!files || files.length === 0) {
      throw new AppError("At least one image is required", 400);
    }

    // Process each image: upload → detect faces → group → save
    const results = await Promise.all(
      files.map((file) => processSingleImage(file, userId))
    );

    sendSuccess(
      res,
      `${results.length} image(s) uploaded successfully`,
      { images: results },
      201
    );
  }
);

// ----------------------------------------------------
// Helper: process one image end-to-end.
// Kept outside the handler so Promise.all() above stays
// readable and each image's failure doesn't need its
// own inline try/catch block.
// ----------------------------------------------------
async function processSingleImage(file: Express.Multer.File, userId: string) {
  // 1. Upload original image to Cloudinary
  const uploaded = await uploadBuffer(file.buffer, "photoai/gallery");

  // 2. Save the image record immediately — so the upload
  //    succeeds even if face detection fails or is slow.
  const image = await prisma.image.create({
    data: {
      userId,
      url: uploaded.url,
      publicId: uploaded.publicId,
      width: uploaded.width,
      height: uploaded.height,
      format: uploaded.format,
    },
  });

  // 3. Detect faces via the Python InsightFace microservice.
  //    Returns [] gracefully if the service is down — see
  //    faceRecognition.service.ts for that fallback behavior.
  const detectedFaces = await detectFaces(uploaded.url);

  // 4. Group each detected face into a Person and save it.
  for (const face of detectedFaces) {
    const personId = await groupFace(face.embedding, userId, uploaded.url);

    await prisma.face.create({
      data: {
        imageId: image.id,
        personId,
        embedding: face.embedding,
        boxX: face.box.x,
        boxY: face.box.y,
        boxWidth: face.box.width,
        boxHeight: face.box.height,
      },
    });
  }

  return {
    id: image.id,
    url: image.url,
    facesDetected: detectedFaces.length,
  };
}
