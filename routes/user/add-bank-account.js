import { getDb } from "../../db.js";
import { optService } from "../../config/config.js";

export const addBankAccount = async (req, res) => {
  const db = await getDb();
  const { userId, mobileNo } = req;
  const {
    accountNumber,
    verifyAccountNumber,
    accountHolderName,
    ifscCode,
    bankName,
    otp,
  } = req.body;
  if (
    !(
      accountNumber &&
      accountHolderName &&
      verifyAccountNumber &&
      ifscCode &&
      bankName &&
      otp
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
      return res.status(400).json({ error: response.message });
    } else {
      const bankAccountDetails = {
        accountNumber,
        accountHolderName,
        ifscCode,
        bankName,
        createdBy: userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      try {
        const createdBankAccountNode = await db
          .collection("bank-account")
          .insertOne(bankAccountDetails);
        const bankAccount = createdBankAccountNode.ops[0];
        return res.status(200).json({ bankAccount });
      } catch (error) {
        if (error.code === 11000) {
          return res
            .status(422)
            .json({ error: "bank_already_exists" });
        }
        console.log(error);
        return res.status(500).json({ error: "Server Error!" });
      }
    }
  });
};
