import { getDb, ObjectId } from "../../db.js";
import { optService } from "../../config/config.js";

export const updateBankAccount = async (req, res) => {
  const db = await getDb();
  const { mobileNo } = req;
  const {
    accountNumber,
    verifyAccountNumber,
    accountHolderName,
    ifscCode,
    bankName,
    otp,
    accountId,
  } = req.body;

  if (
    !(
      accountNumber &&
      accountHolderName &&
      verifyAccountNumber &&
      ifscCode &&
      bankName &&
      otp &&
      accountId
    )
  ) {
    return res.status(400).json({ error: "Invalid Client Details" });
  }

  if (accountNumber.length < 9) {
    return res.status(400).json({ error: "Invalid Account Number" });
  }

  if (accountNumber !== verifyAccountNumber) {
    return res
      .status(400)
      .json({ error: "Confirm Account Number Mismatching" });
  }

  optService.verify(mobileNo, otp, async function (err, response) {
    if (response.type == "error") {
      return res.status(400).json({ error: "Invalid OTP" });
    } else {
      const bankAccountDetails = {
        accountNumber,
        accountHolderName,
        ifscCode,
        bankName,
        updatedAt: Date.now(),
      };

      try {
        const updatedBankAccountNode = await db
          .collection("bank-account")
          .findOneAndUpdate(
            { _id: ObjectId(accountId) },
            { $set: { ...bankAccountDetails } },
            { returnDocument: "after" }
          );

        if (!updatedBankAccountNode.value) {
          return res.status(404).json({ error: "Bank Account Not Found" });
        }
        return res
          .status(200)
          .json({ bankAccount: updatedBankAccountNode.value });
      } catch (error) {
        if (error.code === 11000) {
          return res
            .status(422)
            .json({ error: "Bank Account Already Exists!" });
        }
        console.log(error);
        return res.status(500).json({ error: "Server Error!" });
      }
    }
  });
};
