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
      return res.status(400).json({error: "Invalid Request"});
    }

    try {
      if (req.url.startsWith("/admin")) {
        const adminAccount = await await db
          .collection("admin-accounts")
          .findOne({ _id: ObjectId(decodedToken) });
        if (!adminAccount) {
          return res.status(401).json({error: "Error in Admin Auth"});
        }
      } else {
        const user = await await db.collection("user").findOneAndUpdate(
          { _id: ObjectId(decodedToken) },
          {
            $set: { updatedAt: Date.now() },
          },
          { returnDocument: "after" }
        );
        if (!user) {
          return res.status(401).json({error: "Error in User Auth"});
        }
        req.mobileNo = user.value.mobileNo;
      }
      // Here after authenticating the user or Admin we are attaching the
      // _id, mobileNo in request so that it can be used later in
      req.userId = decodedToken;

      // further callback
      next();
    } catch (e) {
      return res.status(401).json({error: "Unauthorized"});
    }
  } catch (e) {
    console.log(e);
    return res.status(401).json({error: "Unauthorized"});
  }
};
