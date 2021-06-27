import { getDb, ObjectId } from "../../db.js";

export const updateDefaultBankAccount = async (req, res) => {
  const db = await getDb();
  const { accountId } = req.body;
  const { userId } = req;

  if (!accountId) {
    return res.status(400).send("Invalid Client Details");
  }

  try {
    const updatedUser = await db
      .collection("user")
      .findOneAndUpdate(
        { _id: ObjectId(userId) },
        { $set: { defaultAccountId: accountId, updatedAt: Date.now() } }
      );

    if (!updatedUser.value) {
      return res.status(404).send("Not Found");
    }

    return res.status(200).send("Updated Successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error!");
  }
};
