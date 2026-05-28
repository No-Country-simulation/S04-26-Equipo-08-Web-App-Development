import { documentUpload } from "../../controllers/ContractorPhases/DocumentUpload/documentUploadController.js";
import { errorResponse, successResponse } from "../../utils/response.js";
export const documentUploadHandler = async (req, res) => {
  try {
    const { user, file, body } = req;
    const answer = await documentUpload(user, file, body.docType);
    console.log(answer);
    return answer?.file
      ? successResponse(res, answer, "¡Success!", 201)
      : errorResponse(res, answer.message, 404);
  } catch (error) {
    console.log("Handler Error");
    throw new Error(error?.message);
  }
};
