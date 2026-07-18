import { Router } from "express";
import { removeBackground } from "@imgly/background-removal-node";;
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", uploadSingle, removeBackground);

export default router;
