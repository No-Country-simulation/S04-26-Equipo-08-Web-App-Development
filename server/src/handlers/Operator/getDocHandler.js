import { db } from "../../config/database";
import { getDocuments } from "../../controllers/Operator/getDocuments";
import { errorResponse, successResponse } from "../../utils/response";
import { operatorAndAdminOnly } from "../../utils/verifyRole";
export const getDocHandler = async (req, res) => {
  try {
    const { id, role } = req.user;
    const verifying = await operatorAndAdminOnly(id, role);
    if (!verifying?.status) errorResponse(res, verifying, 400);
    if (req.body) {
      const answer = await getDocuments(req.query.filter, req.body);
      return answer.message
        ? successResponse(res, answer, "Documents Retrieved!", 200)
        : errorResponse(
            res,
            "Something went wrong on the request...",
            400,
            answer,
          );
    } else {
      const answer = await getDocuments();
      return answer.message
        ? successResponse(res, answer, "Documents Retrieved!", 200)
        : errorResponse(
            res,
            "Something went wrong on the request...",
            400,
            answer,
          );
    }
  } catch (error) {
    return errorResponse(res, "Error in Request", 500, error);
  }
};
