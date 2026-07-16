// ====================================================
// Passport Sheet Service
// Composes N copies of a passport photo onto a single
// printable A4 sheet with equal spacing, using Sharp's
// compositing API.
// ====================================================

import sharp from "sharp";

export type CopyCount = 4 | 6 | 8 | 16;

// A4 at 300 DPI (standard print resolution)
const A4_WIDTH_PX = 2480;
const A4_HEIGHT_PX = 3508;

// Standard passport photo size at 300 DPI (35mm x 45mm)
const PHOTO_WIDTH_PX = 413;
const PHOTO_HEIGHT_PX = 531;

const MARGIN_PX = 60; // outer sheet margin
const GAP_PX = 30;    // spacing between photos

// Grid layout (columns x rows) per copy count — chosen to
// fit comfortably within A4 with equal spacing.
const GRID_LAYOUT: Record<CopyCount, { cols: number; rows: number }> = {
  4: { cols: 2, rows: 2 },
  6: { cols: 3, rows: 2 },
  8: { cols: 4, rows: 2 },
  16: { cols: 4, rows: 4 },
};

/**
 * Generate an A4 sheet containing multiple copies of a
 * single passport photo, evenly spaced.
 *
 * @param photoBuffer Source passport photo (already cropped to ratio)
 * @param copies Number of copies to place (4, 6, 8, or 16)
 * @returns PNG buffer of the full A4 sheet
 */
export async function generatePassportSheet(
  photoBuffer: Buffer,
  copies: CopyCount
): Promise<Buffer> {
  const { cols, rows } = GRID_LAYOUT[copies];

  // Resize the source photo to the standard passport dimensions
  const resizedPhoto = await sharp(photoBuffer)
    .resize(PHOTO_WIDTH_PX, PHOTO_HEIGHT_PX, { fit: "cover" })
    .toBuffer();

  // Calculate total grid width/height to center it on the sheet
  const gridWidth = cols * PHOTO_WIDTH_PX + (cols - 1) * GAP_PX;
  const gridHeight = rows * PHOTO_HEIGHT_PX + (rows - 1) * GAP_PX;

  const offsetX = Math.round((A4_WIDTH_PX - gridWidth) / 2);
  const offsetY = Math.round((A4_HEIGHT_PX - gridHeight) / 2);

  // Build composite instructions — one entry per photo copy
  const composites: sharp.OverlayOptions[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = offsetX + col * (PHOTO_WIDTH_PX + GAP_PX);
      const top = offsetY + row * (PHOTO_HEIGHT_PX + GAP_PX);

      composites.push({
        input: resizedPhoto,
        left,
        top,
      });
    }
  }

  // Create a blank white A4 canvas and composite all copies onto it
  const sheet = await sharp({
    create: {
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  return sheet;
}
