import { getDb } from "../../db.js";
import { optService } from "../../config/config.js";
import { createJWT } from "../../helpers/create-decode-jwt.js";
import { fetchUserAdditional } from "../../controllers/fetch-user-additional.js";

export const verifyOTP = async (req, res) => {
  const db = await getDb();
  const { mobileNo, otp, newUser } = req.body;

  //Node-MSG91 Client
  optService.verify(mobileNo, otp, async function (err, response) {
    if (response.type == "error") {
      return res.status(400).json({ error: "Wrong OTP" });
    } else {
      if (newUser) {
        const userNode = {
          mobileNo,
          fullName: null,
          emailId: null,
          profession: null,
          profilePic: null,
          defaultAccountId: null,
          accountCreatedAt: Date.now(),
          updatedAt: Date.now(),
        };

        try {
          const createdUserNode = await db
            .collection("user")
            .insertOne(userNode);
          const user = createdUserNode.ops[0];
          const JWTForClient = createJWT(user["_id"]);
          const {
            totalEarnedAmount,
            totalWalletAmount,
            bankAccounts,
            leads,
            leadsCount,
          } = await fetchUserAdditional(user["_id"]);

          return res
            .status(200)
            .json({
              jwt: JWTForClient,
              user,
              totalEarnedAmount,
              totalWalletAmount,
              bankAccounts,
              leads,
              leadsCount,
            });
        } catch (error) {
          if (error.code === 11000) {
            return res.status(422).json({ error: "User Already Exists!" });
          }
          console.log(error);
          return res.status(500).json({ error: "Server Error!" });
        }
      } else {
        try {
          const fetchedUserNode = await db
            .collection("user")
            .findOneAndUpdate(
              { mobileNo },
              { $set: { updatedAt: Date.now() } },
              { returnDocument: "after" }
            );
          const user = fetchedUserNode.value;

          if (!user) {
            return res.status(404).json({ error: "User Not Present" });
          }

          const JWTForClient = createJWT(user["_id"]);
          const {
            totalEarnedAmount,
            totalWalletAmount,
            bankAccounts,
            leads,
            leadsCount,
            notifications,
          } = await fetchUserAdditional(`${user["_id"]}`);

          return res
            .status(200)
            .json({
              jwt: JWTForClient,
              user,
              totalEarnedAmount,
              totalWalletAmount,
              bankAccounts,
              leads,
              leadsCount,
              notifications,
            });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "Server Error!" });
        }
      }
    }
  });
};
