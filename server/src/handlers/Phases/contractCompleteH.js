import { contractComplete } from "../../controllers/ContractorPhases/ContractSign/contractCompleteController.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const contractCompleteHandler = async (req, res) => {
  try {
    const answer = await contractComplete(req.user);
    return answer?.success
      ? successResponse(res, answer, "Contract signed successfully", 200)
      : errorResponse(res, answer?.message || answer, 400);
  } catch (error) {
    console.error("ContractComplete Handler Error:", error);
    return errorResponse(res, error.message, 500);
  }
};
