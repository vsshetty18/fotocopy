// ====================================================
// Auth Controller
// Handles registration, login, and fetching the
// currently authenticated user.
// ====================================================

import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { sendSuccess } from "../utils/response";
import { asyncHandler, AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

// ----------------------------------------------------
// POST /api/auth/register
// ----------------------------------------------------
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Basic validation
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
  });

  // Issue JWT immediately so the user is logged in after registering
  const token = signToken({ userId: user.id, email: user.email });

  sendSuccess(
    res,
    "Account created successfully",
    {
      token,
      user: { id: user.id, email: user.email, name: user.name },
    },
    201
  );
});

// ----------------------------------------------------
// POST /api/auth/login
// ----------------------------------------------------
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ userId: user.id, email: user.email });

  sendSuccess(res, "Logged in successfully", {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

// ----------------------------------------------------
// GET /api/auth/me
// ----------------------------------------------------
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  // req.user is guaranteed to exist here since authMiddleware ran first
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  sendSuccess(res, "User fetched successfully", { user });
});
