import { reviewStep } from "../../controllers/Admin/stepReviewController.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const stepReviewHandler = async (req, res) => {
  try {
    const { profileId, stepName, action, notes } = req.body;
    if (!profileId || !stepName || !action) {
      return errorResponse(res, "profileId, stepName, and action are required", 400);
    }
    const result = await reviewStep(profileId, stepName, action, req.user.id, notes);
    return successResponse(res, result, result.message, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
