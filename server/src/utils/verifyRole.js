import { db } from "../config/database.js";
export const operatorAndAdminOnly = async (id, role) => {
  try {
    const doesExists = await db.query("SELECT id FROM users WHERE id =$1", [id]);

    if (doesExists.rowCount < 1) return "User Not Found.";
    else if (role == "contractor") return "Only Admin an Operator can can access this resource.";

    return { status: "OK!" };
  } catch (error) {
    throw new Error(error);
  }
};
