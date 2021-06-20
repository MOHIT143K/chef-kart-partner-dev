import { getDb, ObjectId } from "../db.js";
import { decodeJWT } from "../helpers/create-decode-jwt.js";

// Used only once for a new account creation it requires jwt
export const authIdMiddleware = async (req, res, next) => {
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
        .findOne({ _id: ObjectId(decodedToken) });
      if (!user) {
        return res.status(401).send("Error in User Auth");
      }

      // Here after authenticating the user we are attaching the
      // _id, mobileNo in request so that it can be used later in
      // further callback

      req._id = decodedToken;
      req.mobileNo = user.mobileNo;

      next();
    } catch (e) {
      return res.status(401).send("Unauthorized");
    }
  } catch (e) {}
};
