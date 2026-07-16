// ====================================================
// Background Removal Service
// Uses @imgly/background-removal-node (runs entirely
// in Node via ONNX runtime) — no external API key,
// no Python microservice, no Docker needed.
// ====================================================

import { removeBackground } from "@imgly/background-removal-node";

/**
 * Remove the background from an image buffer and return
 * a transparent PNG buffer.
 *
 * @param buffer Source image buffer (JPG, PNG, or WEBP)
 * @returns PNG buffer with background removed (transparent)
 */
export async function removeImageBackground(buffer: Buffer): Promise<Buffer> {
  // The library accepts a Blob-like input; we convert the
  // Buffer into one using a Blob wrapper.
  const blob = new Blob([buffer]);

  const resultBlob = await removeBackground(blob);

  // Convert the resulting Blob back into a Buffer for
  // uploading to Cloudinary / sending in the response.
  const arrayBuffer = await resultBlob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
