import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AccessTokenError } from "./errors.js";

export const pwCorrect = (plain, hashed) => bcrypt.compareSync(plain, hashed);

export const generateToken = (payload, options = { expiresIn: "2h" }) => {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign(payload, jwtSecret, options);
};

export const extractTokenFromHeader = (headers) => {
  if (!headers.authorization) return false;
  const token = headers.authorization.split(" ")[1];
  return token;
};

export const getDecodedToken = (token) => {
  if (!token) return false;

  try {
    const jwtSecret = process.env.JWT_SECRET;
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    return false;
  }
};

export const checkAuthorization = (headers) => {
  // Check for access token
  const token = extractTokenFromHeader(headers);
  if (!token) throw new AccessTokenError("Access Token is required.");
  const decodedToken = getDecodedToken(token);
  if (!decodedToken) throw new AccessTokenError();

  return decodedToken;
};
