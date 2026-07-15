// ====================================================
// Standardized API Response Helpers
// Ensures every endpoint returns a consistent shape,
// so the frontend can handle responses predictably.
// ====================================================

import { Response } from "express";

// Shape used for all successful responses
interface SuccessPayload<T> {
  success: true;
  message: string;
  data?: T;
}

// Shape used for all error responses
interface ErrorPayload {
  success: false;
  message: string;
  errors?: unknown;
}

/**
 * Send a standardized success response.
 * @param res Express response object
 * @param message Human-readable success message
 * @param data Optional payload (object, array, etc.)
 * @param statusCode HTTP status code (default 200)
 */
export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response {
  const payload: SuccessPayload<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(payload);
}

/**
 * Send a standardized error response.
 * @param res Express response object
 * @param message Human-readable error message
 * @param statusCode HTTP status code (default 500)
 * @param errors Optional additional error details
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: unknown
): Response {
  const payload: ErrorPayload = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  };
  return res.status(statusCode).json(payload);
}
