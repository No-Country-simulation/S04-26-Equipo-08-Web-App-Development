// controllers/seed/seedAdmin.js

import { db } from "../../config/database.js";
import bcrypt from "bcrypt";

// controllers/seed/seedAdmin.js

export const seedAdmin = async () => {

  const existingUser =
    await db.query(
      "SELECT * FROM users WHERE email = $1",
      ["admin@admin"]
    );

  if (
    existingUser.rows.length > 0
  ) {
    throw new Error(
      "Admin already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      "Admin",
      10,
    );

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
      "admin@admin.com",
      hashedPassword,
      "admin",
      "Super",
      "Admin",
      true,
    ]
  );

  return result.rows[0];
};