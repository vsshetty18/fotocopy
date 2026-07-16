// ====================================================
// Auth Routes
// Public routes for user registration and login.
// ====================================================

import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me (protected — returns current logged-in user)
router.get("/me", authMiddleware, getMe);

export default router;
