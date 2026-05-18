// controllers/seed/seedAdmin.js

import { db } from "../../config/database.js";
import bcrypt from "bcrypt";

export const seedAdmin = async (req, res) => {
  try {
    const password = "Admin";

    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificar si ya existe
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      ["admin@admin"]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // Crear admin
    const result = await db.query(
      `
      INSERT INTO users (
        email,
        password,
        role,
        firstname,
        lastname,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [
        "admin@admin",
        hashedPassword,
        "admin",
        "Super",
        "Admin",
        true,
      ]
    );

    return res.status(201).json({
      message: "Admin created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};