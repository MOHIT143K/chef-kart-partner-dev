import { getDb, ObjectId } from "../../db.js";
import { optService } from "../../config/config.js";

export const updateMobileNo = async (req, res) => {
  const db = await getDb();
  const { mobileNo, otp } = req.body;
  const { userId } = req;

  //Node-MSG91 Client
  optService.verify(mobileNo, otp, async function (err, response) {
    if (response.type == "error") {
      return res.status(400).json({ error: response.message });
    } else {
      try {
        const user = await db
          .collection("user")
          .findOneAndUpdate(
            { _id: ObjectId(userId) },
            { $set: { updatedAt: Date.now(), mobileNo } },
            { returnDocument: "after" }
          );

        if (!user) {
          return res.status(404).json({ error: "User Not Present" });
        }
        return res.status(200).json({ updatedMobileNo: user.value.mobileNo });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(422).json({ error: "Duplicate Lead" });
        } else {
          return res.status(422).json({ error: "Server Error" });
        }
      }
    }
  });
};
