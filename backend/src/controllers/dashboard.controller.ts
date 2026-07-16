// ====================================================
// Dashboard Controller
// Aggregates stats across all features for the
// Dashboard page: totals + recent uploads.
// ====================================================

import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";
import { sendSuccess } from "../utils/response";

// ----------------------------------------------------
// GET /api/dashboard
// Returns aggregate counts + recent uploads for the
// logged-in user.
// ----------------------------------------------------
export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    // Run all counts + recent uploads query concurrently —
    // independent reads, no need to wait sequentially.
    const [
      totalImages,
      totalPeople,
      totalGeneratedImages,
      totalPassportSheets,
      recentUploads,
    ] = await Promise.all([
      prisma.image.count({ where: { userId } }),
      prisma.person.count({ where: { userId } }),
      prisma.generatedImage.count({ where: { userId } }),
      prisma.passportSheet.count({ where: { userId } }),
      prisma.image.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, url: true, createdAt: true },
      }),
    ]);

    sendSuccess(res, "Dashboard stats fetched successfully", {
      stats: {
        totalImages,
        totalPeople,
        totalGeneratedImages,
        totalPassportSheets,
      },
      recentUploads,
    });
  }
);
