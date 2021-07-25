import { getDb, ObjectId } from "../../db.js";

export const updateDefaultBankAccount = async (req, res) => {
  const db = await getDb();
  const { accountId } = req.body;
  const { userId } = req;

  if (!accountId) {
    return res.status(400).json({ error: "Invalid Client Details" });
  }

  try {
    const updatedUser = await db
      .collection("user")
      .findOneAndUpdate(
        { _id: ObjectId(userId) },
        { $set: { defaultAccountId: accountId, updatedAt: Date.now() } }
      );

    if (!updatedUser.value) {
      return res.status(404).json({ error: "Not Found" });
    }

    return res.status(200).json({ message: "Updated Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error!" });
  }
};
