import { Router } from "express";
import { uploadImages } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadMultiple } from "../middleware/upload.middleware";

const router = Router();

router.post("/", authMiddleware, uploadMultiple, uploadImages);

export default router;
