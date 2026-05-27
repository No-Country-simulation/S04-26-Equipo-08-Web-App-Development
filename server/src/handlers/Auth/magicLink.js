import { magicLink } from "../../controllers/Auth/magicLink.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const magicHandler = async (req, res) => {
  try {
    
    const answer = await magicLink(
      req.body.receiver,
      req.body.operatorId,
      req.user.id
    );

    return typeof answer != "string"
      ? successResponse(res, answer, "Success on Magic Link!", 200)
      : errorResponse(
          res,
          "Something went wrong with the link...",
          404,
          answer,
        );
  } catch (error) {
    throw new Error(error?.message);
  }
};
