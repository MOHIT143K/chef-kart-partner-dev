import { getDb } from "../../db.js";

export const getLeads = async (req, res) => {
  const db = await getDb();
  const { userId } = req;
  const { offset = 0, limit = 10, startDate, endDate, type } = req.query;

  const fromTimeStamp = startDate ? Number(startDate) : 0;
  const toTimeStamp = endDate ? Number(endDate): Date.now();

  const leadTypes = type
    ? type === "paid"
      ? ["wallet_added", "bank_added"]
      : ["pending"]
    : ["pending", "bank_failed", "wallet_added", "bank_added", "cancelled"];

  try {
    const leads = await db
      .collection("lead")
      .find({
        createdBy: userId,
        updatedAt: { $gte: fromTimeStamp, $lte: toTimeStamp },
        status: { $in: leadTypes },
      })
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
