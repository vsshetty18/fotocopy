// ====================================================
// JWT Utility Functions
// Handles signing and verifying auth tokens.
// ====================================================

import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Payload embedded inside every JWT
export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Sign a new JWT for a user.
 * @param payload User identity data to embed in the token
 * @returns Signed JWT string
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT.
 * Throws if the token is invalid or expired.
 * @param token Raw JWT string (without "Bearer " prefix)
 * @returns Decoded payload
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
