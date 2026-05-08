import { Router } from "express";
import { db } from "../config/database.js";
import { successResponse, errorResponse } from "../utils/response.js";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    return successResponse(res, { database: result.rows[0] }, "Database connected");
  } catch (error) {
    return errorResponse(res, "Database connection failed", 500, error.message);
  }
});

router.get("/admin-check", async (req, res) => {
  try {
    const result = await db.query("SELECT id, email, role, firstname FROM users WHERE email = $1", ["admin@admin"]);

    if (result.rows.length > 0) {
      return successResponse(res, result.rows[0], "Admin user found");
    } else {
      return errorResponse(res, "Admin user not found", 404);
    }
  } catch (error) {
    return errorResponse(res, "Error checking admin user", 500, error.message);
  }
});

export default router;
