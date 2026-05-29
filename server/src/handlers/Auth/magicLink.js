import { magicLink } from "../../controllers/Auth/magicLink.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const magicHandler = async (req, res, next) => {
  try {
    const answer = await magicLink(
      req.body.receiver,
      req.body.operatorId,
      req.user.id,
    );

    return successResponse(res, answer, "Invitación enviada exitosamente", 200);
  } catch (error) {
    const status = error.statusCode || 500;
    return errorResponse(res, error.message || "Error interno del servidor", status, null);
  }
};
