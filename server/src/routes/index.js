import { Router } from "express";
import authRoutes from "./Auth/auth.js";
import documentURoutes from "./Phases/documentUpload.js";
import onboardingRoutes from "./Phases/onboarding.routes.js";
import contractRoutes from "./Phases/contractRoutes.js";
import operatorRoutes from "./Operator/operatorRoutes.js";
import { docusealWebhookHandler } from "../handlers/Phases/docusealWebhookH.js";

const routes = Router();

routes.use(authRoutes);
routes.use(documentURoutes);
routes.use(onboardingRoutes);
routes.use(contractRoutes);
routes.use(operatorRoutes);

routes.post("/webhooks/docuseal", docusealWebhookHandler);

export default routes;
