import { getContractorDetail } from "../../modules/contractor-detail.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const contractorDetailHandler = async (req, res) => {
  try {
    const result = await getContractorDetail(req.params.id);
    if (!result.exists) {
      return errorResponse(res, "Contractor not found", 404);
    }
    return successResponse(res, result, "Contractor detail retrieved", 200);
  } catch (error) {
    return errorResponse(res, "Error retrieving contractor detail", 500, error.message);
  }
};
