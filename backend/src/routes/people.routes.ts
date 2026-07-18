import { Router } from "express";
import {
  getPeople,
  getPersonPhotos,
  renamePerson,
} from "../controllers/people.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getPeople);
router.get("/:personId", getPersonPhotos);
router.patch("/:personId", renamePerson);

export default router;
