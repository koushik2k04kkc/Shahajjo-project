import jwt from "jsonwebtoken";
import { config } from "../../../config/configuration.js";

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};