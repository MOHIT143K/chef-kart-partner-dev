import { getDb } from "../../db.js";
import bcrypt from "bcrypt";
import { createJWT } from "../../helpers/create-decode-jwt.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const db = await getDb();

  try {
    const adminUser = await db.collection("admin-accounts").findOne({
      email,
    });

    if (!adminUser) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const match = await bcrypt.compare(password, adminUser.password);
    if (!match) {
      return res.status(401).json({ error: "Unauthorized!" });
    } else {
      const JWTForAdminClient = createJWT(adminUser._id);
      return res.status(200).json({ admin: email, jwt: JWTForAdminClient });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Invalid Details" });
  }
};
