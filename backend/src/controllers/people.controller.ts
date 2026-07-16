// ====================================================
// People Controller
// Handles listing people, viewing a person's photos,
// and renaming a person (e.g. "Unknown" → "Vighnesh").
// ====================================================

import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { sendSuccess } from "../utils/response";

// ----------------------------------------------------
// GET /api/people
// Returns all people for the logged-in user, with a
// photo count for each — powers the People grid page.
// ----------------------------------------------------
export const getPeople = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const people = await prisma.person.findMany({
    where: { userId },
    include: {
      _count: {
        select: { faces: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Reshape into a clean response — frontend just needs
  // id, name, coverUrl, and photoCount per person.
  const formatted = people.map((person) => ({
    id: person.id,
    name: person.name,
    coverUrl: person.coverUrl,
    photoCount: person._count.faces,
  }));

  sendSuccess(res, "People fetched successfully", { people: formatted });
});

// ----------------------------------------------------
// GET /api/people/:personId
// Returns all photos containing this person.
// ----------------------------------------------------
export const getPersonPhotos = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { personId } = req.params;

    // Verify the person exists and belongs to this user
    const person = await prisma.person.findFirst({
      where: { id: personId, userId },
    });

    if (!person) {
      throw new AppError("Person not found", 404);
    }

    // Get all faces for this person, each linked to its image.
    // A photo could theoretically contain this person twice
    // (rare, but dedupe by imageId just in case).
    const faces = await prisma.face.findMany({
      where: { personId },
      include: { image: true },
      orderBy: { createdAt: "desc" },
    });

    const seenImageIds = new Set<string>();
    const photos = faces
      .filter((face) => {
        if (seenImageIds.has(face.imageId)) return false;
        seenImageIds.add(face.imageId);
        return true;
      })
      .map((face) => ({
        id: face.image.id,
        url: face.image.url,
        createdAt: face.image.createdAt,
      }));

    sendSuccess(res, "Person's photos fetched successfully", {
      person: { id: person.id, name: person.name },
      photos,
    });
  }
);

// ----------------------------------------------------
// PATCH /api/people/:personId
// Rename a person (e.g. "Unknown" → "Vighnesh").
// ----------------------------------------------------
export const renamePerson = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { personId } = req.params;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      throw new AppError("Name cannot be empty", 400);
    }

    const person = await prisma.person.findFirst({
      where: { id: personId, userId },
    });

    if (!person) {
      throw new AppError("Person not found", 404);
    }

    const updated = await prisma.person.update({
      where: { id: personId },
      data: { name: name.trim() },
    });

    sendSuccess(res, "Person renamed successfully", {
      person: { id: updated.id, name: updated.name },
    });
  }
);
