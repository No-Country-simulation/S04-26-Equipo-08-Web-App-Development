import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { db } from "../../config/database.js";

export const register = async (data) => {
  const { email, password, role, firstname, lastname, phone } = data;

  const regex = process.env.EMAIL_REGEX;
  const theRegex = new RegExp(regex);
  if (!email || !password || !firstname || !lastname || !phone)
    return "Missing Data.";
  if (!theRegex.test(email)) return "Invalid Email Structure.";
  if (
    typeof email != "string" ||
    typeof firstname != "string" ||
    typeof lastname != "string" ||
    typeof password != "string"
  )
    return "Email, Lastname, Firstname, and password must be String Type.";
  if (role != "admin" && role != "contractor" && role != "operator")
    return "Invalid Role.";

  const phoneExists = await db.query(
    "SELECT phone FROM users WHERE phone = $1 AND phone IS NOT NULL",
    [phone],
  );
  if (phoneExists.rows.length > 0)
    return "That phone number is already registered.";

  const hashPass = await bcrypt.hash(password, 12);

  const emailExists = await db.query(
    "SELECT id FROM users WHERE email = $1",
    [email],
  );

  let userId;

  if (emailExists.rows.length > 0) {
    userId = emailExists.rows[0].id;
    const { rows } = await db.query(
      `UPDATE users SET password = $1, firstname = $2, lastname = $3, phone = $4, role = $5, updated_at = NOW() WHERE email = $6 RETURNING *`,
      [hashPass, firstname, lastname, phone, role, email],
    );
    if (rows.length == 1) {
      if (role === "contractor") {
        await markPersonalInfoStep(userId);
      }
      return { ...rows[0], password: "" };
    }
    return "Something went wrong updating the user.";
  }

  const { rows } = await db.query(
    "INSERT INTO users (email, password, role, firstname, lastname, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [email, hashPass, role, firstname, lastname, phone],
  );

  if (rows.length == 1) {
    userId = rows[0].id;
    if (role === "contractor") {
      await markPersonalInfoStep(userId);
    }
    return { ...rows[0], password: "" };
  }
  return "There's something wrong with the rows.";
};

async function markPersonalInfoStep(userId) {
  let profileId;
  const existing = await db.query(
    "SELECT id FROM contractor_profiles WHERE user_id = $1",
    [userId],
  );
  if (existing.rows.length > 0) {
    profileId = existing.rows[0].id;
  } else {
    const profile = await db.query(
      `INSERT INTO contractor_profiles (user_id, onboarding_status)
       VALUES ($1, 'IN_PROGRESS') RETURNING id`,
      [userId],
    );
    profileId = profile.rows[0].id;
  }

  const stepExists = await db.query(
    `SELECT id FROM onboarding_steps
     WHERE contractor_profile_id = $1 AND step_name = 'personal_info'`,
    [profileId],
  );

  if (stepExists.rows.length > 0) {
    await db.query(
      `UPDATE onboarding_steps SET completed = true, completed_at = NOW()
       WHERE contractor_profile_id = $1 AND step_name = 'personal_info'`,
      [profileId],
    );
  } else {
    await db.query(
      `INSERT INTO onboarding_steps (contractor_profile_id, step_name, completed, completed_at)
       VALUES ($1, 'personal_info', true, NOW())`,
      [profileId],
    );
  }
}
