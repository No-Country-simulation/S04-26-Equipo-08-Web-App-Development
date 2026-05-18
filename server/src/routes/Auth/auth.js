import { Router } from "express";
import { loginHandler } from "../../handlers/Auth/loginHandler.js";
import { registerHandler } from "../../handlers/Auth/registerHandler.js";
import { magicHandler } from "../../handlers/Auth/magicLink.js";

const authRoutes = Router();

authRoutes.post("/login", loginHandler);
authRoutes.post("/register", registerHandler);
authRoutes.post("/magicLink", magicHandler);
export default authRoutes;
