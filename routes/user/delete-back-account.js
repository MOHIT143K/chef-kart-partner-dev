import { getDb, ObjectId } from "../../db.js";

export const deleteBankAccount = async (req, res) => {
  const db = await getDb();
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({error: "Invalid Client Details"});
  }

  try {
    const deletedBankAccount = await db
      .collection("bank-account")
      .findOneAndDelete({ _id: ObjectId(accountId) });

    if (!deletedBankAccount.value) {
      return res.status(404).json({error: "Not Found"});
    }

    return res.status(200).json({message: "Deleted Successfully!"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Server Error!"});
  }
};
