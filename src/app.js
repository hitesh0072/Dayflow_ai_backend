import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import morgan from "morgan";
import categoryRoutes from "./modules/category/category.routes.js";
import tagRoutes from "./modules/tag/tag.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/tag", tagRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/ai", aiRoutes);

// Error Handler
app.use(errorHandler);

export default app;
