import dotenv from "dotenv";
import jwt from "jsonwebtoken";
export const generateToken = (data, expireTime) => {
  try {
    if (!data)
      throw new Error("We need the data payload to link with the jwt.");
    if (typeof expireTime != "string")
      throw new Error("The expire time must be a string for the jwt syntax");
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: expireTime ? expireTime : null,
    });
  } catch (error) {
    throw new Error(error?.message);
  }
};

export  function authenticateToken(req, res, next) {
  const token = req.cookies?.PLATFORM_ACCESS_TOKEN;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
