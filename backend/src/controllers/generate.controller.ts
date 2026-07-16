// ====================================================
// Generate Controller
// Handles the "Generate Image" feature — text prompt
// in, AI-generated image out, saved to Cloudinary + DB.
// ====================================================

import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { sendSuccess } from "../utils/response";
import { generateImageFromPrompt } from "../services/openaiImage.service";
import { uploadBase64 } from "../services/cloudinary.service";

// ----------------------------------------------------
// POST /api/generate
// Body: { prompt: string }
// ----------------------------------------------------
export const generateImage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new AppError("A prompt is required", 400);
    }

    if (prompt.trim().length > 1000) {
      throw new AppError("Prompt is too long (max 1000 characters)", 400);
    }

    // 1. Call OpenAI to generate the image (returns base64)
    const result = await generateImageFromPrompt(prompt.trim());

    // 2. Upload the base64 image to Cloudinary for permanent storage
    const dataUrl = `data:image/png;base64,${result.base64}`;
    const uploaded = await uploadBase64(dataUrl, "photoai/generated");

    // 3. Save a record so it shows up in the dashboard/history
    const generatedImage = await prisma.generatedImage.create({
      data: {
        userId,
        prompt: prompt.trim(),
        url: uploaded.url,
      },
    });

    sendSuccess(
      res,
      "Image generated successfully",
      {
        id: generatedImage.id,
        prompt: generatedImage.prompt,
        url: generatedImage.url,
        createdAt: generatedImage.createdAt,
      },
      201
    );
  }
);

// ----------------------------------------------------
// GET /api/generate
// Returns the user's generation history.
// ----------------------------------------------------
export const getGeneratedImages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const images = await prisma.generatedImage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, "Generated images fetched successfully", { images });
  }
);
