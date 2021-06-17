import { initDb, getDb } from "../db.js";

const checkUser = async () => {
  const db = await getDb();
  const userExists = await db.collection("user").findOne();
  console.log(userExists);
};

const deleteUser = async (mobileNo) => {
  const db = await getDb();
  const deletedUser = await db.collection("user").findOneAndDelete({ mobileNo });
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
