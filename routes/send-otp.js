import { optService } from "./../config/config.js";
import { getDb } from "../db.js";
import { isValidPhoneNo } from "../helpers/utils.js";

export const sendOTP = async (req, res) => {
  const { phoneNo } = req.body;

  if (!phoneNo || !isValidPhoneNo(phoneNo)) {
    return res.status(400).send("Invalid Client Details");
  }

  optService.send(phoneNo, otpSenerId, async function (err, data) {
    const db = await getDb();
    if (data.type != "error") {
      const user = db.collection("user").findOne({ phoneNo });

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
