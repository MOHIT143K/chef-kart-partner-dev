import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config/config.js";

export const decodeJWT = (token) => {
  if (token) {
    return jwt.verify(token, jwtSecretKey, function (err, decoded) {
      if (decoded) {
        return decoded.data;
      } else {
        return null;
      }
    });
  } else {
    return null;
  }
};

export const createJWT = (dataToEncode) => {
  return jwt.sign({ data: dataToEncode }, jwtSecretKey);
};
