import { Router } from "express";

import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  softDeleteUserController,
} from "../controllers/users.controller.js";
import { authenticateToken } from "../utils/jwt.js";
const router = Router();

router.post("/", authenticateToken, createUserController);
router.get("/", authenticateToken, getUsersController);
router.get("/:id", authenticateToken, getUserByIdController);
router.patch("/:id", authenticateToken, updateUserController);
router.delete("/:id", authenticateToken, softDeleteUserController);

export default router;
