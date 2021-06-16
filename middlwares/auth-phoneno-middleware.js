import { getDb } from "../db.js";
import { decodeJWT } from "../helpers/create-decode-jwt.js";

// Used only once for a new account creation it requires jwt
export const authPhoneNoMiddleware = async (req, res, next) => {
  const db = await getDb();
  try {
    // Splitting Token from bearer <token>
    const token = req.headers.authorization.split(" ")[1];

    //Decoding JWT Token
    const decodedToken = decodeJWT(token);

    if (!decodedToken) {
      return res.status(400).send("Invalid Request");
    }

    try {
      const user = await await db
        .collection("user")
        .findOne({ phoneNo: decodedToken });
      if (!user) {
        return res.status(401).send("Error in User Auth");
      }

      req.phoneNo = decodedToken;
      next();
    } catch (e) {
      console.log(e);
      return res.status(401).send("Unauthorized");
    }
  } catch (e) {}
};
