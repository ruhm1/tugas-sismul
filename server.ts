import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Security
import { helmetMiddleware, corsMiddleware, rateLimiter } from "./src/server/middleware/security";

// Routes
import authRoutes from "./src/server/routes/auth";
import menuRoutes from "./src/server/routes/menu";
import reservationRoutes from "./src/server/routes/reservations";
import promotionRoutes from "./src/server/routes/promotions";
import galleryRoutes from "./src/server/routes/gallery";
import contactRoutes from "./src/server/routes/contacts";
import restaurantRoutes from "./src/server/routes/restaurant";
import chatbotRoutes from "./src/server/routes/chatbot";
import adminRoutes from "./src/server/routes/admin";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Global middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(uploadsDir));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/admin", adminRoutes);

// Vite Dev Server / Production static
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GOURMET server running at http://localhost:${PORT}`);
  });
}

startServer();
