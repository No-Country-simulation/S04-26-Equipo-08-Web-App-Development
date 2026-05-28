import { Router } from "express";
import { completePersonalInfoController, getOnboardingProgressController, getContractorProgressController } from "../../controllers/onboarding.controller.js";
import { authenticateToken } from "../../utils/jwt.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const onboardingRoutes = Router();

onboardingRoutes.post(
  "/onboarding/personal-info",
  authenticateToken,
  authorizeRole("contractor"),
  completePersonalInfoController,
);

onboardingRoutes.get(
  "/onboarding/progress",
  authenticateToken,
  authorizeRole("contractor"),
  getOnboardingProgressController,
);

onboardingRoutes.get(
  "/onboarding/progress/:id",
  authenticateToken,
  authorizeRole("admin", "operator"),
  getContractorProgressController,
);

export default onboardingRoutes;
