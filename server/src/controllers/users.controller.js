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
    const { id, role } = req.user;
    const verifying = await verifyAdmin(id, role);
    if (!verifying?.status) errorResponse(res, verifying, 400);

    const users = await getUsers();

    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Error retrieving users", 500, error.message);
  }
};
export const getUserByIdController = async (req, res) => {
  try {
    const { id, role } = req.user;
    const verifying = await verifyAdmin(id, role);
    if (!verifying?.status) errorResponse(res, verifying, 400);

    const user = await getUserById(req.params.id);

    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    return errorResponse(res, "Error retrieving user", 500, error.message);
  }
};
export const createUserController = async (req, res) => {
  try {
    const { id, role } = req.user;
    const verifying = await verifyAdmin(id, role);
    if (!verifying?.status) errorResponse(res, verifying, 400);

    const newUser = await createUser(req.body);

    return successResponse(res, newUser, "User created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
export const updateUserController = async (req, res) => {
  try {
    const { id, role } = req.user;
    const verifying = await verifyAdmin(id, role);
    if (!verifying?.status) errorResponse(res, verifying, 400);

    const updatedUser = await updateUser(req.params.id, req.body);

    return successResponse(res, updatedUser, "User updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
export const softDeleteUserController = async (req, res) => {
  try {
    const { id, role } = req.user;
    const verifying = await verifyAdmin(id, role);
    if (!verifying?.status) errorResponse(res, verifying, 400);
    const deletedUser = await softDeleteUser(req.params.id);

    return successResponse(res, deletedUser, "User deactivated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

//Para verificar el rol y existencia del Admin
const verifyAdmin = async (id, role) => {
  try {
    const doesExists = await getUserById(id);
    if (doesExists.rowCount < 1) return "Admin Not Found.";
    else if (role != "admin") return "Only an Admin can access this resource.";

    return { status: "OK!" };
  } catch (error) {
    throw new Error(error);
  }
};
