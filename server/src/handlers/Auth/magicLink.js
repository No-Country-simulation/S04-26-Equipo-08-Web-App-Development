import { magicLink } from "../../controllers/Auth/magicLink";
import { errorResponse, successResponse } from "../../utils/response";

export const magicHandler = async (req, res) => {
  try {
    const answer = await magicLink(
      req.body.method,
      req.body.receiver,
      req.body.operatorId,
    );

    return answer != string
      ? successResponse(res, answer, "Success on Magic Link!", 204)
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
