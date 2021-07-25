import { getDb } from "../../db.js";

export const generateUsersReport = async (req, res) => {
  const db = await getDb();
  const { offset = 0, limit = 50 } = req.query;
  try {
    const leads = await db
      .collection("lead")
      .find({})
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    return res.status(200).json({ leads });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
