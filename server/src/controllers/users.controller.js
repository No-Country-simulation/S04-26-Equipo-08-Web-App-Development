import { getUsers, getUserById } from "../modules/users.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();

    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Error retrieving users", 500, error.message);
  }
};
export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Error retrieving user", 500, error.message);
  }
};
