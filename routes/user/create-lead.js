import { getDb } from "../../db.js";

export const createLead = async (req, res) => {
  const db = await getDb();
  const { userId } = req;

  const {
    fullName,
    mobileNo,
    householdType,
    society,
    sector,
    shiftDate,
    requirementNeeded,
  } = req.body;

  const lead = {
    fullName,
    mobileNo,
    householdType,
    society,
    sector,
    shiftDate,
    requirementNeeded,
    createdBy: userId,
    status: "pending",
    payment: {
      amount: 0,
      paidDate: null,
      paidAccount: null,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    await db.collection("lead").insertOne(lead);
    return res.status(200).send("Lead Created");
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(422).json({error: "Duplicate Lead"});
    }
  }

  return res.status(200).send("Just for checking");
};
