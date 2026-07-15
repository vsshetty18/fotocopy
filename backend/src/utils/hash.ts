// ====================================================
// Password Hashing Utility
// Wraps bcrypt for consistent hashing/comparison
// across auth controller.
// ====================================================

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password before storing in the database.
 * @param plainPassword Raw password from the user
 * @returns Hashed password string
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a stored hash.
 * @param plainPassword Raw password entered at login
 * @param hashedPassword Hash stored in the database
 * @returns true if they match, false otherwise
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
