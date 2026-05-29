import { Router } from "express";

import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  softDeleteUserController,
} from "../controllers/users.controller.js";
import { authenticateToken } from "../utils/jwt.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

router.post("/", authenticateToken, authorizeRole("admin"), createUserController);
router.get("/", authenticateToken, authorizeRole("admin", "operator"), getUsersController);
router.get("/:id", authenticateToken, authorizeRole("admin", "operator"), getUserByIdController);
router.patch("/:id", authenticateToken, authorizeRole("admin"), updateUserController);
router.delete("/:id", authenticateToken, authorizeRole("admin"), softDeleteUserController);

export default router;
