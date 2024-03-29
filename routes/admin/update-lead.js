import { getDb, ObjectId } from "../../db.js";
export const adminUpdateLead = async (req, res) => {
  const db = await getDb();
  const leadId = req.body._id;
  delete req.body["_id"];
  try {
    const updatedLead = await db
      .collection("lead")
      .findOneAndUpdate(
        { _id: ObjectId(leadId) },
        { $set: { ...req.body, updatedAt: Date.now() } },
        { returnDocument: "after" }
      );
    if (!updatedLead.value) {
      return res.status(404).json({ error: "Not Found" });
    }
    return res.status(200).json({ lead: updatedLead.value });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
