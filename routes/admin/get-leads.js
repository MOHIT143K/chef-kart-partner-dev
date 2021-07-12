import { getDb } from "../../db.js";

export const adminGetLeads = async (req, res) => {
  const db = await getDb();
  const { offset = 0, limit = 50, type=null } = req.body;
  const leadsToShow = type || ['pending','bank_failed'];
  try {
    const leads = await db
      .collection("lead")
      .find({ status: { '$in': leadsToShow }})
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    return res.status(200).json({ leads });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};
