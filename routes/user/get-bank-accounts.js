import { getDb } from "../../db.js";

export const getBankAccounts = async (req, res) => {
  const db = await getDb();
  const { userId } = req;
  const { offset = 0, limit = 10 } = req.query;
  try {
    const bankAccounts = await db
      .collection("bank-account")
      .find({ createdBy: userId })
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    bankAccounts.forEach((bankAccount) => {
      bankAccount.accountNo = bankAccount.accountNumber.slice(0, 4) + "*******";
    });
    return res.status(200).json({ bankAccounts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
