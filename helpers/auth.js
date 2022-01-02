import crypto from "crypto";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { client } from "../config/redis.js";
import { AuthorizationError, InvalidAPIKeyError } from "./errors.js";

export const pwCorrect = (plain, hashed) => bcrypt.compareSync(plain, hashed);

export const generateToken = (payload, options = { expiresIn: "2h" }) => {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign(payload, jwtSecret, options);
};

export const extractTokenFromHeader = (headers) =>
  headers?.authorization?.split(" ")[1];

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
  if (!token) throw new AuthorizationError("Missing authorization header.");
  const decodedToken = getDecodedToken(token);
  if (!decodedToken) throw new AuthorizationError();

  return decodedToken;
};

export const generateAPIKey = () => crypto.randomBytes(20).toString("base64");

export const generateHashFrom = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const checkAPIKey = async (httpRequest) => {
  const { query, headers, host } = httpRequest;
  const apiKey = query.apiKey || headers["x-api-key"];

  if (!apiKey) throw new InvalidAPIKeyError();
  const savedHost = await client.get(apiKey);

  if (host !== savedHost) throw new InvalidAPIKeyError();
};
