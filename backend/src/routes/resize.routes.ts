import { Router } from "express";
import { resizeImageHandler } from "../controllers/resize.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", uploadSingle, resizeImageHandler);

export default router;
