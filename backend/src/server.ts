// ====================================================
// Server Entry Point
// Starts the Express server and binds to the port
// Render provides at runtime.
// ====================================================

import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const PORT = Number(env.PORT);

async function startServer() {
  try {
    // Verify database connection before accepting requests
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT} [${env.NODE_ENV}]`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// ----------------------------------------------------
// Graceful Shutdown
// Ensures Prisma closes DB connections cleanly when
// Render restarts/redeploys the service.
// ----------------------------------------------------
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
