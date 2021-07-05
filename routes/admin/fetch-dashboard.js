import { getDb } from "../../db.js";
import bcrypt from "bcrypt";
import { createJWT } from "../../helpers/create-decode-jwt.js";

export const fetchDashboard = async (req, res) => {
  return res.status(200).send("API Working!");
};
