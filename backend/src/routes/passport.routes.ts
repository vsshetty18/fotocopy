import { Router } from "express";
import {
  createPassportSheet,
  downloadPassportSheet,
} from "../controllers/passport.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", uploadSingle, createPassportSheet);
router.get("/:id/download", downloadPassportSheet);

export default router;
