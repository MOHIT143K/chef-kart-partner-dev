import { getDb, ObjectId } from "../../db.js";

export const updateUser = async (req, res) => {
  const db = await getDb();
  const { userId } = req;

  const { fullName, emailId, profession } = req.body;

  if (!(fullName && emailId && profession)) {
    return res.status(400).send("Invalid Details");
  }

  const userToUpdate = {
    fullName,
    emailId,
    profession,
    updatedAt: Date.now(),
  };

  try {
    const updatedUser = await db
      .collection("user")
      .findOneAndUpdate(
        { _id: ObjectId(userId) },
        { $set: { ...userToUpdate } },
        { returnDocument: "after" }
      );

    return res.status(200).json({ user: updatedUser.value });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error!");
  }
};
