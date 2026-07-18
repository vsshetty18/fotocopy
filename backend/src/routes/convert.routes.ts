import { Router } from "express";
import { convertImageHandler } from "../controllers/convert.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", uploadSingle, convertImageHandler);

export default router;
