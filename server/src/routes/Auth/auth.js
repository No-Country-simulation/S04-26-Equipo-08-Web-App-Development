import { Router } from "express";
import { loginHandler } from "../../handlers/Auth/loginHandler.js";
import { registerHandler } from "../../handlers/Auth/registerHandler.js";
import { magicHandler } from "../../handlers/Auth/magicLink.js";
import { authenticateToken } from "../../utils/jwt.js";

const authRoutes = Router();

authRoutes.post("/login", loginHandler);
authRoutes.post("/register", registerHandler);
authRoutes.post("/magicLink", authenticateToken , magicHandler);
export default authRoutes;
