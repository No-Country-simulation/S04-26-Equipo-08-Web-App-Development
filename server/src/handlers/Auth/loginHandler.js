import { login } from "../../controllers/Auth/login.js";
import { errorResponse, successResponse } from "../../utils/response.js";
console.log(process.env.NODE_ENV);

export const loginHandler = async (
  req,
  res,
) => {
  try {

    const result = await login(req.body);

    res.cookie(
      "PLATFORM_ACCESS_TOKEN",
      result.accessToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        maxAge:
          1000 * 60 * 60 * 8,
        path: "/",
      },
    );

    return successResponse(
      res,
      result,
      "Login successful",
      200,
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400,
    );
  }
};