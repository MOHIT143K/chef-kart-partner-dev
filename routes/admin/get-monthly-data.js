import { getDb } from "../../db.js";
import { parse } from "json2csv";

export const getMonthlyData = async (req, res) => {
  const db = await getDb();
  const { offset = 0, limit = 10000, startDate, endDate } = req.query;

  const fromTimeStamp = startDate
    ? new Date(
        `${startDate.split("-")[0]}-01-${startDate.split("-")[1]}`
      ).getTime()
    : Date.now() - 86400000 * 30;
  const toTimeStamp = endDate
    ? new Date(`${endDate.split("-")[0]}-01-${endDate.split("-")[1]}`).getTime()
    : Date.now();

  const fields = [
    "_id",
    "mobileNo",
    "fullName",
    "sector",
    "requirementNeeded",
    "createdAt",
    "updatedAt",
    "status",
    "payment.amount",
  ];
  const opts = { fields };

  try {
    const leads = await db
      .collection("lead")
      .find({ createdAt: { $gte: fromTimeStamp, $lte: toTimeStamp } })
      .sort({ updatedAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();
    try {
      const finalLeads = leads.map((lead) => {
        return {
          ...lead,
          createdAt: new Date(lead.createdAt).toDateString(),
          updatedAt: new Date(lead.updatedAt).toDateString(),
        };
      });
      const csv = parse(finalLeads, opts);
      res.set("Content-Type", "application/octet-stream");
      res.send(csv);
      console.log(csv);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server Error" });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
