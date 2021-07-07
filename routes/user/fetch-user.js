import { fetchUserAdditional } from "../../controllers/fetch-user-additional.js";
import { getDb, ObjectId } from "../../db.js";
import { createJWT } from "../../helpers/create-decode-jwt.js";

export const fetchUser = async (req, res) => {
  const db = await getDb();
  const { userId } = req;
  try {
    const user = await db.collection("user").findOne({ _id: ObjectId(userId) });
    const jwt = createJWT(user["_id"]);

    const { totalEarnedAmount, totalWalletAmount, bankAccounts, leads, leadsCount } = await fetchUserAdditional(userId);

    return res
      .status(200)
      .json({ jwt, user, leads, leadsCount, bankAccounts, totalEarnedAmount, totalWalletAmount });
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server Error!");
  }
};
