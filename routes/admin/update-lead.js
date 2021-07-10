import { getDb, ObjectId } from "../../db.js";
export const adminUpdateLead = async (req, res) => {
  const db = await getDb();
  const { fullName, mobileNo, householdType, society,
    sector,shiftDate,requirementNeeded,leadId, status
  } = req.body;

  const lead = {
    fullName,
    mobileNo,
    householdType,
    society,
    sector,
    shiftDate,
    requirementNeeded,
    status,
    payment: {
        amount: 0,
        paidDate: null,
        paidAccount: null,
      },
    updatedAt: Date.now(),
  };

  try {
    const updatedLead = await db
      .collection("lead")
      .findOneAndUpdate(
        { _id: ObjectId(leadId) },
        { $set: { ...lead } },
        { returnDocument: "after" }
      );
    if (!updatedLead.value) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).json({ lead: updatedLead.value });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
