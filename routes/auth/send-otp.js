import { getDb } from "../../db.js";
import { sendOTPHelper } from "../../helpers/send-otp.js";

export const sendOTP = async (req, res) => {
  const { mobileNo } = req.body;

  const sendOTPCallback = async (err, data) => {
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
  };

  const otpSent = sendOTPHelper(mobileNo, sendOTPCallback);

  if (!otpSent) {
    return res.status(400).send("Invalid Client Details");
  }
};