import { Router } from "express";

import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
} from "../controllers/users.controller.js";

const router = Router();

router.post("/", createUserController);
router.get("/", getUsersController);
router.get("/:id", getUserByIdController);
router.patch("/:id", updateUserController);

export default router;
