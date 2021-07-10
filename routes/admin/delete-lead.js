import { getDb, ObjectId } from "../../db.js";

export const adminDeleteLead = async (req, res) => {
  const db = await getDb();
  const { leadId } = req.body;

  if (!leadId) {
    return res.status(400).send("Invalid Client Details");
  }

  try {
    const deletedLead = await db
      .collection("lead")
      .findOneAndDelete({ _id: ObjectId(leadId) });

    if (!deletedLead.value) {
      return res.status(404).send("Not Found");
    }

    return res.status(200).send("Deleted Lead Successfully!");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error!");
  }
};
