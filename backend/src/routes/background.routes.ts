// ====================================================
// Background Routes
// ====================================================

import { Router } from "express";
import { removeBackground } from "../controllers/background.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";

const router = Router();

router.use(authMiddleware);

// POST /api/background
router.post("/", uploadSingle, removeBackground);

export default router;
