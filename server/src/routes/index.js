import { Router } from "express";
import authRoutes from "./Auth/auth.js";

const routes = Router();

routes.use(authRoutes);

export default routes;
