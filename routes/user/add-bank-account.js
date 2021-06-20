import { getDb, ObjectId } from "../../db.js";
import { optService } from "../../config/config.js";

export const addBankAccount = async (req, res) => {
  const db = await getDb();
  const { userId, mobileNo } = req;
  const { accountNumber, accountHolderName, ifscCode, bankName, otp } =
    req.body;

  if (!(accountNumber && accountHolderName && ifscCode && bankName && otp)) {
    return res.status(400).send("Invalid Client Details");
  }

  optService.verify(mobileNo, otp, async function (err, response) {
    if (response.type == "error") {
      return res.status(400).send(response.message);
    } else {
      const bankAccountDetails = {
        accountNumber,
        accountHolderName,
        ifscCode,
        bankName,
        createdBy: ObjectId(userId),
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
          return res.status(422).send("Bank Account Already Exists!");
        }
        console.log(error);
        return res.status(500).send("Server Error!");
      }
    }
  });
};
