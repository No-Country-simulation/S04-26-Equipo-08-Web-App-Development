import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  softDeleteUser,
} from "../modules/users.service.js";
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
export const createUserController = async (req, res) => {
  try {
    const newUser = await createUser(req.body);

    return successResponse(res, newUser, "User created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
export const updateUserController = async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);

    return successResponse(res, updatedUser, "User updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
export const softDeleteUserController = async (req, res) => {
  try {
    const deletedUser = await softDeleteUser(req.params.id);

    return successResponse(res, deletedUser, "User deactivated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
