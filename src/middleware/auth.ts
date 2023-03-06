import { expressjwt } from "express-jwt";
import config from "../config";

export const authenticate = expressjwt({
  secret: config.jwtKey!,
  algorithms: ["HS256"],
});
