import { Router } from "express";
import {
  generateImage,
  getGeneratedImages,
} from "../controllers/generate.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", generateImage);
router.get("/", getGeneratedImages);

export default router;
