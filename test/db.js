import { initDb, getDb } from "../db.js";

const checkUser = async () => {
  const db = await getDb();
  const userExists = await db.collection("user").findOne();
  console.log(userExists);
};

const deleteUser = async (phoneNo) => {
  const db = await getDb();
  const deletedUser = await db.collection("user").findOneAndDelete({ phoneNo });
  console.log(deletedUser);
};

initDb(function (err) {
  if (err) {
    throw err;
  } else {
    // checkUser();
    deleteUser("9868639770");
  }
});
