import { completePersonalInfo, getOnboardingProgress } from "../modules/onboarding.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const completePersonalInfoController = async (req, res) => {
  try {
    const result = await completePersonalInfo(
      req.user.id,
      req.user.role,
      req.body,
    );

    return successResponse(
      res,
      result,
      "Personal info completed successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getOnboardingProgressController = async (req, res) => {
  try {
    const result = await getOnboardingProgress(req.user.id);

    return successResponse(res, result, "Onboarding progress retrieved", 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getContractorProgressController = async (req, res) => {
  try {
    const result = await getOnboardingProgress(req.params.id);

    return successResponse(res, result, "Contractor progress retrieved", 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
