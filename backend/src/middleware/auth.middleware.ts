// ====================================================
// Auth Middleware
// Verifies JWT from Authorization header and attaches
// the decoded user info to the request object.
// ====================================================

import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { sendError } from "../utils/response";

// Extend Express's Request type to include our decoded user
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  // Expect header format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Unauthorized: No token provided", 401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // attach decoded { userId, email } to request
    next();
  } catch (error) {
    sendError(res, "Unauthorized: Invalid or expired token", 401);
    return;
  }
}
