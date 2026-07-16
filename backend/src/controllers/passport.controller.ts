// ====================================================
// Passport Controller
// Handles the "Passport Photo Generator" feature —
// upload one photo, choose copy count, get a printable
// A4 sheet as PNG or PDF.
// ====================================================

import { Response } from "express";
import sharp from "sharp";
import PDFDocument from "pdfkit";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { sendSuccess } from "../utils/response";
import { uploadBuffer } from "../services/cloudinary.service";
import { generatePassportSheet, CopyCount } from "../services/passportSheet.service";

const VALID_COPY_COUNTS: CopyCount[] = [4, 6, 8, 16];

// ----------------------------------------------------
// POST /api/passport
// multipart/form-data: field "image", body field "copies"
// ----------------------------------------------------
export const createPassportSheet = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const file = req.file as Express.Multer.File | undefined;
    const copies = Number(req.body.copies) as CopyCount;

    if (!file) {
      throw new AppError("A passport photo is required", 400);
    }

    if (!VALID_COPY_COUNTS.includes(copies)) {
      throw new AppError("Copies must be one of: 4, 6, 8, 16", 400);
    }

    // 1. Upload the original source photo (for record-keeping)
    const sourceUpload = await uploadBuffer(file.buffer, "photoai/passport-source");

    // 2. Generate the composited A4 sheet (PNG buffer)
    const sheetBuffer = await generatePassportSheet(file.buffer, copies);

    // 3. Upload the finished sheet
    const sheetUpload = await uploadBuffer(sheetBuffer, "photoai/passport-sheets");

    // 4. Save a record
    const record = await prisma.passportSheet.create({
      data: {
        userId,
        sourceUrl: sourceUpload.url,
        sheetUrl: sheetUpload.url,
        copies,
      },
    });

    sendSuccess(
      res,
      "Passport sheet generated successfully",
      {
        id: record.id,
        sheetUrl: record.sheetUrl,
        copies: record.copies,
      },
      201
    );
  }
);

// ----------------------------------------------------
// GET /api/passport/:id/download?format=png|pdf
// Streams the sheet directly as a download.
// ----------------------------------------------------
export const downloadPassportSheet = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const format = (req.query.format as string) || "png";

    const record = await prisma.passportSheet.findFirst({
      where: { id, userId },
    });

    if (!record) {
      throw new AppError("Passport sheet not found", 404);
    }

    // Fetch the stored PNG sheet from Cloudinary
    const response = await fetch(record.sheetUrl);
    const arrayBuffer = await response.arrayBuffer();
    const pngBuffer = Buffer.from(arrayBuffer);

    if (format === "pdf") {
      // Wrap the PNG into a single-page A4 PDF
      const doc = new PDFDocument({ size: "A4", margin: 0 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="passport-sheet-${record.id}.pdf"`
      );

      doc.pipe(res);
      doc.image(pngBuffer, 0, 0, { width: doc.page.width, height: doc.page.height });
      doc.end();
      return;
    }

    // Default: PNG download
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="passport-sheet-${record.id}.png"`
    );
    res.send(pngBuffer);
  }
);
