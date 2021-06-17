import { optService, otpSenerId } from "../config/config.js";
import { getDb } from "../db.js";
import { isValidMobileNo } from "../helpers/utils.js";

export const sendOTP = async (req, res) => {
  const { mobileNo } = req.body;

  if (!mobileNo || !isValidMobileNo(mobileNo)) {
    return res.status(400).send("Invalid Client Details");
  }

  optService.send(mobileNo, otpSenerId, async function (err, data) {
    const db = await getDb();
    if (data.type !== "error") {
      const user = await db.collection("user").findOne({ mobileNo });
      if (!user) {
        return res.status(200).send({ newUser: true });
      } else {
        return res.status(200).send({ newUser: false });
      }
    } else {
      console.log(data);
      return res.status(500).send(data.message);
    }
  });
};
