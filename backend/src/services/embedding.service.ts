// ====================================================
// Embedding Service
// Handles comparing face embeddings and grouping faces
// into People using cosine similarity.
// This is pure math — no external API calls — so it's
// fast and free to run on every upload.
// ====================================================

import { prisma } from "../config/prisma";

// Faces with cosine similarity ABOVE this threshold are
// considered the same person. Tuned conservatively —
// higher = fewer false merges, more distinct people.
const SIMILARITY_THRESHOLD = 0.6;

/**
 * Compute cosine similarity between two embedding vectors.
 * Returns a value between -1 and 1 (1 = identical direction).
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Embedding vectors must be the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Given a new face's embedding, find the best matching
 * existing Person (for this user) by comparing against
 * one representative face embedding per person.
 *
 * Strategy: compare against the FIRST face of each person
 * (their "anchor" face) — simple and fast, good enough for
 * a college-scale dataset. Avoids O(n²) comparisons against
 * every single face in the database.
 *
 * @param newEmbedding Embedding vector of the newly detected face
 * @param userId Owner of the faces (people are scoped per user)
 * @returns personId of best match, or null if no match found
 */
export async function findMatchingPerson(
  newEmbedding: number[],
  userId: string
): Promise<string | null> {
  // Get one anchor face per existing person for this user
  const people = await prisma.person.findMany({
    where: { userId },
    include: {
      faces: {
        take: 1,
        orderBy: { createdAt: "asc" },
      },
    },
  });

  let bestMatch: { personId: string; similarity: number } | null = null;

  for (const person of people) {
    const anchorFace = person.faces[0];
    if (!anchorFace) continue;

    const similarity = cosineSimilarity(newEmbedding, anchorFace.embedding);

    if (
      similarity >= SIMILARITY_THRESHOLD &&
      (!bestMatch || similarity > bestMatch.similarity)
    ) {
      bestMatch = { personId: person.id, similarity };
    }
  }

  return bestMatch ? bestMatch.personId : null;
}

/**
 * Group a single detected face: either attach it to an
 * existing matching Person, or create a new Person.
 *
 * @param embedding Face embedding vector
 * @param userId Owner of the face
 * @param faceUrl Cropped face thumbnail URL (used as new Person's coverUrl)
 * @returns The personId the face was assigned to
 */
export async function groupFace(
  embedding: number[],
  userId: string,
  faceUrl?: string
): Promise<string> {
  const matchedPersonId = await findMatchingPerson(embedding, userId);

  if (matchedPersonId) {
    return matchedPersonId;
  }

  // No match found — create a new Person ("Unknown" until renamed)
  const newPerson = await prisma.person.create({
    data: {
      userId,
      name: "Unknown",
      coverUrl: faceUrl || null,
    },
  });

  return newPerson.id;
}
