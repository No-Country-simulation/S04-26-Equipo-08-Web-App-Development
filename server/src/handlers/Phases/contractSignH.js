import { contractSign } from "../../controllers/ContractorPhases/ContractSign/contractSignController.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const contractSignHandler = async (req, res) => {
  try {
    const answer = await contractSign(req.user, req.body);
    return answer?.embedSrc
      ? successResponse(res, answer, "Documento de firma creado", 201)
      : errorResponse(res, answer?.message || answer, 400);
  } catch (error) {
    console.error("ContractSign Handler Error:", error);
    throw new Error(error?.message);
  }
};
