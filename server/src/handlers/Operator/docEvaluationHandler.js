import { docEvaluation } from "../../controllers/Operator/docEvaluation";
import { errorResponse, successResponse } from "../../utils/response.js";
export const docEvaluationHandler = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { docId, operatorId, rejectionReason } = req.body;
    const answer = await docEvaluation(docId, operatorId, rejectionReason);
    return answer.message
      ? successResponse(res, answer, "Success!", 200)
      : errorResponse(res, "Something failed...", 400, answer);
  } catch (error) {
    return errorResponse(res, "Server Failure", 500, error);
  }
};
