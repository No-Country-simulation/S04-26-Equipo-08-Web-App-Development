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

export const updateUser = async (id, userData) => {
  const { email, role, firstname, lastname, phone, is_active } = userData;

  const result = await db.query(
    `
    UPDATE users
    SET
      email = COALESCE($1, email),
      role = COALESCE($2, role),
      firstname = COALESCE($3, firstname),
      lastname = COALESCE($4, lastname),
      phone = COALESCE($5, phone),
      is_active = COALESCE($6, is_active),
      updated_at = NOW()
    WHERE id = $7
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
    [email, role, firstname, lastname, phone, is_active, id],
  );

  return result.rows[0];
};

export const softDeleteUser = async (id) => {
  const result = await db.query(
    `
    UPDATE users
    SET
      is_active = false,
      updated_at = NOW()
    WHERE id = $1
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
    [id],
  );

  return result.rows[0];
};
