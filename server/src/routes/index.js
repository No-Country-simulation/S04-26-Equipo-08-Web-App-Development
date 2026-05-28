import { Router } from "express";
import authRoutes from "./Auth/auth.js";
import documentURoutes from "./Phases/documentUpload.js";
import onboardingRoutes from "./Phases/onboarding.routes.js";
import operatorRoutes from "./Operator/operatorRoutes.js";

const routes = Router();

routes.use(authRoutes);
routes.use(documentURoutes);
routes.use(onboardingRoutes);
routes.use(operatorRoutes);

export default routes;
