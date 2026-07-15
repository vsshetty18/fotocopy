// ====================================================
// Environment Variable Loader & Validator
// Centralizes all env access so nothing is read
// directly via process.env elsewhere in the codebase.
// ====================================================

import dotenv from "dotenv";

dotenv.config();

// Helper to fail fast if a required env var is missing
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  // Server
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // JWT Auth
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),

  // OpenAI (Image Generation)
  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),

  // Frontend URL (for CORS)
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
