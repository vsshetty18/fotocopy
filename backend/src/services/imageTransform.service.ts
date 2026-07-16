// ====================================================
// Image Transform Service
// Pure Node/Sharp logic for resizing and format
// conversion. No external service needed — Sharp runs
// natively in this backend.
// ====================================================

import sharp from "sharp";

export type ImageFormat = "png" | "jpg" | "jpeg" | "webp";

export interface ResizeOptions {
  width?: number;
  height?: number;
  preset?: ResizePreset;
}

// Common presets requested in the spec
export type ResizePreset =
  | "instagram"
  | "linkedin"
  | "passport"
  | "square"
  | "landscape"
  | "portrait";

// Dimensions for each named preset (width x height, in px)
const PRESET_DIMENSIONS: Record<ResizePreset, { width: number; height: number }> = {
  instagram: { width: 1080, height: 1080 },
  linkedin: { width: 1128, height: 191 },   // LinkedIn banner-style crop
  passport: { width: 413, height: 531 },    // standard 35x45mm at ~300dpi
  square: { width: 1000, height: 1000 },
  landscape: { width: 1600, height: 900 },
  portrait: { width: 900, height: 1600 },
};

/**
 * Resize an image buffer to either a named preset or
 * explicit custom width/height.
 *
 * @param buffer Source image buffer
 * @param options Preset name OR custom width/height
 * @returns Resized image buffer (same format as input)
 */
export async function resizeImage(
  buffer: Buffer,
  options: ResizeOptions
): Promise<Buffer> {
  let targetWidth = options.width;
  let targetHeight = options.height;

  if (options.preset) {
    const preset = PRESET_DIMENSIONS[options.preset];
    targetWidth = preset.width;
    targetHeight = preset.height;
  }

  if (!targetWidth && !targetHeight) {
    throw new Error("Either a preset or width/height must be provided");
  }

  return sharp(buffer)
    .resize(targetWidth, targetHeight, {
      fit: "cover",       // crop to fill exact dimensions (standard for presets)
      position: "centre",
    })
    .toBuffer();
}

/**
 * Convert an image buffer to a different format.
 *
 * @param buffer Source image buffer
 * @param format Target format (png, jpg, jpeg, webp)
 * @returns Converted image buffer
 */
export async function convertFormat(
  buffer: Buffer,
  format: ImageFormat
): Promise<Buffer> {
  const image = sharp(buffer);

  switch (format) {
    case "png":
      return image.png().toBuffer();
    case "jpg":
    case "jpeg":
      return image.jpeg({ quality: 90 }).toBuffer();
    case "webp":
      return image.webp({ quality: 90 }).toBuffer();
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
