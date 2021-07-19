import { getDb } from "../../db.js";

export const getLeads = async (req, res) => {
  const db = await getDb();
  const { userId } = req;
  const { offset = 0, limit = 10, startDate, endDate } = req.query;
  
  const fromTimeStamp = startDate ? new Date(`${startDate.split('-')[0]}-01-${startDate.split('-')[1]}`).getTime(): 0;
  const toTimeStamp = endDate ? new Date(`${endDate.split('-')[0]}-01-${endDate.split('-')[1]}`).getTime(): Date.now();


  try {
    const leads = await db
      .collection("lead")
      .find({ createdBy: userId, updatedAt: {$gte: fromTimeStamp, $lte: toTimeStamp} })
      .sort({ createdAt: -1})
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    return res.status(200).json({ leads });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
};
