import { login } from "../../controllers/Auth/login.js";
import { errorResponse, successResponse } from "../../utils/response.js";
console.log(process.env.NODE_ENV);
export const loginHandler = async (req, res) => {
  try {
    const answer = await login(req.body);
    console.log(answer);
    if (answer.accessToken != undefined || typeof answer != "string") {
      res.cookie("PLATFORM_ACCESS_TOKEN", answer.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV | "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 8,
        path: "/",
      });
      return successResponse(
        res,
        "Yey!",
        "The Token was successfully sent!",
        200,
      );
    } else return errorResponse(res, answer, 400);
  } catch (error) {
    
    return errorResponse(res, "Something went wrong...", 500, error?.message);
  }
};
