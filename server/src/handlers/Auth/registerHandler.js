import { register } from "../../controllers/Auth/register.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const registerHandler = async (req, res) => {
  try {
    
    const answer = await register(req.body);
console.log(answer)
    if (typeof answer == "string")
      return errorResponse(res, answer, 400);

    return successResponse(
      res,
      answer,
      "User Registered Successfully!",
      201,
    );
  } catch (error) {
    throw new Error(error?.message);
  }
};
