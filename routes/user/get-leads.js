import { getDb } from "../../db.js";

export const getLeads = async (req, res) => {
  const db = await getDb();
  const { userId } = req;
  const { offset = 0, limit = 10, startDate, endDate, type } = req.query;

  const fromTimeStamp = startDate
    ? new Date(
        `${startDate.split("-")[0]}-01-${startDate.split("-")[1]}`
      ).getTime()
    : 0;
  const toTimeStamp = endDate
    ? new Date(`${endDate.split("-")[0]}-01-${endDate.split("-")[1]}`).getTime()
    : Date.now();

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
    return res.status(500).send({ error: error.message });
  }
};
