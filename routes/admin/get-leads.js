import { getDb } from "../../db.js";

export const adminGetLeads = async (req, res) => {
  const db = await getDb();
  const { offset = 0, limit = 50, type = null } = req.body;
  const leadsToShow = type || ["pending", "bank_failed"];
  try {
    const leads = await db
      .collection("lead")
      .find({ status: { $in: leadsToShow } })
      .sort({ updatedAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    return res.status(200).json({ leads });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
