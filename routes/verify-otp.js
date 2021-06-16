import { getDb } from "./../db.js";
import { optService, jwtSecretKey } from "./../config/config.js";
import { createJWT } from "../helpers/create-decode-jwt.js";

export const verifyOTP = async (req, res) => {
  const db = await getDb();
  const { phoneNo, otp, newUser } = req.body;

  //Node-MSG91 Client
  optService.verify(phoneNo, otp, async function (err, response) {
    // Use only response object as it contains response type and message
    // currently the code is commented in for testing purpose and make api working
    if (response.type == "error") {
      return res.status(400).send(response.message);
    } else {
      if (newUser) {
        const userNode = {
          phoneNo,
          fullName: null,
          emailId: null,
          profession: null,
          profilePicUrl: null,
          leads: [],
          accountCreatedAt: Date.now(),
          updatedAt: Date.now(),
        };

        try {
          const createdUserNode = await db
            .collection("user")
            .insertOne(userNode);
          const user = createdUserNode.result.ops[0];
          const JWTForClient = createJWT(user["phoneNo"]);
          return res.status(200).json({ jwt: JWTForClient, user });
        } catch (error) {
          if (error.code === 11000) {
            return res.status(422).send("User Already Exists!");
          }
          return res.status(500).send('Server Error!');
        }
      } else {
        try {
          const fetchedUserNode = await db
            .collection("user")
            .findOneAndUpdate({ phoneNo }, { $set: { updatedAt: Date.now() } });
          const user = fetchedUserNode.value;

          if (!user) {
            return res.status(404).send("User Not Present");
          }

          const JWTForClient = createJWT(user["phoneNo"]);
          return res.status(200).json({ jwt: JWTForClient, user });
        } catch (error) {
          console.log(error);
          return res.status(500).send("Server Error!");
        }
      }
    }
  });
};
