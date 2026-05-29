import { Router } from "express";
import { completePersonalInfoController, getOnboardingProgressController, getContractorProgressController } from "../../controllers/onboarding.controller.js";
import { contractorDetailHandler } from "../../handlers/Phases/contractorDetailHandler.js";
import { stepReviewHandler } from "../../handlers/Phases/stepReviewHandler.js";
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

onboardingRoutes.get(
  "/onboarding/detail/:id",
  authenticateToken,
  authorizeRole("admin", "operator"),
  contractorDetailHandler,
);

onboardingRoutes.patch(
  "/onboarding/steps/review",
  authenticateToken,
  authorizeRole("admin", "operator"),
  stepReviewHandler,
);

export default onboardingRoutes;
