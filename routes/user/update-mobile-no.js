import { getDb, ObjectId } from "../../db.js";
import { optService } from "../../config/config.js";

export const updateMobileNo = async (req, res) => {
  const db = await getDb();
  const { mobileNo, otp } = req.body;
  const { userId } = req;

  //Node-MSG91 Client
  optService.verify(mobileNo, otp, async function (err, response) {
    if (response.type == "error") {
      return res.status(400).send(response.message);
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
          return res.status(404).send("User Not Present");
        }
        return res.status(200).json({ updatedMobileNo: user.value.mobileNo });
      } catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
      }
    }
  });
};
