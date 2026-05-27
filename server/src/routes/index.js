import { Router } from "express";
import authRoutes from "./Auth/auth.js";
import documentURoutes from "./Phases/documentUpload.js";
import onboardingRoutes from "./onboarding.routes.js";

const routes = Router();

routes.use(authRoutes);
routes.use(documentURoutes);
routes.use(onboardingRoutes);

export default routes;
