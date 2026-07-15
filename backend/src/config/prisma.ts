// ====================================================
// Prisma Client Singleton
// Prevents creating multiple PrismaClient instances
// during development hot-reloads / serverless reuse.
// ====================================================

import { PrismaClient } from "@prisma/client";

// Extend the global namespace so TypeScript knows about our cached client
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Reuse existing instance if one exists (avoids "too many connections" errors)
export const prisma = global.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
