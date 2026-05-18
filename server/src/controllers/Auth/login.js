import { db } from "../../config/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";
export const login = async (data) => {
  try {
    const { password, email } = data;

    if (!password || !email) return "Missing Data.";
    else if (typeof password != "string" || typeof email != "string")
      return `Both data inputs must be type string and we received ${typeof password} and ${typeof email}`;

    const userByEmail = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    console.log(userByEmail);

    if (userByEmail.rows.length < 1)
      return "Sorry, that email doesn't match any User, please register first!";
    const passMatch = await bcrypt.compare(password, userByEmail.rows[0].password);
    console.log(passMatch);

    const protectedData = { ...data, password: "YaQuisieras!" };
    if (passMatch) {
      const theToken = await generateToken(protectedData, "8h");

      if (theToken) return { accessToken: theToken };
    } else return "The password didn't match.";
  } catch (error) {
    return error;
  }
};
