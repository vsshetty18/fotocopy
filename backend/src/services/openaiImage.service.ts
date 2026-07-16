// ====================================================
// OpenAI Image Service
// Wraps the OpenAI Images API for the "Generate Image"
// feature (text prompt → generated image).
// ====================================================

import OpenAI from "openai";
import { env } from "../config/env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export interface GeneratedImageResult {
  base64: string; // base64-encoded PNG data (no data URL prefix)
}

/**
 * Generate an image from a text prompt using OpenAI's
 * Images API.
 *
 * @param prompt User's text description
 * @returns Base64-encoded image data
 */
export async function generateImageFromPrompt(
  prompt: string
): Promise<GeneratedImageResult> {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error("Prompt cannot be empty");
  }

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: prompt.trim(),
    size: "1024x1024",
    n: 1,
  });

  const imageData = response.data?.[0]?.b64_json;

  if (!imageData) {
    throw new Error("Image generation failed — no data returned");
  }

  return { base64: imageData };
}
