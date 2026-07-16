// ====================================================
// Search Controller
// Search for a person by name and return their photos.
// (Thin wrapper around the same logic as people.controller,
// but matches by name instead of by ID — powers the
// dedicated Search page.)
// ====================================================

import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { sendSuccess } from "../utils/response";

// ----------------------------------------------------
// GET /api/search?name=vighnesh
// Case-insensitive partial match on person name.
// ----------------------------------------------------
export const searchByName = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { name } = req.query;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new AppError("A search 'name' query parameter is required", 400);
    }

    // Find matching people (case-insensitive contains)
    const people = await prisma.person.findMany({
      where: {
        userId,
        name: { contains: name.trim(), mode: "insensitive" },
      },
      include: {
        faces: {
          include: { image: true },
        },
      },
    });

    // Flatten into a single photo list across all matched people,
    // deduping by imageId (same reasoning as people.controller).
    const seenImageIds = new Set<string>();
    const photos: { id: string; url: string; personName: string }[] = [];

    for (const person of people) {
      for (const face of person.faces) {
        if (seenImageIds.has(face.imageId)) continue;
        seenImageIds.add(face.imageId);
        photos.push({
          id: face.image.id,
          url: face.image.url,
          personName: person.name,
        });
      }
    }

    sendSuccess(res, "Search results fetched successfully", {
      matchedPeople: people.map((p) => ({ id: p.id, name: p.name })),
      photos,
    });
  }
);
