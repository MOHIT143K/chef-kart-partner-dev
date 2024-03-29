import { getDb, ObjectId } from "../../db.js";
export const updateLead = async (req, res) => {
  const db = await getDb();
  const {
    fullName,
    mobileNo,
    householdType,
    society,
    sector,
    shiftDate,
    requirementNeeded,
    leadId,
  } = req.body;
  const lead = {
    fullName,
    mobileNo,
    householdType,
    society,
    sector,
    shiftDate,
    requirementNeeded,
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
      return res.status(404).json({error: "Not Found"});
    }
    return res.status(200).json({ lead: updatedLead.value });
  } catch (error) {
    return res.status(400).json({error: error.message});
  }
};
