import { Router } from "express";
import authRoutes from "./Auth/auth.js";
import onboardingRoutes from "./onboarding.routes.js";

const routes = Router();

routes.use(authRoutes);
routes.use(onboardingRoutes);

export default routes;
