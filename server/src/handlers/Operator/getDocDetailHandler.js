import { documentDetail } from "../../controllers/Operator/documentDetail";
import { errorResponse, successResponse } from "../../utils/response";
import { operatorAndAdminOnly } from "../../utils/verifyRole";

export const docDetailHandler = async (req, res) => {
  try {
    const { id, role } = req.user;
    const verify = await operatorAndAdminOnly(id, role);
    if (!verify.status) errorResponse(res, "Rol no Autorizado", 400, verify);

    const answer = await documentDetail(req.body);

    return answer?.message
      ? successResponse(res, answer, "Detail Acquired!", 200)
      : errorResponse(res, "Something went wrong...", 400, answer);
  } catch (error) {
    errorResponse(res, "Something wrong happened...", 500, error);
  }
};
