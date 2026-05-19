import { db } from "../../config/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

export const login = async (data) => {

  const { password, email } = data;

  if (!password || !email) {
    throw new Error("Missing Data.");
  }

  const userByEmail = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (userByEmail.rows.length < 1) {
    throw new Error(
      "Sorry, that email doesn't match any User."
    );
  }

  const user = userByEmail.rows[0];

  const passMatch = await bcrypt.compare(
    password,
    user.password,
  );

  if (!passMatch) {
    throw new Error("The password didn't match.");
  }

  const token = await generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    "8h",
  );

  return {
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
    },
  };
};
