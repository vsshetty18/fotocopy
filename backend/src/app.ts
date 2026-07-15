// ====================================================
// Express App Configuration
// Sets up middleware, CORS, and mounts all route
// modules. Server startup itself lives in server.ts.
// ====================================================

import express, { Application } from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";

// Route imports
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import peopleRoutes from "./routes/people.routes";
import searchRoutes from "./routes/search.routes";
import generateRoutes from "./routes/generate.routes";
import passportRoutes from "./routes/passport.routes";
import backgroundRoutes from "./routes/background.routes";
import resizeRoutes from "./routes/resize.routes";
import convertRoutes from "./routes/convert.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app: Application = express();

// ----------------------------------------------------
// CORS
// Allow only the deployed frontend (and localhost for
// dev) to call this API. This is the exact setting that
// caused CORS issues before — configured explicitly here
// instead of using a wildcard "*".
// ----------------------------------------------------
const allowedOrigins = [env.FRONTEND_URL, "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ----------------------------------------------------
// Body Parsing
// ----------------------------------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ----------------------------------------------------
// Health Check (useful for Render's health check pings)
// ----------------------------------------------------
app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// ----------------------------------------------------
// Routes
// ----------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/passport", passportRoutes);
app.use("/api/background", backgroundRoutes);
app.use("/api/resize", resizeRoutes);
app.use("/api/convert", convertRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ----------------------------------------------------
// 404 Handler (unmatched routes)
// ----------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ----------------------------------------------------
// Global Error Handler (must be last)
// ----------------------------------------------------
app.use(errorMiddleware);

export default app;
