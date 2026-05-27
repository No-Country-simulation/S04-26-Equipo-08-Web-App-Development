import { Router } from "express";
import { completePersonalInfoController } from "../controllers/onboarding.controller.js";
import { authenticateToken } from "../utils/jwt.js";

const onboardingRoutes = Router();

onboardingRoutes.post(
  "/onboarding/personal-info",
  authenticateToken,
  completePersonalInfoController,
);

export default onboardingRoutes;
