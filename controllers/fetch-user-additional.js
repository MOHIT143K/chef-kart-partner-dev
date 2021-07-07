import { getDb } from "../db.js";

export const fetchUserAdditional = async (userId) => {
    const db = await getDb();

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


  return {totalEarnedAmount, totalWalletAmount, bankAccounts, leads, leadsCount}
}