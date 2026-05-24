import { db } from "../config/database.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
  const { email, password, role, firstname, lastname, phone } = userData;

  const existingEmail = await db.query(
    "SELECT email FROM users WHERE email = $1",
    [email],
  );

  if (existingEmail.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const existingPhone = await db.query(
    "SELECT phone FROM users WHERE phone = $1",
    [phone],
  );

  if (existingPhone.rows.length > 0) {
    throw new Error("Phone already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await db.query(
    `
    INSERT INTO users (
      email,
      password,
      role,
      firstname,
      lastname,
      phone
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      email,
      role,
      firstname,
      lastname,
      phone,
      is_active,
      created_at,
      updated_at
    `,
    [email, hashedPassword, role, firstname, lastname, phone],
  );

  return result.rows[0];
};

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
