import { Router } from "express";
import { searchByName } from "../controllers/search.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", searchByName);

export default router;
