import moment from "moment";
import { getDb } from "../../db.js";

export const getNotifications = async (req, res) => {
  const db = await getDb();
  const { userId } = req;
  const { offset = 0, limit = 20 } = req.query;

  try {
    const leads = await db
      .collection("lead")
      .find({
        createdBy: userId,
      })
      .sort({ updatedAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .toArray();

    const notifications = leads
      .filter(
        ({ status }) => status === "bank_added" || status === "wallet_added"
      )
      .map(({ payment, status }) => {
        const dateString = moment(payment.paidDate).format(
          "DD MMMM, YYYY, HH:MM A"
        );
        const amount = `+${payment.amount}`;
        const notification = { dateString, amount };

        if (status === "wallet_added") {
          notification["message"] = "Money Credited";
        } else if (status === "bank_added") {
          notification["message"] = "Added to Bank";
        }
        return notification;
      });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
