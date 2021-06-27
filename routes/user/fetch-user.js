import { getDb, ObjectId } from "../../db.js";
import { createJWT } from "../../helpers/create-decode-jwt.js";

export const fetchUser = async (req, res) => {
  const db = await getDb();
  const { userId } = req;
  try {
    const user = await db.collection("user").findOne({ _id: ObjectId(userId) });
    const jwt = createJWT(user["_id"]);

    const bankAccounts = await db
      .collection("bank-account")
      .find({ createdBy: userId })
      .limit(10)
      .toArray();

    bankAccounts.forEach((bankAccount) => {
      bankAccount.accountNo = bankAccount.accountNumber.slice(0, 4) + "*******";
    });

    const leadsResponse = await db
      .collection("lead")
      .find({ createdBy: userId })
      .limit(20);

    const leads = await leadsResponse.toArray();
    const leadsCount = await leadsResponse.count();

    const paymentAggregationResponse = await db
      .collection("lead")
      .aggregate([
        { $match: { createdBy: userId } },
        {
          $group: {
            _id: null,
            totalEarnedAmount: { $sum: "$payment.amount" },
          },
        },
      ])
      .toArray();

    const { totalEarnedAmount } = paymentAggregationResponse[0];

    return res
      .status(200)
      .json({ user, leads, leadsCount, bankAccounts, totalEarnedAmount, jwt });
  } catch (error) {
    return res.status(500).send("Server Error!");
  }
};
