import { initDb, getDb } from "../db.js";

const testMethod = async () => {
  const db = await getDb();
  const userExists = await db.collection("user").findOne();
  console.log(userExists);
};

// initDb(testMethod());

initDb(function (err) {
  if (err) {
    throw err;
  } else {
    testMethod();
  }
});
