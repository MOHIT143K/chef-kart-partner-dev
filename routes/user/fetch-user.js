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

    const paidAggregationResponse = await db
      .collection("lead")
      .aggregate([
        { $match: { createdBy: userId, status: 'bank_added' } },
        {
          $group: {
            _id: 'status',
            totalEarnedAmount: { $sum: "$payment.amount" },
          },
        }
      ])
      .toArray();

    const walletAddedAggregationResponse = await db
    .collection("lead")
    .aggregate([
      { $match: { createdBy: userId, status: 'wallet_added' } },
      {
        $group: {
          _id: null,
          totalWalletAmount: { $sum: "$payment.amount" },
        },
      },
    ])
      .toArray();

    const { totalEarnedAmount = 0 } = paidAggregationResponse[0] || {};
    const { totalWalletAmount = 0 } = walletAddedAggregationResponse[0] || {};

    return res
      .status(200)
      .json({ jwt, user, leads, leadsCount, bankAccounts, totalEarnedAmount, totalWalletAmount });
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server Error!");
  }
};
