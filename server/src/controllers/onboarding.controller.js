import { completePersonalInfo } from "../modules/onboarding.service.js";
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
