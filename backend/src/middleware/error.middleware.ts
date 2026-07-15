// ====================================================
// Global Error Handling Middleware
// Catches any error passed via next(err) or thrown in
// an async route, and returns a consistent JSON shape.
// Must be registered LAST in app.ts (after all routes).
// ====================================================

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

// Custom error class controllers/services can throw
// with a specific HTTP status code.
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("❌ Error:", err.message);

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  sendError(res, message, statusCode);
}

// ====================================================
// Async Handler Wrapper
// Wraps async controller functions so any rejected
// promise is automatically forwarded to errorMiddleware,
// instead of needing try/catch in every controller.
// ====================================================
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
