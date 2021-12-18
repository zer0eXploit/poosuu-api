import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const pwCorrect = (plain, hashed) => bcrypt.compareSync(plain, hashed);

export const generateToken = (payload, options = { expiresIn: "2h" }) => {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign(payload, jwtSecret, options);
};
