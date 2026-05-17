import { Router } from "express";
import {
  getUsersController,
  getUserByIdController,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsersController);
router.get("/:id", getUserByIdController);

export default router;
