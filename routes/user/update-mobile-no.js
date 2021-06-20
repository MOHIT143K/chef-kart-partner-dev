import { getDb, ObjectId } from "../../db.js";

export const updateUser = async (req, res) => {
  const db = await getDb();
  const userId = req._id;

  const { mobileNo } = req.body;

  const userToUpdate = {
    fullName,
    emailId,
    profession,
    profilePicUrl,
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
      
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(422).send("Duplicate Lead");
    }
  }

  return res.status(200).send("Just for checking");
};
