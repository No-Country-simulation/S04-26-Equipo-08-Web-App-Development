import { register } from "../../controllers/Auth/register.js";
import { generateToken } from "../../utils/jwt.js";
import { errorResponse, successResponse } from "../../utils/response.js";

export const registerHandler = async (req, res) => {
  try {
    const answer = await register(req.body);

    if (typeof answer == "string")
      return errorResponse(res, answer, 400);

    const token = generateToken(
      { id: answer.id, email: answer.email, role: answer.role },
      "8h",
    );

    res.cookie("PLATFORM_ACCESS_TOKEN", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 8,
      path: "/",
    });

    return successResponse(res, answer, "User Registered Successfully!", 201);
  } catch (error) {
    throw new Error(error?.message);
  }
};
