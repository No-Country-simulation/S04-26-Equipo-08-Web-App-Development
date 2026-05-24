import { Router } from "express";
import { loginHandler } from "../../handlers/Auth/loginHandler.js";
import { registerHandler } from "../../handlers/Auth/registerHandler.js";

const authRoutes = Router();

authRoutes.post("/login", loginHandler);
authRoutes.post("/register", registerHandler);
export default authRoutes;
