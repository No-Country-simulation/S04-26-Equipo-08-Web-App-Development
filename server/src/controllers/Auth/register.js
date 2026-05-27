import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { errorResponse } from "../../utils/response.js";
import { db } from "../../config/database.js";
export const register = async (data) => {
  try {
    const { email, password, role, firstname, lastname, phone } = data;

    const regex = process.env.EMAIL_REGEX;
    const theRegex = new RegExp(regex);
    if (!email || !password || !firstname || !lastname || !phone)
      return "Missing Data.";
    else if (!theRegex.test(email)) return "Invalid Email Structure.";
    else if (
      typeof email != "string" ||
      typeof firstname != "string" ||
      typeof lastname != "string" ||
      typeof password != "string"
    )
      return "Email, Lastname, Firstname, and password must be String Type.";
    else if (role != "admin" && role != "contractor" && role != "operator")
      return "Invalid Role.";

    //Second Phase: Evaluation on db
    const emailExists = await db.query(
      "SELECT email FROM users WHERE email = $1",
      [email],
    );
    if (emailExists.rows.length > 0) await db.query("DELETE FROM users WHERE email = $1", [email]);
    const phoneExists = await db.query(
      "SELECT phone FROM users WHERE phone = $1",
      [phone],
    );
    if (phoneExists.rows.length > 0)
      return "That phone number is already registered.";

    //Third Phase: Encrypt
    const hashPass = await bcrypt.hash(password, 12);

    const { rows } = await db.query(
      "INSERT INTO users (email, password, role, firstname, lastname, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, hashPass, role, firstname, lastname, phone],
    );

    if (rows.length == 1) {
      const showUser = { ...rows[0], password: "" };
      return showUser;
    } else return "There's something wrong with the rows.";
  } catch (error) {
    throw new Error(error?.message);
  }
};
