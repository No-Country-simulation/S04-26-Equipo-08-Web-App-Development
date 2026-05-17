import { db } from "../config/database.js";

export const createUser = async (userData) => {};

export const getUsers = async () => {
  const result = await db.query(`
    SELECT 
      id,
      email,
      role,
      firstname,
      lastname,
      phone,
      is_active,
      created_at,
      updated_at
    FROM users
  `);

  return result.rows;
};

export const getUserById = async (id) => {
  const result = await db.query(
    `
    SELECT 
      id,
      email,
      role,
      firstname,
      lastname,
      phone,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
  `,
    [id],
  );

  return result.rows[0];
};

export const updateUser = async (id, userData) => {};

export const softDeleteUser = async (id) => {};
