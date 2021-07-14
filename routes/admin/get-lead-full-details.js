import { getDb, ObjectId } from "../../db.js";

export const adminGetLeadFullDetails = async (req, res) => {
  const db = await getDb();
  const { leadId } = req.body;
  try {
    const lead = await db.collection("lead").findOne({ _id: ObjectId(leadId)})
    const user = await db.collection("user").findOne({ _id: ObjectId(lead.createdBy) });
    const bankAccounts = await db.collection("bank-account").find({ createdBy: lead.createdBy }).toArray();

    return res.status(200).json({ lead, leadGenerator: { ...user, bankAccounts }});
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};
